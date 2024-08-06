using Starter.Core.Interfaces.Data.Repositories;

namespace Starter.Core.Interfaces.Data;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    Task<bool> SaveAllAsync();
}