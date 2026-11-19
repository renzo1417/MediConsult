using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace medconsult.Models.Supabase;

[Table("consultations")]
public class ConsultationModel : BaseModel
{
    [PrimaryKey("id", false)]
    public long Id { get; set; }

    [Column("doctor_id")]
    public long DoctorId { get; set; }

    [Column("patient_name")]
    public string PatientName { get; set; } = "";

    [Column("chief_complaint")]
    public string ChiefComplaint { get; set; } = "";

    [Column("scheduled_at")]
    public DateTime ScheduledAt { get; set; } = DateTime.UtcNow;

    [Column("status")]
    public string Status { get; set; } = "Scheduled";

    [Column("meeting_room_url")]
    public string? MeetingRoomUrl { get; set; }

    [Column("diagnosis")]
    public string? Diagnosis { get; set; }

    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}

