
namespace LibraryManagement.Api.Models
{
    public record BorrowRequest(int BookId, int MemberId);
    public record LoanDto(
    int Id,
    int BookId,
    string BookTitle,
    int MemberId,
    string MemberName,
    DateTime BorrowedOn,
    DateTime DueOn,
    DateTime? ReturnedOn);
  
}
