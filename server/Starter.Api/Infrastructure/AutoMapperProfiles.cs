namespace Starter.Api.Infrastructure;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<User, UserDto>();
        CreateMap<User, UserListDto>();
        CreateMap<UserCreateDto, User>();
        CreateMap<UserUpdateDto, User>();
        CreateMap<RegisterDto, User>();
        CreateMap<UserUpdateProfileDto, User>();
    }
}