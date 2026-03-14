-- OTShield Supabase Schema
-- Run this in the Supabase SQL Editor for a fresh project or to upgrade the
-- previous demo schema to a DB-first, auth-aware layout.

create extension if not exists pgcrypto;

create table if not exists ot_assets (
  row_id uuid default gen_random_uuid(),
  id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  owner_scope text not null default 'shared',
  name text not null,
  type text not null,
  protocol text not null,
  location text not null,
  risk_score integer not null default 0,
  status text not null default 'Online',
  last_seen text not null,
  discovered_at text,
  discovery_source text,
  site text,
  created_at timestamptz default now()
);

create table if not exists ot_alerts (
  row_id uuid default gen_random_uuid(),
  id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  owner_scope text not null default 'shared',
  title text not null,
  device text not null,
  affected_devices jsonb not null default '[]'::jsonb,
  severity text not null,
  timestamp text not null,
  description text,
  ai_explanation text,
  status text not null default 'Open',
  updated_at text,
  created_at timestamptz default now()
);

create table if not exists ot_siem_exports (
  row_id uuid default gen_random_uuid(),
  id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  owner_scope text not null default 'shared',
  target text not null,
  exported_at text not null,
  alert_count integer not null default 0,
  alert_titles jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table ot_assets add column if not exists row_id uuid default gen_random_uuid();
alter table ot_assets add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table ot_assets add column if not exists owner_scope text;
update ot_assets set row_id = gen_random_uuid() where row_id is null;
update ot_assets set owner_scope = coalesce(owner_scope, 'shared');
alter table ot_assets alter column owner_scope set default 'shared';
alter table ot_assets alter column owner_scope set not null;
alter table ot_assets alter column row_id set not null;

alter table ot_alerts add column if not exists row_id uuid default gen_random_uuid();
alter table ot_alerts add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table ot_alerts add column if not exists owner_scope text;
update ot_alerts set row_id = gen_random_uuid() where row_id is null;
update ot_alerts set owner_scope = coalesce(owner_scope, 'shared');
alter table ot_alerts alter column owner_scope set default 'shared';
alter table ot_alerts alter column owner_scope set not null;
alter table ot_alerts alter column row_id set not null;

alter table ot_siem_exports add column if not exists row_id uuid default gen_random_uuid();
alter table ot_siem_exports add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table ot_siem_exports add column if not exists owner_scope text;
update ot_siem_exports set row_id = gen_random_uuid() where row_id is null;
update ot_siem_exports set owner_scope = coalesce(owner_scope, 'shared');
alter table ot_siem_exports alter column owner_scope set default 'shared';
alter table ot_siem_exports alter column owner_scope set not null;
alter table ot_siem_exports alter column row_id set not null;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'ot_assets'::regclass and conname = 'ot_assets_pkey'
  ) then
    alter table ot_assets drop constraint ot_assets_pkey;
  end if;

  alter table ot_assets add constraint ot_assets_pkey primary key (row_id);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'ot_alerts'::regclass and conname = 'ot_alerts_pkey'
  ) then
    alter table ot_alerts drop constraint ot_alerts_pkey;
  end if;

  alter table ot_alerts add constraint ot_alerts_pkey primary key (row_id);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'ot_siem_exports'::regclass and conname = 'ot_siem_exports_pkey'
  ) then
    alter table ot_siem_exports drop constraint ot_siem_exports_pkey;
  end if;

  alter table ot_siem_exports add constraint ot_siem_exports_pkey primary key (row_id);
exception
  when duplicate_object then null;
end $$;

create unique index if not exists ot_assets_scope_identity on ot_assets (id, owner_scope);
create unique index if not exists ot_alerts_scope_identity on ot_alerts (id, owner_scope);
create unique index if not exists ot_siem_exports_scope_identity on ot_siem_exports (id, owner_scope);

