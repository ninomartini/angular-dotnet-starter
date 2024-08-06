namespace Starter.Data.Repositories;

public class UserRepository : IUserRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;

		public UserRepository(DataContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}
		
		public async Task<PagedList<UserListDto>> GetPagedAsync(StandardParams standardParams)
		{
			var query = _context.Users
				.Include(r => r.UserRoles)
				.Select(u => new UserListDto
				{
					Id = u.Id,
					UserName = u.UserName,
					FirstName = u.FirstName,
					LastName = u.LastName,
					Email = u.Email,
					Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
				})
				.AsQueryable();

			if (!string.IsNullOrEmpty(standardParams.Filter))
				query = query.Where(x => x.UserName.Contains(standardParams.Filter)
				                         || x.Email.Contains(standardParams.Filter)
				                         || (x.FirstName + " " + x.LastName).Contains(standardParams.Filter));

			if (standardParams.SortDesc)
			{
				query = standardParams.SortKey switch
				{
					"userName" => query.OrderByDescending(x => x.UserName),
					"email" => query.OrderByDescending(x => x.Email),
					"fullName" => query.OrderByDescending(x => x.FirstName).ThenByDescending(x => x.LastName),
					_ => query.OrderByDescending(x => x.Id),
				};
			}
			else
			{
				query = standardParams.SortKey switch
				{
					"userName" => query.OrderBy(x => x.UserName),
					"email" => query.OrderBy(x => x.Email),
					"fullName" => query.OrderBy(x => x.FirstName).ThenBy(x => x.LastName),
					_ => query.OrderByDescending(x => x.Id),
				};
			}

			return await PagedList<UserListDto>.CreateAsync(query.AsNoTracking(), standardParams.PageNumber,
				standardParams.PageSize);
		}

		public async Task<UserDto> GetAsync(Guid id)
		{
			var user = await _context.Users
				.Include(r => r.UserRoles)
				.ThenInclude(r => r.Role)
				.Select(u => new UserDto
				{
					Id = u.Id,
					UserName = u.UserName,
					FirstName = u.FirstName,
					LastName = u.LastName,
					Email = u.Email,
					PhoneNumber = u.PhoneNumber,
					Roles = u.UserRoles.Select(r => r.Role.Name).ToList(),
				}).FirstOrDefaultAsync(u => u.Id == id);

			return user;
		}
	}      