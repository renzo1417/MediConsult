using MedConsult.Models.Common;
using MedConsult.Models.Clinical;
using MedConsult.Models.Engagement;

namespace MedConsult.Models.Users;

/// <summary>
/// Healthcare provider profile storing board certifications, medical specialties,
/// consult volume metrics, ratings, and active consultation availability.
/// </summary>
public class Doctor : BaseEntity
{
    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public string MedicalLicenseNumber { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string Qualifications { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public double Rating { get; set; } = 5.0;
    public int TotalConsultations { get; set; }
    public decimal ConsultationFee { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? AvatarUrl { get; set; }

    // Navigation properties
    public virtual ICollection<Consultation> Consultations { get; set; } = new List<Consultation>();
    public virtual ICollection<Prescription> IssuedPrescriptions { get; set; } = new List<Prescription>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
