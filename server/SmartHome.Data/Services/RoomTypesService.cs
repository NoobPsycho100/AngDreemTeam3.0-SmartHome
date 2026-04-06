using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain.Devices;
using SmartHome.Core.Services;
using SmartHome.Data.Context;

namespace SmartHome.Data.Services;

public class RoomTypesService: IRoomTypesService
{
    private readonly ApplicationDbContext _context;

    public RoomTypesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoomType>> GetRoomTypes()
    {
        return await _context.RoomTypes.ToListAsync();
    }

    public async Task AddRoomType(string typeName)
    {
        var type = new RoomType
        {
            TypeName = typeName,
        };

        await _context.RoomTypes.AddAsync(type);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateRoomType(long typeId, string typeName)
    {
        var type = await _context.RoomTypes.SingleAsync(x => x.RoomTypeId == typeId);
        type.TypeName = typeName;

        await _context.SaveChangesAsync();
    }
}
