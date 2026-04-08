using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain.Devices;
using SmartHome.Core.Services;
using SmartHome.Data.Context;

namespace SmartHome.Data.Services;

public class DeviceTypesService: IDeviceTypesService
{
    private readonly ApplicationDbContext _context;

    public DeviceTypesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DeviceType>> GetDeviceTypes()
    {
        return await _context.DeviceTypes.ToListAsync();
    }

    public async Task AddDeviceType(string typeName)
    {
        var type = new DeviceType
        {
            TypeName = typeName,
        };

        await _context.DeviceTypes.AddAsync(type);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateDeviceType(long typeId, string typeName)
    {
        var type = await _context.DeviceTypes.SingleAsync(x => x.DeviceTypeId == typeId);
        type.TypeName = typeName;

        await _context.SaveChangesAsync();
    }
}
