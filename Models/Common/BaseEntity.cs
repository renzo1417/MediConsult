namespace MedConsult.Models.Common;

/// <summary>
/// Base class providing standard identity and timestamp tracking across domain entities.
/// </summary>
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
