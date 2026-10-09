using LibraryManagement.Api.Data;
using LibraryManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private static readonly string[] AllowedRoles = { "Admin", "Librarian" };

    private readonly LibraryContext _db;
    private readonly PasswordHasher<User> _hasher = new();

    public UsersController(LibraryContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll() =>
        await _db.Users
            .OrderBy(u => u.Username)
            .Select(u => new UserDto(u.Id, u.Username, u.Role))
            .ToListAsync();

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserRequest request)
    {
        if (!AllowedRoles.Contains(request.Role))
            return BadRequest("Role must be Admin or Librarian.");

        var username = request.Username.Trim();
        if (await _db.Users.AnyAsync(u => u.Username == username))
            return Conflict("Username already exists.");

        var user = new User { Username = username, Role = request.Role };
        user.PasswordHash = _hasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new UserDto(user.Id, user.Username, user.Role));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (User.FindFirst("sub")?.Value == id.ToString())
            return BadRequest("You cannot delete your own account.");

        var user = await _db.Users.FindAsync(id);
        if (user is null) return NotFound();

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}