using MedConsult.Models.Common;
using MedConsult.Models.Enums;
using MedConsult.Models.Users;

namespace MedConsult.Models.Clinical;

/// <summary>
/// Digital prescription order issued by the physician.
/// Tracks drug details, dosage instructions, and doorstep courier fulfillment.
/// </summary>
public class Prescription : BaseEntity
{
    public int ConsultationId { get; set; }
    public virtual Consultation Consultation { get; set; } = null!;

    public int DoctorId { get; set; }
    public virtual Doctor Doctor { get; set; } = null!;

    public int PatientId { get; set; }
    public virtual Patient Patient { get; set; } = null!;

    public string PrescriptionNumber { get; set; } = string.Empty;
    public string MedicationName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Quantity { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;

    public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Signed;
    public string? CourierDeliveryAddress { get; set; }
    public int? EstimatedDeliveryMinutes { get; set; }
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
}
