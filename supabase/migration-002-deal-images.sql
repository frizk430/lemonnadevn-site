-- Migration: add image support to deals
-- Run this in Supabase → SQL Editor → New Query (only run this one, not the full schema.sql again)

alter table deals add column image_url text;

-- Storage bucket policies for deal-images
-- Create the 'deal-images' bucket first (Storage → New bucket → Public ON), then run this.

create policy "Public can view deal images"
on storage.objects for select
using (bucket_id = 'deal-images');

create policy "Authenticated users can upload deal images"
on storage.objects for insert
with check (bucket_id = 'deal-images' and auth.role() = 'authenticated');

create policy "Authenticated users can update deal images"
on storage.objects for update
using (bucket_id = 'deal-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete deal images"
on storage.objects for delete
using (bucket_id = 'deal-images' and auth.role() = 'authenticated');
