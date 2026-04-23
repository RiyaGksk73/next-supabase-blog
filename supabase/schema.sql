create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('viewer', 'author', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.post_status as enum ('draft', 'published');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'viewer',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  content text not null,
  summary text,
  status public.post_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

create or replace function public.current_role()
returns public.user_role language sql stable as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles for select to authenticated using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles for update to authenticated
using (auth.uid() = id or public.current_role() = 'admin')
with check (auth.uid() = id or public.current_role() = 'admin');

drop policy if exists "posts_public_read_published" on public.posts;
create policy "posts_public_read_published"
on public.posts for select to anon, authenticated
using (status = 'published' or (auth.uid() is not null and (public.current_role() = 'admin' or author_id = auth.uid())));

drop policy if exists "posts_insert_author_or_admin" on public.posts;
create policy "posts_insert_author_or_admin"
on public.posts for insert to authenticated
with check (auth.uid() = author_id and public.current_role() in ('author', 'admin'));

drop policy if exists "posts_update_owner_or_admin" on public.posts;
create policy "posts_update_owner_or_admin"
on public.posts for update to authenticated
using (public.current_role() = 'admin' or author_id = auth.uid())
with check (public.current_role() = 'admin' or author_id = auth.uid());

drop policy if exists "posts_delete_owner_or_admin" on public.posts;
create policy "posts_delete_owner_or_admin"
on public.posts for delete to authenticated
using (public.current_role() = 'admin' or author_id = auth.uid());

drop policy if exists "comments_read_all" on public.comments;
create policy "comments_read_all"
on public.comments for select to anon, authenticated using (true);

drop policy if exists "comments_insert_authenticated" on public.comments;
create policy "comments_insert_authenticated"
on public.comments for insert to authenticated
with check (auth.uid() = author_id);

drop policy if exists "comments_delete_owner_or_admin" on public.comments;
create policy "comments_delete_owner_or_admin"
on public.comments for delete to authenticated
using (auth.uid() = author_id or public.current_role() = 'admin');