using System.ComponentModel.DataAnnotations;
namespace LibraryManagement.Api.Models
{
    public class Member
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; } = "";

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; } = "";

        [MaxLength(20)]
        public string? Phone { get; set; }

        public DateTime JoinedOn { get; set; } = DateTime.UtcNow;


    }
}
