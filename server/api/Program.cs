
using System.Text.Json.Serialization;
using api.Controllers.MQTT;
using dataaccess;
using DataAccess.Entities;
using DefaultNamespace;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using service;
using service.Abstractions;
using service.Models.Request;
using service.Security;
using Sieve.Services;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.GroupRealtime;

namespace api;
public class Program
{
    public static void ConfigureServices(IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddSingleton<AppOptions>(provider =>
        {
            var configuration = provider.GetRequiredService<IConfiguration>();
            var appOptions = new AppOptions();
            configuration.GetSection(nameof(AppOptions)).Bind(appOptions);
            return appOptions;
        });
        services.AddOpenApiDocument();

        // repos
        
        // services
        //services.AddScoped<IService<BaseBookResponse, CreateBookDto, UpdateBookDto>, BookService>();
        services.AddScoped<ISieveProcessor, SieveProcessor>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, JwtService>();
        services.AddScoped<IQuizService, QuizService>(); 
        services.AddScoped<IPasswordHasher<User>, NSecArgon2IdPasswordHasher>();
        services.AddScoped<IDisplayNameService, DisplayNameService>();
        services.AddScoped<IScoreService, ScoreService>();
        
        services.AddScoped<IPublisher<PairingRequest>, DeviceListener>();
        services.AddScoped<IPublisher<AnswerRequest>, QuizAnswerListener>();
        services.AddScoped<IPublisher<ButtonPressRequest>, ButtonPressListener>();

        services.AddScoped<DeviceCommandSender>();
        
        // seeder
        //services.AddScoped<ISeeder, BogusSeed>();
        //services.AddScoped<ISeeder, SimpleSeeder>();
        services.AddProblemDetails();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        
        // redis + backplane
        //builder.Services.AddRedisSseBackplane(); // aktiver, når man er tættere på produktions dagen
        builder.Services.AddInMemorySseBackplane();
        builder.Services.AddGroupRealtime();
        builder.Services.AddEfRealtime();
        
        services.AddDbContext<MyDbContext>((services, options) =>
        {
            options.UseNpgsql(services.GetRequiredService<AppOptions>().DbConnectionString)
                /*.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)*/;
        });
        
        
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = JwtService.ValidationParameters(
                    builder.Configuration
                );
                // Add this for debugging
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"Authentication failed: {context.Exception}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine("Token validated successfully");
                        return Task.CompletedTask;
                    },
                };
            });
        services.AddAuthorization(options =>
        {
            options.FallbackPolicy = new AuthorizationPolicyBuilder()
                // Globally require users to be authenticated
                .RequireAuthenticatedUser()
                .Build();
        });
        
        
        
        
        services.AddMqttControllers();
        services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.WriteIndented = true;
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
        
        services.AddCors();
    }
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        ConfigureServices(builder.Services, builder);
        
        var app = builder.Build();
        
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            db.Database.EnsureCreated();
        }
        
        app.UseOpenApi();
        app.UseSwaggerUi();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseExceptionHandler();
        app.MapControllers();
        
        //app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(x => true));

        // config færdig her
        //app.GenerateApiClientsFromOpenApi("/../../client/src/core/ServerAPI.ts").GetAwaiter().GetResult();
        // for development
        using (var scope = app.Services.CreateScope())
        {
            var mqtt = app.Services.GetRequiredService<IMqttClientService>();
            var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var mqttSection = config.GetSection("MQTT");
            mqtt.ConnectAsync(
                        mqttSection.GetValue<string>("Host"), 
                        mqttSection.GetValue<int>("Port"), 
                        mqttSection.GetValue<string>("Username")
                    ).GetAwaiter().GetResult();
            
            //app.Services.GetService()
        }
        
        app.Run();
        
    }
}
