using MedConsult.Models.Common;
using MedConsult.Models.Enums;

namespace MedConsult.Models.Users;

/// <summary>
/// Core user account entity supporting patient, doctor, and admin authentication.
/// </summary>
public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; } = UserRole.Patient;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Patient? PatientProfile { get; set; }
    public virtual Doctor? DoctorProfile { get; set; }
}
