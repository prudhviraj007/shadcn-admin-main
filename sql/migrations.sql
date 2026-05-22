-- Healthcare SaaS Dashboard — Supabase Schema
-- Run this in the Supabase SQL editor to create all required tables.
--
-- Enable realtime for all tables:
--   alter publication supabase_realtime add table patients, doctors, appointments, conversations, messages, medical_notes, visits;

-- ============= EXTENSIONS =============
create extension if not exists "pgcrypto";

-- ============= PATIENTS =============
create table if not exists patients (
  id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_number text not null,
  date_of_birth text not null,
  gender text not null,
  status text not null default 'active',
  blood_type text not null,
  allergies text[] default '{}',
  emergency_contact jsonb not null default '{"name":"","phone":"","relationship":""}',
  address text default null,
  insurance_provider text default '',
  insurance_id text default '',
  tags text[] default '{}',
  last_visit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============= DOCTORS =============
create table if not exists doctors (
  id text primary key,
  name text not null,
  specialty text not null,
  specializations text[] default '{}',
  email text not null,
  phone_number text not null,
  bio text,
  education text,
  experience_years int not null default 0,
  profile_image text,
  status text not null default 'active',
  availability text not null default 'available',
  weekly_schedule jsonb not null default '[]',
  rating numeric(2,1) not null default 0.0,
  consultation_fee int not null default 0,
  department text not null,
  languages text[] default '{}',
  certifications text[] default '{}',
  address jsonb default null,
  created_at timestamptz not null default now()
);

-- ============= APPOINTMENTS =============
create table if not exists appointments (
  id text primary key,
  patient jsonb not null,
  doctor text not null,
  date text not null,
  time text not null,
  duration int not null default 30,
  type text not null,
  status text not null default 'scheduled',
  priority text not null default 'normal',
  department text not null,
  notes text,
  reason text,
  specialty text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============= CONVERSATIONS =============
create table if not exists conversations (
  id text primary key,
  patient text not null,
  patient_id text,
  avatar text,
  subtitle text,
  last_message text,
  last_time text,
  unread int not null default 0,
  status text not null default 'needs-review',
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);

-- ============= MESSAGES =============
create table if not exists messages (
  id text primary key,
  conversation_id text not null references conversations(id) on delete cascade,
  author text not null,
  text text not null,
  time text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============= MEDICAL NOTES =============
create table if not exists medical_notes (
  id text primary key,
  patient_id text not null references patients(id) on delete cascade,
  title text not null,
  content text not null,
  type text not null default 'general',
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============= VISITS =============
create table if not exists visits (
  id text primary key,
  patient_id text not null references patients(id) on delete cascade,
  date text not null,
  type text not null,
  doctor text not null,
  department text not null,
  reason text not null,
  diagnosis text,
  notes text,
  status text not null default 'completed'
);

-- ============= NOTIFICATIONS =============
create table if not exists notifications (
  id text primary key,
  type text not null,
  title text not null,
  description text not null,
  priority text not null default 'normal',
  read boolean not null default false,
  patient_id text references patients(id) on delete set null,
  patient_name text,
  action_url text,
  action_label text,
  created_at timestamptz not null default now()
);

-- ============= INDEXES =============
create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_appointments_date on appointments(date);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_appointments_patient on appointments using gin(patient jsonb_path_ops);
create index if not exists idx_patients_status on patients(status);
create index if not exists idx_patients_email on patients(email);
create index if not exists idx_doctors_department on doctors(department);
create index if not exists idx_doctors_availability on doctors(availability);
create index if not exists idx_conversations_status on conversations(status);
create index if not exists idx_medical_notes_patient on medical_notes(patient_id);
create index if not exists idx_visits_patient on visits(patient_id);
create index if not exists idx_notifications_read on notifications(read);
create index if not exists idx_notifications_created on notifications(created_at desc);

-- ============= ROW LEVEL SECURITY =============
alter table patients enable row level security;
alter table doctors enable row level security;
alter table appointments enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table medical_notes enable row level security;
alter table visits enable row level security;
alter table notifications enable row level security;

-- Public access (dashboard app uses anon key, no auth required)
do $$
declare
  tbl text;
begin
  for tbl in select unnest(array[
    'patients', 'doctors', 'appointments',
    'conversations', 'messages',
    'medical_notes', 'visits', 'notifications'
  ])
  loop
    execute format(
      'create policy "Public read %s"
        on %s for select using (true)', tbl, tbl);
    execute format(
      'create policy "Public insert %s"
        on %s for insert with check (true)', tbl, tbl);
    execute format(
      'create policy "Public update %s"
        on %s for update using (true)', tbl, tbl);
    execute format(
      'create policy "Public delete %s"
        on %s for delete using (true)', tbl, tbl);
  end loop;
end;
$$;

-- ============= AUTO-UPDATE UPDATED_AT =============
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  tbl text;
begin
  for tbl in select unnest(array['patients', 'appointments', 'conversations', 'medical_notes'])
  loop
    execute format(
      'create trigger set_updated_at before update on %s
        for each row execute function update_updated_at_column()', tbl);
  end loop;
end;
$$;
