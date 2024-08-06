namespace Starter.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UnitOfWork(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
		
    public IUserRepository UserRepository => new UserRepository(_context, _mapper);

    public async Task<bool> SaveAllAsync()
    {
        if (_context.ChangeTracker.HasChanges())
        {
            return await _context.SaveChangesAsync() > 0;
        }

        return true;
    }

}  