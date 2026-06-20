create unique index if not exists conversations_session_id_unique_idx
on public.conversations (session_id);

create or replace function public.touch_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists touch_conversation_after_message on public.messages;

create trigger touch_conversation_after_message
after insert on public.messages
for each row
execute function public.touch_conversation_on_message();
