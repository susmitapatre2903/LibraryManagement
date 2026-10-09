using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Api.Data;
using LibraryManagement.Api.Models;
using LibraryManagement.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LibraryContext _db;
        private readonly TokenService _tokens;
        private readonly PasswordHasher<User> _hasher = new();

        public AuthController(LibraryContext db, TokenService tokens)
        {
            _db = db;
            _tokens = tokens;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user is null)
                return Unauthorized("Invalid username or password.");
            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid username or password.");
            var (token, expiresAt) = _tokens.Create(user);
            return new LoginResponse(token, user.Username, user.Role, expiresAt);

        }

       
    }
}
