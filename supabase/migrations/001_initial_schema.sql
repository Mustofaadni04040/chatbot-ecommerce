create extension if not exists "pgcrypto";

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  category text not null,
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.conversation_products (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (conversation_id, product_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger set_conversations_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

create index products_category_idx
on public.products (category);

create index products_name_idx
on public.products (name);

create index products_search_idx
on public.products
using gin (
  to_tsvector(
    'simple',
    coalesce(name, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(category, '')
  )
);

create index conversations_user_id_idx
on public.conversations (user_id);

create index conversations_session_id_idx
on public.conversations (session_id);

create index conversations_updated_at_idx
on public.conversations (updated_at desc);

create index messages_conversation_id_created_at_idx
on public.messages (conversation_id, created_at asc);

create index conversation_products_conversation_id_idx
on public.conversation_products (conversation_id);

create index conversation_products_product_id_idx
on public.conversation_products (product_id);

alter table public.products enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_products enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

create policy "Anyone can read products"
on public.products
for select
using (true);

create policy "Only admin can insert products"
on public.products
for insert
with check (public.is_admin());

create policy "Only admin can update products"
on public.products
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Only admin can delete products"
on public.products
for delete
using (public.is_admin());

create policy "Admin can read all conversations"
on public.conversations
for select
using (public.is_admin());

create policy "Authenticated users can read own conversations"
on public.conversations
for select
using (auth.uid() = user_id);

create policy "Authenticated users can create own conversations"
on public.conversations
for insert
with check (auth.uid() = user_id);

create policy "Authenticated users can update own conversations"
on public.conversations
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Admin can manage conversations"
on public.conversations
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can read all messages"
on public.messages
for select
using (public.is_admin());

create policy "Authenticated users can read own messages"
on public.messages
for select
using (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
    and c.user_id = auth.uid()
  )
);

create policy "Authenticated users can insert messages into own conversations"
on public.messages
for insert
with check (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
    and c.user_id = auth.uid()
  )
);

create policy "Admin can manage messages"
on public.messages
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can read all conversation product references"
on public.conversation_products
for select
using (public.is_admin());

create policy "Authenticated users can read own conversation product references"
on public.conversation_products
for select
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_products.conversation_id
    and c.user_id = auth.uid()
  )
);

create policy "Admin can manage conversation product references"
on public.conversation_products
for all
using (public.is_admin())
with check (public.is_admin());
