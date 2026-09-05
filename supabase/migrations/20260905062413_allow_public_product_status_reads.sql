drop policy if exists "Anyone can read product statuses" on public.product_status;

create policy "Anyone can read product statuses"
on public.product_status
for select
to anon, authenticated
using (true);
