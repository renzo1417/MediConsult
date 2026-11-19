using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace medconsult.Models.Supabase;

[Table("doctors")]
public class DoctorModel : BaseModel
{
    [PrimaryKey("id", false)]
    public long Id { get; set; }

    [Column("full_name")]
    public string FullName { get; set; } = "";

    [Column("medical_license_number")]
    public string MedicalLicenseNumber { get; set; } = "";

    [Column("specialty")]
    public string Specialty { get; set; } = "";

    [Column("qualifications")]
    public string Qualifications { get; set; } = "";

    [Column("years_of_experience")]
    public int YearsOfExperience { get; set; }

    [Column("rating")]
    public decimal Rating { get; set; } = 5.0m;

    [Column("total_consultations")]
    public int TotalConsultations { get; set; }

    [Column("consultation_fee")]
    public decimal ConsultationFee { get; set; }

    [Column("is_available")]
    public bool IsAvailable { get; set; } = true;

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

