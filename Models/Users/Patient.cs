using MedConsult.Models.Common;
using MedConsult.Models.Clinical;
using MedConsult.Models.Billing;

namespace MedConsult.Models.Users;

/// <summary>
/// Patient medical profile storing demographic information, emergency contacts,
/// and relationships to consultations, prescriptions, and lab orders.
/// </summary>
public class Patient : BaseEntity
{
    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public DateTime? DateOfBirth { get; set; }
    public string? BloodType { get; set; }
    public string? Address { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }

    // Navigation properties
    public virtual ICollection<MedicalHistoryIntake> Intakes { get; set; } = new List<MedicalHistoryIntake>();
    public virtual ICollection<Consultation> Consultations { get; set; } = new List<Consultation>();
    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    public virtual ICollection<LabOrder> LabOrders { get; set; } = new List<LabOrder>();
    public virtual PatientSubscription? ActiveSubscription { get; set; }
}
