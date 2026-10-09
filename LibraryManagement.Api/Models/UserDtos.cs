using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Api.Models;

public record UserDto(int Id, string Username, string Role);

public class CreateUserRequest
{
    [Required, MinLength(3), MaxLength(50)]
    public string Username { get; set; } = "";

    [Required, MinLength(8)]
    public string Password { get; set; } = "";

    [Required]
    public string Role { get; set; } = "Librarian";
}