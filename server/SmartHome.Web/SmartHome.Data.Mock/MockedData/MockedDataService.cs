using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SmartHome.Core.Domain;

namespace SmartHome.Data.Mock.MockedData;

public class MockedDataService : IMockedDataService
{
    private const string MockedUsersLocation = @"..\SmartHome.Data.Mock\MockedData\users.mock.json";
    private readonly object _lockObject = new object();

    public static void RegisterJsonConverters()
    {
        JsonConvert.DefaultSettings = (() =>
        {
            var settings = new JsonSerializerSettings();
            settings.Converters.Add(new StringEnumConverter());
            return settings;
        });
    }

    public Task<List<User>> GetAllUsers()
    {
        var usersJson = File.ReadAllText(MockedUsersLocation, Encoding.UTF8);
        var result = JsonConvert.DeserializeObject<List<User>>(usersJson);

        return Task.FromResult(result);
    }

    public Task SaveAllUsers(List<User> users)
    {
        lock(_lockObject)
        {
            var usersJson = JsonConvert.SerializeObject(users, Formatting.Indented);
            File.WriteAllText(MockedUsersLocation, usersJson, Encoding.UTF8);
        }

        return Task.CompletedTask;
    }
}
