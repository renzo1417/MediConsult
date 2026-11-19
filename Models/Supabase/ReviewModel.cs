using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace medconsult.Models.Supabase;

[Table("reviews")]
public class ReviewModel : BaseModel
{
    [PrimaryKey("id", false)]
    public long Id { get; set; }

    [Column("doctor_id")]
    public long? DoctorId { get; set; }

    [Column("consultation_id")]
    public long? ConsultationId { get; set; }

    [Column("author_name")]
    public string AuthorName { get; set; } = "";

    [Column("author_role")]
    public string AuthorRole { get; set; } = "Verified Patient";

    [Column("initials")]
    public string Initials { get; set; } = "PT";

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }

    [Column("title")]
    public string Title { get; set; } = "";

    [Column("quote")]
    public string Quote { get; set; } = "";

    [Column("service_label")]
    public string ServiceLabel { get; set; } = "Urgent Telehealth";

    [Column("service_category")]
    public string ServiceCategory { get; set; } = "Video Telehealth";

    [Column("badge")]
    public string Badge { get; set; } = "Verified Patient";

    [Column("rating")]
    public decimal Rating { get; set; } = 5.0m;

    [Column("is_verified")]
    public bool IsVerified { get; set; } = true;

    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    public string FormatRelativeTime()
    {
        var elapsed = DateTime.UtcNow - CreatedAt.ToUniversalTime();
        if (elapsed.TotalMinutes < 2) return "Just now";
        if (elapsed.TotalHours < 1) return $"{(int)elapsed.TotalMinutes} min ago";
        if (elapsed.TotalDays < 1) return $"{(int)elapsed.TotalHours} hr ago";
        if (elapsed.TotalDays < 7)
        {
            int days = (int)elapsed.TotalDays;
            return days == 1 ? "1 day ago" : $"{days} days ago";
        }
        if (elapsed.TotalDays < 30)
        {
            int weeks = (int)(elapsed.TotalDays / 7);
            return weeks == 1 ? "1 week ago" : $"{weeks} weeks ago";
        }
        int months = Math.Max(1, (int)(elapsed.TotalDays / 30));
        return months == 1 ? "1 month ago" : $"{months} months ago";
    }
}

