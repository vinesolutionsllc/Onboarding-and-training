-- Replace the email below, then run this in Supabase Dashboard > SQL Editor.
update public.profiles
set role = 'admin', updated_at = now()
where id = (
  select id from auth.users where email = 'YOUR-ADMIN-EMAIL@example.com'
);