create index if not exists ot_assets_user_idx on ot_assets (user_id);
create index if not exists ot_alerts_user_idx on ot_alerts (user_id);
create index if not exists ot_siem_exports_user_idx on ot_siem_exports (user_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'ot_assets'::regclass and conname = 'ot_assets_scope_check'
  ) then
    alter table ot_assets
      add constraint ot_assets_scope_check
      check (
        (owner_scope = 'shared' and user_id is null) or
        (user_id is not null and owner_scope = user_id::text)
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'ot_alerts'::regclass and conname = 'ot_alerts_scope_check'
  ) then
    alter table ot_alerts
      add constraint ot_alerts_scope_check
      check (
        (owner_scope = 'shared' and user_id is null) or
        (user_id is not null and owner_scope = user_id::text)
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'ot_siem_exports'::regclass and conname = 'ot_siem_exports_scope_check'
  ) then
    alter table ot_siem_exports
      add constraint ot_siem_exports_scope_check
      check (
        (owner_scope = 'shared' and user_id is null) or
        (user_id is not null and owner_scope = user_id::text)
      );
  end if;
end $$;

alter table ot_assets enable row level security;
alter table ot_alerts enable row level security;
alter table ot_siem_exports enable row level security;

drop policy if exists "Allow all for ot_assets" on ot_assets;
drop policy if exists "Allow all for ot_alerts" on ot_alerts;
drop policy if exists "Allow all for ot_siem_exports" on ot_siem_exports;

drop policy if exists "ot_assets_select_scoped" on ot_assets;
drop policy if exists "ot_assets_insert_owned" on ot_assets;
drop policy if exists "ot_assets_update_owned" on ot_assets;
drop policy if exists "ot_assets_delete_owned" on ot_assets;

create policy "ot_assets_select_scoped"
on ot_assets
for select
using (
  auth.uid() is not null and (owner_scope = 'shared' or user_id = auth.uid())
);

create policy "ot_assets_insert_owned"
on ot_assets
for insert
with check (
  auth.uid() is not null and
  user_id = auth.uid() and
  owner_scope = auth.uid()::text
);

create policy "ot_assets_update_owned"
on ot_assets
for update
using (
  auth.uid() is not null and user_id = auth.uid()
)
with check (
  auth.uid() is not null and
  user_id = auth.uid() and
  owner_scope = auth.uid()::text
);

create policy "ot_assets_delete_owned"
on ot_assets
for delete
using (
  auth.uid() is not null and user_id = auth.uid()
);

drop policy if exists "ot_alerts_select_scoped" on ot_alerts;
drop policy if exists "ot_alerts_insert_owned" on ot_alerts;
drop policy if exists "ot_alerts_update_owned" on ot_alerts;
drop policy if exists "ot_alerts_delete_owned" on ot_alerts;

create policy "ot_alerts_select_scoped"
on ot_alerts
for select
using (
  auth.uid() is not null and (owner_scope = 'shared' or user_id = auth.uid())
);

create policy "ot_alerts_insert_owned"
on ot_alerts
for insert
with check (
  auth.uid() is not null and
  user_id = auth.uid() and
  owner_scope = auth.uid()::text
);

create policy "ot_alerts_update_owned"
on ot_alerts
for update
using (
  auth.uid() is not null and user_id = auth.uid()
)
with check (
  auth.uid() is not null and
  user_id = auth.uid() and
  owner_scope = auth.uid()::text
);

create policy "ot_alerts_delete_owned"
on ot_alerts
for delete
using (
  auth.uid() is not null and user_id = auth.uid()
);

drop policy if exists "ot_siem_exports_select_scoped" on ot_siem_exports;
drop policy if exists "ot_siem_exports_insert_owned" on ot_siem_exports;
drop policy if exists "ot_siem_exports_update_owned" on ot_siem_exports;
drop policy if exists "ot_siem_exports_delete_owned" on ot_siem_exports;

create policy "ot_siem_exports_select_scoped"
on ot_siem_exports
for select
using (
  auth.uid() is not null and (owner_scope = 'shared' or user_id = auth.uid())
);

create policy "ot_siem_exports_insert_owned"
on ot_siem_exports
for insert
with check (
  auth.uid() is not null and
  user_id = auth.uid() and
  owner_scope = auth.uid()::text
);

create policy "ot_siem_exports_update_owned"
on ot_siem_exports
for update
using (
  auth.uid() is not null and user_id = auth.uid()
)
with check (
  auth.uid() is not null and
  user_id = auth.uid() and
  owner_scope = auth.uid()::text
);

create policy "ot_siem_exports_delete_owned"
on ot_siem_exports
for delete
using (
  auth.uid() is not null and user_id = auth.uid()
);
