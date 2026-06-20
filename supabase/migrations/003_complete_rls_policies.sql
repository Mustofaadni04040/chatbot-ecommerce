alter table public.products enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_products enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    auth.jwt() -> 'app_metadata' ->> 'role',
    ''
  ) = 'admin';
$$;

-- Reset every existing policy so this migration is the single RLS source of truth.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'products',
        'conversations',
        'messages',
        'conversation_products'
      )
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end;
$$;

-- Products: everyone can read, only admins can write.
create policy products_public_read
on public.products
for select
to anon, authenticated
using (true);

create policy products_admin_insert
on public.products
for insert
to authenticated
with check (public.is_admin());

create policy products_admin_update
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy products_admin_delete
on public.products
for delete
to authenticated
using (public.is_admin());

-- Conversations: authenticated owners can read their own rows; admins can read all.
create policy conversations_owner_read
on public.conversations
for select
to authenticated
using (auth.uid() = user_id);

create policy conversations_admin_read
on public.conversations
for select
to authenticated
using (public.is_admin());

-- Messages inherit ownership from their parent conversation.
create policy messages_owner_read
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations as conversation
    where conversation.id = messages.conversation_id
      and conversation.user_id = auth.uid()
  )
);

create policy messages_admin_read
on public.messages
for select
to authenticated
using (public.is_admin());

-- Product references follow the same ownership rules as conversation messages.
create policy conversation_products_owner_read
on public.conversation_products
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations as conversation
    where conversation.id = conversation_products.conversation_id
      and conversation.user_id = auth.uid()
  )
);

create policy conversation_products_admin_read
on public.conversation_products
for select
to authenticated
using (public.is_admin());
