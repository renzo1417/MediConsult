using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace medconsult.Models.Supabase;

[Table("subscription_plans")]
public class SubscriptionPlanModel : BaseModel
{
    [PrimaryKey("id", false)]
    public long Id { get; set; }

    [Column("tier")]
    public string Tier { get; set; } = "Standard";

    [Column("name")]
    public string Name { get; set; } = "";

    [Column("monthly_fee")]
    public decimal MonthlyFee { get; set; }

    [Column("description")]
    public string Description { get; set; } = "";

    [Column("max_family_members")]
    public int MaxFamilyMembers { get; set; } = 1;

    [Column("includes_prescription_delivery")]
    public bool IncludesPrescriptionDelivery { get; set; }

    [Column("includes_annual_lab_test")]
    public bool IncludesAnnualLabTest { get; set; }

    [Column("has_dedicated_doctor_chat")]
    public bool HasDedicatedDoctorChat { get; set; }

    [Column("is_popular")]
    public bool IsPopular { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

