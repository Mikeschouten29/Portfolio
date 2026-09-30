-- Portfolio Mike Schouten: tabel + beveiliging voor Supabase.
-- Uitvoeren in Supabase → SQL Editor → New query → plakken → Run.
-- Je kunt dit script veilig vaker uitvoeren.

-- 1. De tabel: het hele portfolio staat als één JSON-document in rij 'main'.
create table if not exists public.portfolio (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2. Beveiliging aanzetten (Row Level Security): zonder regels mag niemand iets.
alter table public.portfolio enable row level security;

-- 3. Regels: iedereen mag lezen, alleen jij (ingelogd) mag opslaan.
drop policy if exists "Iedereen mag het portfolio lezen" on public.portfolio;
create policy "Iedereen mag het portfolio lezen"
  on public.portfolio for select
  using (true);

drop policy if exists "Alleen de eigenaar mag toevoegen" on public.portfolio;
create policy "Alleen de eigenaar mag toevoegen"
  on public.portfolio for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'mikeschouten29@gmail.com');

drop policy if exists "Alleen de eigenaar mag wijzigen" on public.portfolio;
create policy "Alleen de eigenaar mag wijzigen"
  on public.portfolio for update to authenticated
  using ((auth.jwt() ->> 'email') = 'mikeschouten29@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'mikeschouten29@gmail.com');

-- 4. Toegang voor de website (de regels hierboven bepalen wat er echt mag).
grant select on public.portfolio to anon, authenticated;
grant insert, update on public.portfolio to authenticated;
