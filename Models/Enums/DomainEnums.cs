namespace MedConsult.Models.Enums;

public enum UserRole
{
    Patient = 1,
    Doctor = 2,
    Admin = 3
}

public enum ConsultationStatus
{
    Requested = 1,
    Scheduled = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5
}

public enum PrescriptionStatus
{
    Draft = 1,
    Signed = 2,
    Dispatched = 3,
    Delivered = 4,
    Cancelled = 5
}

public enum LabOrderStatus
{
    Ordered = 1,
    SampleCollectionScheduled = 2,
    SampleCollected = 3,
    Processing = 4,
    Completed = 5,
    Cancelled = 6
}

public enum SubscriptionTier
{
    Standard = 1,
    ProHealth = 2,
    FamilyCare = 3
}

public enum SubscriptionStatus
{
    Active = 1,
    PastDue = 2,
    Cancelled = 3,
    Expired = 4
}
