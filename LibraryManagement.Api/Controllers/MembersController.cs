using LibraryManagement.Api.Data;
using LibraryManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers

{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly LibraryContext _db;
public MembersController(LibraryContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetAll() =>
            await _db.Members.ToListAsync();

       
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> Get(int id)
        {
            var member = await _db.Members.FindAsync(id);
            return member is null ? NotFound() : member;
        }

       
        [HttpPost]
        public async Task<ActionResult<Member>> Create(Member member)
        {
            _db.Members.Add(member);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = member.Id }, member);
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Member member)
        {
            if (id != member.Id) return BadRequest();
            _db.Entry(member).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var member = await _db.Members.FindAsync(id);
            if (member is null) return NotFound();
            _db.Members.Remove(member);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
