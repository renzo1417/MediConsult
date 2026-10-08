using MedConsult.Models.Common;
using MedConsult.Models.Enums;
using MedConsult.Models.Users;

namespace MedConsult.Models.Clinical;

/// <summary>
/// At-home laboratory diagnostics order dispatched to certified mobile phlebotomists.
/// Tracks scheduled collection windows and digital diagnostic results.
/// </summary>
public class LabOrder : BaseEntity
{
    public int ConsultationId { get; set; }
    public virtual Consultation Consultation { get; set; } = null!;

    public int PatientId { get; set; }
    public virtual Patient Patient { get; set; } = null!;

    public string OrderNumber { get; set; } = string.Empty;
    public string PanelType { get; set; } = string.Empty; // e.g. "CMP + CBC", "Lipid Panel"
    public string? PhlebotomistName { get; set; }
    public string? CollectionWindow { get; set; } // e.g. "Today 2:00 PM - 3:00 PM"
    public LabOrderStatus Status { get; set; } = LabOrderStatus.Ordered;

    public string? ResultsSummary { get; set; }
    public string? DigitalReportUrl { get; set; }
    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
