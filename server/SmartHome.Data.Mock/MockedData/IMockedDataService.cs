using SmartHome.Core.Domain;

namespace SmartHome.Data.Mock.MockedData;

public interface IMockedDataService
{
    public Task<List<User>> GetAllUsers();
    public Task SaveAllUsers(List<User> users);
}
