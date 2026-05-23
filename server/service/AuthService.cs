using System.ComponentModel.DataAnnotations;
using api.Controllers;
using dataaccess;
using DataAccess.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using service.Abstractions;
using service.Models.Request;
using service.Models.Responses;

namespace service;

public class AuthService(MyDbContext ctx, IPasswordHasher<User> hasher) : IAuthService
{

    public async Task<AuthUserInfo> Authenticate(LoginRequest request)
    {
        var user = await ctx.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName, CancellationToken.None);
        if (user == null)
            throw new Exception("User not found");
        
        return 
            hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed ? 
                throw new Exception("Password verification failed") 
                : 
                new AuthUserInfo(user.Id, user.UserName);
    }

    public async Task<AuthUserInfo> Register(RegisterRequest request)
    {
        Validator.ValidateObject(request, new ValidationContext(request), true);
        
        var user = await ctx.Users.FirstOrDefaultAsync(x => x.UserName == request.UserName, CancellationToken.None);
        if (user != null)
            throw new Exception("User already exists.");

        user = new User()
        {
            Id = Guid.NewGuid().ToString(),
            UserName = request.UserName,
        };
        user.PasswordHash = hasher.HashPassword(user, request.Password);
        
        ctx.Users.Add(user);
        await ctx.SaveChangesAsync();
        
        return new AuthUserInfo(user.Id, user.UserName);
    }

    public async Task<AuthUserInfo?> GetUserInfo(String id)
    {
        var user = await ctx.Users.FirstOrDefaultAsync(u => u.Id == id, CancellationToken.None);
        return user == null ? throw new Exception("User does not exist.") : new AuthUserInfo(user.Id, user.UserName);
    }

    public async Task<string> SetDisplayName(SetDisplayNameRequest request)
    {
        Validator.ValidateObject(request, new ValidationContext(request), true);
        
        var user = await ctx.Users.FirstOrDefaultAsync(u => u.Id.Equals(request.UserId));
        if (user == null) throw new ValidationException("What user??");
        var udl = await ctx.UserDeviceLinks.FirstOrDefaultAsync(d => d.DeviceId.Equals(request.DeviceId));
        if (udl != null) {
            udl.User = user;
            udl.UserId = user.Id;
            udl.DisplayName = request.DisplayName;
        }
        else {
            udl = new UserDeviceLink()
            {
                DeviceId = request.DeviceId,
                DisplayName = request.DisplayName,
                User = user,
                UserId = user.Id
            };
            ctx.UserDeviceLinks.Add(udl);
        }
        
        await ctx.SaveChangesAsync();
        return request.DisplayName;
    }
}