using System.Threading;
using Microsoft.Extensions.Options;
using Starter.Core.Dtos.Auth;

namespace Starter.Api.Controllers;

public class AuthController : BaseApiController
{
    private readonly AppSettings _appSettings;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;

    public AuthController(IOptions<AppSettings> appSettings, UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService,
        IMapper mapper, IEmailService emailService)
    {
        _appSettings = appSettings.Value;
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _mapper = mapper;
        _emailService = emailService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        User user = null;

        if (loginDto.UserName.Contains('@'))
            user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.NormalizedEmail == loginDto.UserName.ToUpper());

        if (user == null)
            user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.NormalizedUserName == loginDto.UserName.ToUpper());

        if (user == null) return Unauthorized();

        var loginResult = await _signInManager
            .CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!loginResult.Succeeded) return Unauthorized();

        var loggedInUser = new UserDto
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

        if (loggedInUser.Roles.Count == 0) return Unauthorized();

        return Ok(loggedInUser);
    }

    [HttpPut("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        registerDto.UserName = registerDto.UserName.ToLower();
        registerDto.Email = registerDto.Email.ToLower();
        
        if (await UserExists(registerDto.UserName)) return BadRequest("Username unavailable");
        if (await EmailExists(registerDto.Email)) return BadRequest("Email unavailable");

        var newUser = _mapper.Map<User>(registerDto);

        var resultNewUser = await _userManager.CreateAsync(newUser, registerDto.Password);
        if (!resultNewUser.Succeeded) return BadRequest(resultNewUser.Errors);

        var resultAddRole = await _userManager.AddToRoleAsync(newUser, "Guest");
        if (!resultAddRole.Succeeded) return BadRequest(resultAddRole.Errors);

        return new UserDto
        {
            Id = newUser.Id,
            UserName = newUser.UserName,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Email = newUser.Email,
            PhoneNumber = newUser.PhoneNumber,
            Token = await _tokenService.CreateTokenAsync(newUser),
            Roles = (List<string>)await _userManager.GetRolesAsync(newUser),
        };
    }
    
    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
    {
        var user = await _userManager.FindByNameAsync(changePasswordDto.UserName);
        if (user == null) return BadRequest("User not found");

        var result = await _userManager.ChangePasswordAsync(user,
            changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

        if (!result.Succeeded) return BadRequest();

        return NoContent();
    }
    
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
        if (user == null) return Accepted();

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var resetLink =
            $"{_appSettings.AppUrl}auth/reset-password?email={forgotPasswordDto.Email.ToLower()}&token={token}";

        var to = new List<string> { user.Email };

        var body = $@"<html>
                      <body>
                      <p>Hello {user.Email},</p>
                      <p>We generated a link to reset your password. If you did not request a password reset or if you change your mind then you may ignore this email and nothing will happen.</p>
                      <p>Reset your password (expires in 1 hour):</br><a href=""{resetLink}"">Click here to reset</a></p>
                      </body>
                      </html>
                     ";
        
        var emailData = new EmailData(to, "Reset your password", body );
        
        await _emailService.SendAsync(emailData, new CancellationToken());

        return Accepted();
    }
    
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
        if (user == null)
            return BadRequest("User not found");

        // angular converts + to spaces, convert spaces back to +
        resetPasswordDto.Token = resetPasswordDto.Token.Replace(" ", "+");

        var resetPassResult =
            await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
        if (!resetPassResult.Succeeded) return BadRequest(resetPassResult.Errors);

        return Ok();
    }

    private async Task<bool> UserExists(string userName)
    {
        return await _userManager.Users.AnyAsync(x => x.NormalizedUserName == userName.ToUpper());
    }

    private async Task<bool> EmailExists(string email)
    {
        return await _userManager.Users.AnyAsync(x => x.NormalizedEmail == email.ToUpper());
    }
}