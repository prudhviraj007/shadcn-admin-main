-- RLS Fix: Replace "authenticated only" policies with public policies
-- Run this in your Supabase dashboard > SQL Editor
-- The app uses the anon key (no auth), so policies must allow public access

do $$
declare
  tbl text;
  pol text;
begin
  for tbl in select unnest(array[
    'patients', 'doctors', 'appointments',
    'conversations', 'messages',
    'medical_notes', 'visits', 'notifications'
  ])
  loop
    -- Drop existing authenticated-only policies
    for pol in select policyname from pg_policies where tablename = tbl
    loop
      execute format('drop policy if exists %I on %I', pol, tbl);
    end loop;

    -- Create new public policies
    execute format(
      'create policy "Public read %s" on %I for select using (true)', tbl, tbl);
    execute format(
      'create policy "Public insert %s" on %I for insert with check (true)', tbl, tbl);
    execute format(
      'create policy "Public update %s" on %I for update using (true)', tbl, tbl);
    execute format(
      'create policy "Public delete %s" on %I for delete using (true)', tbl, tbl);
  end loop;
end;
$$;
