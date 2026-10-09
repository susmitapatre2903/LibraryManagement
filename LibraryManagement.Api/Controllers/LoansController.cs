using LibraryManagement.Api.Data;
using LibraryManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace LibraryManagement.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        private readonly LibraryContext _db;

        public LoansController(LibraryContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetAll() =>
            await _db.Loans
                     .OrderByDescending(l => l.BorrowedOn)
                     .Select(l => new LoanDto(
                          l.Id, l.BookId, l.Book!.Title,
                          l.MemberId, l.Member!.FullName,
                          l.BorrowedOn, l.DueOn, l.ReturnedOn))

                     .ToListAsync();

        [HttpPost("borrow")]

        public async Task<ActionResult<LoanDto>> Borrow(BorrowRequest request)
        {
            var book = await _db.Books.FindAsync(request.BookId);
            if (book is null) return NotFound("Book not found");

            var member = await _db.Members.FindAsync(request.MemberId);
            if (member is null) return NotFound("Member not found");

            if (book.CopiesAvailable < 1) return BadRequest("No copies available.");

            var loan = new Loan
            {
                BookId = book.Id,
                MemberId = member.Id,
                BorrowedOn = DateTime.UtcNow,
                DueOn = DateTime.UtcNow.AddDays(14),
            };
            book.CopiesAvailable--;
            _db.Loans.Add(loan);
            await _db.SaveChangesAsync();

            return Ok(new LoanDto(
                loan.Id,book.Id,book.Title, member.Id,member.FullName,
                loan.BorrowedOn,loan.DueOn,loan.ReturnedOn));
        }

    [HttpPost("{id}/return")]
     public async Task<IActionResult> Return(int id)
        {
            var loan = await _db.Loans.Include(l => l.Book).FirstOrDefaultAsync(l => l.Id == id);
            if (loan is null) return NotFound();
            if (loan.ReturnedOn is not null) return BadRequest("Already returned.");
            loan.ReturnedOn = DateTime.UtcNow;
            loan.Book!.CopiesAvailable++;
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

}
