using System.ComponentModel.DataAnnotations;
using api.Controllers;
using dataaccess;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace service;

public interface IDisplayNameService
{
    Task<string> SetDisplayName(SetDisplayNameRequest name);
    Task<string> GetDisplayName(string name);
}

public class DisplayNameService(MyDbContext ctx) : IDisplayNameService
{
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

    public async Task<string> GetDisplayName(string deviceId)
    {
        var name = await ctx.UserDeviceLinks.FirstOrDefaultAsync(d => d.DeviceId.Equals(deviceId));
        return name == null ? "None" : name.DisplayName;
    }
    
}