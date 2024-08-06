namespace Starter.Api.Controllers;

[Authorize(Roles = "Administrator")]
public class UsersController : BaseApiController
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly ITokenService _tokenService;

    public UsersController(IUnitOfWork unitOfWork, UserManager<User> userManager, IMapper mapper, ITokenService tokenService)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
        _mapper = mapper;
        _tokenService = tokenService;
    }

    [Authorize(Roles = "Administrator")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsersPaged([FromQuery] StandardParams standardParams)
    {
        var users = await _unitOfWork.UserRepository.GetPagedAsync(standardParams);

        Response.AddPaginationHeader(users.CurrentPage,
            users.PageSize,
            users.TotalCount,
            users.TotalPages);

        return Ok(users);
    }
    
    [Authorize(Roles = "Administrator")]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(string id)
    {
        var isGuid = Guid.TryParse(id, out var userId);
        if (!isGuid)
            return BadRequest("Invalid user ID");

        var user = await _unitOfWork.UserRepository.GetAsync(userId);
        if (user == null) return NotFound("User not found");

        return Ok(user);
    }

    [Authorize(Roles = "Administrator")]
    [HttpPost]
    public async Task<ActionResult> CreateUser(UserCreateDto userCreateDto)
    {
        var newUser = new User
        {
            UserName = userCreateDto.UserName.ToLower(),
            Email = userCreateDto.Email.ToLower(),
            FirstName = userCreateDto.FirstName,
            LastName = userCreateDto.LastName,
            PhoneNumber = userCreateDto.PhoneNumber
        };

        var resultCreateUser = await _userManager.CreateAsync(newUser, userCreateDto.Password);
        if (!resultCreateUser.Succeeded) return BadRequest("Duplicate user");

        var selectedRoles = userCreateDto.Roles.Split(",").ToArray();

        var user = await _userManager.FindByNameAsync(userCreateDto.UserName);
        var resultAddToRoles = await _userManager.AddToRolesAsync(user!, selectedRoles);
        if (!resultAddToRoles.Succeeded) return BadRequest("Failed to add user roles");

        var userResult = await _unitOfWork.UserRepository.GetAsync(user.Id);
        if (userResult == null) return NotFound("User not found");

        return Ok(userResult);
    }

    [Authorize(Roles = "Administrator")]
    [HttpPut]
    public async Task<ActionResult<UserDto>> UpdateUser(UserUpdateDto userUpdateDto)
    {
        userUpdateDto.UserName = userUpdateDto.UserName.ToLower();
        userUpdateDto.Email = userUpdateDto.Email.ToLower();

        var user = await _userManager.FindByIdAsync(userUpdateDto.Id.ToString());
        if (user == null) return NotFound("User not found");

        var updatedUser = _mapper.Map(userUpdateDto, user);

        var result = await _userManager.UpdateAsync(updatedUser);
        if (!result.Succeeded) return BadRequest("Failed to update user");

        var selectedRoles = userUpdateDto.Roles.Split(",").ToArray();
        var userRoles = await _userManager.GetRolesAsync(user);

        result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded) return BadRequest("Failed to add user roles");

        result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!result.Succeeded) return BadRequest("Failed to remove user roles");

        return NoContent();
    }

    [Authorize(Roles = "Administrator")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var isGuid = Guid.TryParse(id, out var userId);
        if (!isGuid)
            return BadRequest("Invalid user ID");

        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound("User not found");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) BadRequest("Failed to delete user");

        return Ok();
    }
    
    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        var user = await _unitOfWork.UserRepository.GetAsync(User.GetUserId());
        if (user == null) return NotFound("User not found");

        if (user.Id != User.GetUserId())
            return Unauthorized();

        return user;
    }
    
    [Authorize]
    [HttpPost("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile(UserUpdateProfileDto userUpdateProfileDto)
    {
        userUpdateProfileDto.UserName = userUpdateProfileDto.Email.ToLower();

        if (userUpdateProfileDto.Id != User.GetUserId())
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userUpdateProfileDto.Id.ToString());
        if (user == null) return NotFound("User profile not found");

        var result = await _userManager.UpdateAsync(_mapper.Map(userUpdateProfileDto, user));
        if (!result.Succeeded) return BadRequest("Failed to update user profile");

        return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Token = await _tokenService.CreateTokenAsync(user),
            Roles = (List<string>)await _userManager.GetRolesAsync(user)
        };
    }
}