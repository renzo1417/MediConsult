using MedConsult.Models.Common;
using MedConsult.Models.Users;
using MedConsult.Models.Clinical;

namespace MedConsult.Models.Engagement;

/// <summary>
/// Patient review and testimonial entity matching the interactive testimonials showcase.
/// Stores patient feedback, clinical rating scores, verified badge, and service category.
/// </summary>
public class Review : BaseEntity
{
    public int? ConsultationId { get; set; }
    public virtual Consultation? Consultation { get; set; }

    public int? PatientId { get; set; }
    public virtual Patient? Patient { get; set; }

    public int? DoctorId { get; set; }
    public virtual Doctor? Doctor { get; set; }

    public string AuthorName { get; set; } = string.Empty;
    public string? AuthorRole { get; set; } // e.g. "Urgent Telehealth Patient"
    public string? Initials { get; set; }
    public string? AvatarUrl { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string ServiceCategory { get; set; } = "Video Telehealth";
    public string Badge { get; set; } = "Verified Patient";
    public double Rating { get; set; } = 5.0; // 1.0 to 5.0
    public bool IsVerified { get; set; } = true;
}
