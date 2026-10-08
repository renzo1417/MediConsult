using MedConsult.Models.Common;
using MedConsult.Models.Enums;

namespace MedConsult.Models.Billing;

/// <summary>
/// Pricing tier catalog entity representing subscription options
/// (Standard $0, Pro Health $29, Family Care $59).
/// </summary>
public class SubscriptionPlan : BaseEntity
{
    public SubscriptionTier Tier { get; set; } = SubscriptionTier.Standard;
    public string Name { get; set; } = string.Empty;
    public decimal MonthlyFee { get; set; }
    public string Description { get; set; } = string.Empty;
    public int MaxFamilyMembers { get; set; } = 1;
    public bool IncludesPrescriptionDelivery { get; set; }
    public bool IncludesAnnualLabTest { get; set; }
    public bool HasDedicatedDoctorChat { get; set; }
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation property
    public virtual ICollection<PatientSubscription> Subscriptions { get; set; } = new List<PatientSubscription>();
}
