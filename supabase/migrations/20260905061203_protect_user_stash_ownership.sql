alter table public.user_stash enable row level security;

drop policy if exists "Users can insert into own stash" on public.user_stash;
drop policy if exists "Users can view own stash" on public.user_stash;

create policy "Users can insert into own stash"
on public.user_stash
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can view own stash"
on public.user_stash
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update own stash"
on public.user_stash
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own stash"
on public.user_stash
for delete
to authenticated
using ((select auth.uid()) = user_id);
