using MedConsult.Models.Common;
using MedConsult.Models.Enums;
using MedConsult.Models.Users;

namespace MedConsult.Models.Billing;

/// <summary>
/// Patient subscription enrollment linking a patient to a pricing tier plan.
/// </summary>
public class PatientSubscription : BaseEntity
{
    public int PatientId { get; set; }
    public virtual Patient Patient { get; set; } = null!;

    public int PlanId { get; set; }
    public virtual SubscriptionPlan Plan { get; set; } = null!;

    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
    public bool AutoRenew { get; set; } = true;
}
