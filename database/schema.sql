-- ============================================================================
-- MediConsult — Supabase PostgreSQL Database Schema
-- Milestone: APIs and Databases (CIT-U Application Development)
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DOCTORS (Physicians directory)
-- ----------------------------------------------------------------------------
create table public.doctors (
  id bigint generated always as identity primary key,
  full_name text not null,
  medical_license_number text not null unique,
  specialty text not null,
  qualifications text not null,
  years_of_experience int not null default 0 check (years_of_experience >= 0),
  rating numeric(2,1) not null default 5.0 check (rating >= 0.0 and rating <= 5.0),
  total_consultations int not null default 0 check (total_consultations >= 0),
  consultation_fee numeric(10,2) not null default 0 check (consultation_fee >= 0),
  is_available boolean not null default true,
  avatar_url text,
  created_at timestamptz not null default now()
);

create index idx_doctors_specialty on public.doctors (specialty); -- habit 1

grant select, insert, update, delete on public.doctors to anon; -- lock 1
alter table public.doctors enable row level security;           -- lock 2

create policy "read_all"   on public.doctors for select to anon using (true);
create policy "insert_all" on public.doctors for insert to anon with check (true);
create policy "update_all" on public.doctors for update to anon using (true) with check (true);
create policy "delete_all" on public.doctors for delete to anon using (true);

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTION PLANS (Transparent membership pricing tiers)
-- ----------------------------------------------------------------------------
create table public.subscription_plans (
  id bigint generated always as identity primary key,
  tier text not null unique check (tier in ('Standard', 'ProHealth', 'FamilyCare')),
  name text not null,
  monthly_fee numeric(10,2) not null default 0 check (monthly_fee >= 0),
  description text not null,
  max_family_members int not null default 1 check (max_family_members >= 1),
  includes_prescription_delivery boolean not null default false,
  includes_annual_lab_test boolean not null default false,
  has_dedicated_doctor_chat boolean not null default false,
  is_popular boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_subscription_plans_active on public.subscription_plans (is_active, monthly_fee); -- habit 1

grant select, insert, update, delete on public.subscription_plans to anon; -- lock 1
alter table public.subscription_plans enable row level security;           -- lock 2

create policy "read_all"   on public.subscription_plans for select to anon using (true);
create policy "insert_all" on public.subscription_plans for insert to anon with check (true);
create policy "update_all" on public.subscription_plans for update to anon using (true) with check (true);
create policy "delete_all" on public.subscription_plans for delete to anon using (true);

-- ----------------------------------------------------------------------------
-- 3. CONSULTATIONS (Telehealth appointments linked to doctors, with soft delete)
-- ----------------------------------------------------------------------------
create table public.consultations (
  id bigint generated always as identity primary key,
  doctor_id bigint not null references public.doctors(id) on delete restrict,
  patient_name text not null,
  chief_complaint text not null,
  scheduled_at timestamptz not null,
  status text not null default 'Scheduled'
    check (status in ('Requested', 'Scheduled', 'InProgress', 'Completed', 'Cancelled')),
  meeting_room_url text,
  diagnosis text,
  deleted_at timestamptz,                                        -- soft delete
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index idx_consultations_doctor on public.consultations (doctor_id); -- habit 1
create index idx_consultations_active_scheduled
  on public.consultations (scheduled_at) where deleted_at is null;         -- habit 1

grant select, insert, update, delete on public.consultations to anon; -- lock 1
alter table public.consultations enable row level security;           -- lock 2

create policy "read_all"   on public.consultations for select to anon using (true);
create policy "insert_all" on public.consultations for insert to anon with check (true);
create policy "update_all" on public.consultations for update to anon using (true) with check (true);
create policy "delete_all" on public.consultations for delete to anon using (true);

-- ----------------------------------------------------------------------------
-- 4. REVIEWS (Verified patient testimonials & ratings, with soft delete)
-- ----------------------------------------------------------------------------
create table public.reviews (
  id bigint generated always as identity primary key,
  doctor_id bigint references public.doctors(id) on delete set null,
  consultation_id bigint references public.consultations(id) on delete set null,
  author_name text not null,
  author_role text not null default 'Verified Patient',
  initials text not null default 'PT',
  avatar_url text,
  title text not null,
  quote text not null,
  service_label text not null default 'Urgent Telehealth',
  service_category text not null default 'Video Telehealth'
    check (service_category in ('Video Telehealth', 'Home Visits', 'Prescriptions', 'Diagnostics')),
  badge text not null default 'Verified Patient',
  rating numeric(2,1) not null default 5.0 check (rating >= 1.0 and rating <= 5.0),
  is_verified boolean not null default true,
  deleted_at timestamptz,                                        -- soft delete
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index idx_reviews_category on public.reviews (service_category); -- habit 1
create index idx_reviews_active_created
  on public.reviews (created_at desc) where deleted_at is null;         -- habit 1

grant select, insert, update, delete on public.reviews to anon; -- lock 1
alter table public.reviews enable row level security;           -- lock 2

create policy "read_all"   on public.reviews for select to anon using (true);
create policy "insert_all" on public.reviews for insert to anon with check (true);
create policy "update_all" on public.reviews for update to anon using (true) with check (true);
create policy "delete_all" on public.reviews for delete to anon using (true);

-- ============================================================================
-- SEED DATA (Initial records for MediConsult)
-- ============================================================================

insert into public.doctors (
  full_name, medical_license_number, specialty, qualifications,
  years_of_experience, rating, total_consultations, consultation_fee, is_available
) values
  ('Dr. Elena Reynolds', 'MD-CA-88412', 'Cardiology & Internal Medicine', 'MD, FACC · Stanford Medicine', 12, 4.9, 1840, 45.00, true),
  ('Dr. Marcus Vance',   'MD-NY-54190', 'Family & Urgent Care',           'MD, FAAFP · Johns Hopkins',   9,  5.0, 2310, 35.00, true),
  ('Dr. Sophia Lin',     'MD-WA-77204', 'Pediatrics & Telehealth',        'MD, FAAP · UCSF Health',      10, 4.9, 1620, 40.00, true);

insert into public.subscription_plans (
  tier, name, monthly_fee, description, max_family_members,
  includes_prescription_delivery, includes_annual_lab_test, has_dedicated_doctor_chat, is_popular, is_active
) values
  ('Standard',   'Standard',    0.00, 'Pay-as-you-go doctor visits with basic triage chat and digital prescriptions.', 1, false, false, false, false, true),
  ('ProHealth',  'Pro Health', 29.00, 'Unlimited telehealth consults, free doorstep prescription delivery, 24/7 doctor chat, and annual lab test.', 1, true,  true,  true,  true,  true),
  ('FamilyCare', 'Family Care',59.00, 'Coverage for up to 4 family members with quarterly checkups, priority home visits, and pediatric helpline.', 4, true,  true,  true,  false, true);

insert into public.consultations (
  doctor_id, patient_name, chief_complaint, scheduled_at, status, diagnosis
) values
  (
    (select id from public.doctors where medical_license_number = 'MD-CA-88412' limit 1),
    'David Chen',
    'Monthly blood pressure trend review and dosage adjustment',
    now() - interval '30 days',
    'Completed',
    'Well-controlled stage 1 hypertension; dosage maintained'
  ),
  (
    (select id from public.doctors where medical_license_number = 'MD-WA-77204' limit 1),
    'Angela Brooks',
    'Late-evening pediatric fever and earache triage',
    now() - interval '35 days',
    'Completed',
    'Acute viral upper respiratory infection; supportive care advised'
  );

insert into public.reviews (
  doctor_id, consultation_id, author_name, author_role, initials, avatar_url,
  title, quote, service_label, service_category, badge, rating, is_verified, created_at
) values
  (
    (select id from public.doctors where medical_license_number = 'MD-NY-54190' limit 1),
    null,
    'Pete Gallagher',
    'Director of Operations, Corporate Wellness',
    'PG',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Found the right solution',
    'I have been searching for a telehealth service like MediConsult for years. Direct physician video in minutes and zero pharmacy wait times.',
    'Urgent Telehealth',
    'Video Telehealth',
    'Verified Patient',
    5.0,
    true,
    now() - interval '2 days'
  ),
  (
    (select id from public.doctors where medical_license_number = 'MD-NY-54190' limit 1),
    null,
    'Andy Kovacs',
    'DevOps Engineer, Cloud Systems',
    'AK',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'Switched and never looked back',
    'I switched our household prescriptions to MediConsult two years ago and never looked back. Same-day refills delivered straight to our front porch.',
    'Doorstep Prescriptions',
    'Prescriptions',
    'Verified Patient',
    5.0,
    true,
    now() - interval '4 days'
  ),
  (
    (select id from public.doctors where medical_license_number = 'MD-NY-54190' limit 1),
    null,
    'Dr. Clara Morales',
    'Physician & Family Caregiver',
    'CM',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'Exceptional clinical rigor',
    'The board-certified home visit doctor arrived on time with comprehensive diagnostic gear. Thorough vitals check and zero waiting room exposure for my father.',
    'Home Doctor Visit',
    'Home Visits',
    'Verified Patient',
    5.0,
    true,
    now() - interval '7 days'
  ),
  (
    (select id from public.doctors where medical_license_number = 'MD-NY-54190' limit 1),
    null,
    'Olivia Campbell',
    'Client Success Lead, HealthTech',
    'OC',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Customer care is unparalleled',
    'The consultation was simple, intuitive, and immediate. The attending physician listened carefully and resolved my prescription in under ten minutes.',
    'Urgent Telehealth',
    'Video Telehealth',
    'Verified Patient',
    5.0,
    true,
    now() - interval '14 days'
  ),
  (
    (select id from public.doctors where medical_license_number = 'MD-CA-88412' limit 1),
    null,
    'Marina Silva',
    'People Operations Partner',
    'MS',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'Fast diagnostic turnaround',
    'The phlebotomist arrived punctually at 7:30 AM before my workday started. Lab results posted to my patient dashboard before dinner the same day.',
    'At-Home Lab Diagnostics',
    'Diagnostics',
    'Verified Patient',
    5.0,
    true,
    now() - interval '21 days'
  ),
  (
    (select id from public.doctors where medical_license_number = 'MD-CA-88412' limit 1),
    (select id from public.consultations where patient_name = 'David Chen' limit 1),
    'David Chen',
    'Senior Data Analyst',
    'DC',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    'Continuous vitals monitoring',
    'Connected my blood pressure monitor directly into the portal. Dr. Reynolds reviewed my monthly trends and adjusted my dosage with zero friction.',
    'Cardiology Telehealth',
    'Video Telehealth',
    'Verified Patient',
    5.0,
    true,
    now() - interval '30 days'
  ),
  (
    (select id from public.doctors where medical_license_number = 'MD-WA-77204' limit 1),
    (select id from public.consultations where patient_name = 'Angela Brooks' limit 1),
    'Angela Brooks',
    'Educator & Parent',
    'AB',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'Saved our family an ER trip',
    'Having a board-certified pediatrician available at 10 PM on a Sunday saved us a stressful emergency room trip. Calm, empathetic, and exceptionally professional.',
    'Pediatric Telehealth',
    'Video Telehealth',
    'Verified Patient',
    5.0,
    true,
    now() - interval '35 days'
  );

