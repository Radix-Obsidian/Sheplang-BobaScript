-- Create the notes table for testing
create table if not exists public.notes (
  id bigint primary key generated always as identity,
  title text not null,
  created_at timestamptz default now()
);

-- Insert some sample data into the table
insert into public.notes (title) values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');

-- Enable row level security
alter table public.notes enable row level security;

-- Create policy to allow public read access
create policy "public can read notes"
on public.notes
for select
to anon
using (true);
