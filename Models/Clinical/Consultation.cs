using MedConsult.Models.Common;
using MedConsult.Models.Enums;
using MedConsult.Models.Users;
using MedConsult.Models.Engagement;

namespace MedConsult.Models.Clinical;

/// <summary>
/// Telehealth consultation encounter connecting a patient with a physician.
/// Tracks appointment schedule, video room session, clinical diagnosis, and linked orders.
/// </summary>
public class Consultation : BaseEntity
{
    public int PatientId { get; set; }
    public virtual Patient Patient { get; set; } = null!;

    public int DoctorId { get; set; }
    public virtual Doctor Doctor { get; set; } = null!;

    public int? IntakeId { get; set; }
    public virtual MedicalHistoryIntake? Intake { get; set; }

    public DateTime ScheduledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public ConsultationStatus Status { get; set; } = ConsultationStatus.Scheduled;

    public string? MeetingRoomUrl { get; set; }
    public string ChiefComplaint { get; set; } = string.Empty;
    public string? DoctorClinicalNotes { get; set; }
    public string? Diagnosis { get; set; }

    // Navigation properties for downstream clinical artifacts
    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    public virtual ICollection<LabOrder> LabOrders { get; set; } = new List<LabOrder>();
    public virtual Review? PatientReview { get; set; }
}
