using MedConsult.Models.Common;
using MedConsult.Models.Users;

namespace MedConsult.Models.Clinical;

/// <summary>
/// Pre-consultation clinical intake questionnaire completed by the patient.
/// Captures reported symptoms, duration, known drug allergies, and medical history.
/// </summary>
public class MedicalHistoryIntake : BaseEntity
{
    public int PatientId { get; set; }
    public virtual Patient Patient { get; set; } = null!;

    public string ReportedSymptoms { get; set; } = string.Empty;
    public string SymptomDuration { get; set; } = string.Empty;
    public string? KnownAllergies { get; set; }
    public string? PreExistingConditions { get; set; }
    public string? CurrentMedications { get; set; }
    public bool IsIntakeCompleted { get; set; } = true;

    // Optional 1-to-1 link to resulting consultation
    public int? ConsultationId { get; set; }
    public virtual Consultation? Consultation { get; set; }
}
