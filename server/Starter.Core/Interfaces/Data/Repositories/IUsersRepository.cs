using Starter.Core.Helpers.Params;
using Starter.Core.Models.Users;

namespace Starter.Core.Interfaces.Data.Repositories;

public interface IUserRepository
{
    Task<PagedList<UserListDto>> GetPagedAsync(StandardParams standardParams);
    Task<UserDto> GetAsync(Guid id);
}  