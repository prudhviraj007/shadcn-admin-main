-- Healthcare SaaS Dashboard — Auth Schema and RLS Policies
-- Run this AFTER migrations.sql to set up complete authentication and authorization
--
-- This adds:
-- 1. profiles table (linked to auth.users)
-- 2. clinics table
-- 3. user_roles table (for role-based access)
-- 4. Proper Row Level Security policies
-- 5. Triggers for auto-profiling creation

-- ============= PROFILES TABLE =============
-- This table stores additional user information linked to Supabase Auth
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  clinic_id uuid,
  role text default 'user',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- ============= CLINICS TABLE =============
create table if not exists clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  website text,
  logo_url text,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table clinics enable row level security;

-- ============= USER ROLES TABLE (for reference) =============
create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  clinic_id uuid references clinics on delete cascade not null,
  role text not null default 'user', -- 'owner', 'admin', 'doctor', 'staff', 'user'
  created_at timestamptz not null default now(),
  unique(user_id, clinic_id)
);

alter table user_roles enable row level security;

-- ============= FUNCTION: HANDLE NEW USER =============
-- Auto-creates profile and clinic when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_clinic_id uuid;
  new_full_name text;
  new_clinic_name text;
begin
  -- Extract user metadata from auth.users.raw_user_meta_data
  new_full_name := COALESCE(
    (new.raw_user_meta_data->>'full_name')::text,
    (new.raw_user_meta_data->>'name')::text,
    new.email
  );
  
  new_clinic_name := COALESCE(
    (new.raw_user_meta_data->>'clinic_name')::text,
    'My Clinic'
  );

  -- Create profile
  insert into public.profiles (id, full_name, role, created_at, updated_at)
  values (new.id, new_full_name, 'owner', now(), now());

  -- Create default clinic for the user
  insert into public.clinics (name, created_by, created_at, updated_at)
  values (new_clinic_name, new.id, now(), now())
  returning id into new_clinic_id;

  -- Update profile with clinic_id
  update public.profiles
  set clinic_id = new_clinic_id, updated_at = now()
  where id = new.id;

  -- Create user role entry
  insert into public.user_roles (user_id, clinic_id, role, created_at)
  values (new.id, new_clinic_id, 'owner', now());

  return new;
end;
$$;

-- ============= TRIGGER: ON AUTH USER CREATION =============
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============= FUNCTION: UPDATE UPDATED_AT =============
-- Already exists in migrations.sql, but just in case
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============= TRIGGERS FOR UPDATED_AT =============
drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at
  before update on profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_clinics_updated_at on clinics;
create trigger set_clinics_updated_at
  before update on clinics
  for each row execute function public.set_updated_at();

-- ============= RLS POLICIES: PROFILES =============
-- Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Service role can insert (needed for trigger)
-- Note: The trigger runs with security definer, so this may not be needed
-- But let's allow authenticated users to insert their own profile
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ============= RLS POLICIES: CLINICS =============
-- Users can view their own clinic (via profile.clinic_id)
create policy "Users can view own clinic"
  on clinics for select
  using (
    id = (select clinic_id from profiles where id = auth.uid())
  );

-- Clinic owners can update their clinic
create policy "Clinic owners can update clinic"
  on clinics for update
  using (
    created_by = auth.uid()
    or id = (select clinic_id from profiles where id = auth.uid() and role = 'owner')
  );

-- ============= RLS POLICIES: USER_ROLES =============
create policy "Users can view own roles"
  on user_roles for select
  using (user_id = auth.uid());

-- ============= RLS POLICIES: EXISTING TABLES =============
-- Update existing tables to use clinic-scoped RLS
-- These REPLACE the "public" policies from migrations.sql

-- First, drop existing public policies
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
      'drop policy if exists "Public read %s" on %s', tbl, tbl);
    execute format(
      'drop policy if exists "Public insert %s" on %s', tbl, tbl);
    execute format(
      'drop policy if exists "Public update %s" on %s', tbl, tbl);
    execute format(
      'drop policy if exists "Public delete %s" on %s', tbl, tbl);
  end loop;
end;
$$;

-- ============= ADD CLINIC_ID COLUMN TO EXISTING TABLES =============
-- Note: These columns need to be added for clinic-scoped data
-- Uncomment and run these if you want to convert to multi-tenant

-- alter table patients add column if not exists clinic_id uuid references clinics(id);
-- alter table doctors add column if not exists clinic_id uuid references clinics(id);
-- alter table appointments add column if not exists clinic_id uuid references clinics(id);
-- alter table conversations add column if not exists clinic_id uuid references clinics(id);
-- alter table medical_notes add column if not exists clinic_id uuid references clinics(id);
-- alter table visits add column if not exists clinic_id uuid references clinics(id);
-- alter table notifications add column if not exists clinic_id uuid references clinics(id);

-- ============= CLINIC-SCOPED RLS POLICIES (TEMPLATE) =============
-- Use these policies AFTER adding clinic_id columns
-- For now, we'll use permissive policies that allow authenticated users

-- Alternative: Simple authenticated user policies (for single-tenant)
-- These allow any authenticated user to access the data
-- Good for development and single-clinic setups

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
    -- Read: Authenticated users only
    execute format(
      'create policy "Authenticated users can read %s"
        on %s for select using (auth.role() = ''authenticated'')', tbl, tbl);
    
    -- Insert: Authenticated users only
    execute format(
      'create policy "Authenticated users can insert %s"
        on %s for insert with check (auth.role() = ''authenticated'')', tbl, tbl);
    
    -- Update: Authenticated users only
    execute format(
      'create policy "Authenticated users can update %s"
        on %s for update using (auth.role() = ''authenticated'')', tbl, tbl);
    
    -- Delete: Authenticated users only
    execute format(
      'create policy "Authenticated users can delete %s"
        on %s for delete using (auth.role() = ''authenticated'')', tbl, tbl);
  end loop;
end;
$$;

-- ============= MULTI-TENANT RLS POLICIES (FOR FUTURE) =============
-- When you're ready for multi-tenant, add clinic_id to all tables
-- and use these policies instead:
/*
-- Patients
create policy "Users can view clinic patients"
  on patients for select
  using (
    clinic_id = (select clinic_id from profiles where id = auth.uid())
  );

create policy "Users can insert clinic patients"
  on patients for insert
  with check (
    clinic_id = (select clinic_id from profiles where id = auth.uid())
  );

create policy "Users can update clinic patients"
  on patients for update
  using (
    clinic_id = (select clinic_id from profiles where id = auth.uid())
  );

-- Repeat similar patterns for doctors, appointments, etc.
*/

-- ============= STORAGE BUCKET FOR AVATARS =============
-- Create a storage bucket for user avatars if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- RLS for storage
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "Avatars are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- ============= FINAL NOTES =============
-- 1. Make sure to enable email confirmation in Supabase Auth settings if needed
-- 2. Set up site URL and redirect URLs in Supabase Auth settings
-- 3. For password reset, set the redirect URL to your /reset-password page
-- 4. The handle_new_user trigger auto-creates profiles and clinics on signup
