-- Lemonnade Van Nuys — Phase 2 database schema
-- Run this once in Supabase: Project → SQL Editor → New Query → paste this whole file → Run

-- ==================== DEALS ====================
create table deals (
  id uuid primary key default gen_random_uuid(),
  day_label text not null,        -- e.g. "Monday", "Tuesday & Wednesday"
  items text not null,            -- e.g. "40% OFF Cake" — one line per deal item, separated by | (pipe)
  sort_order int default 0,       -- controls display order (Monday=1, Tuesday=2, etc.)
  active boolean default true,    -- toggle off instead of deleting to temporarily hide
  created_at timestamptz default now()
);

-- ==================== EVENTS ====================
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  event_time text,                -- e.g. "7:00 PM" — free text, keeps it simple
  location text default 'Weed Working Studio',
  description text,
  is_blast boolean default false, -- true = featured/highlighted on homepage banner
  active boolean default true,
  created_at timestamptz default now()
);

-- ==================== BLOG POSTS ====================
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,         -- Culture, Studio, Product, Deals, Events
  excerpt text not null,          -- short summary shown on the blog list
  body text,                      -- full post content (optional for now, plain text/markdown)
  published_date date default current_date,
  published boolean default true, -- toggle off to save as draft
  created_at timestamptz default now()
);

-- ==================== ROW LEVEL SECURITY ====================
-- Public visitors can READ active/published content.
-- Only a logged-in admin (authenticated user) can create, edit, or delete.

alter table deals enable row level security;
alter table events enable row level security;
alter table blog_posts enable row level security;

create policy "Public can read active deals" on deals
  for select using (active = true);
create policy "Admin can manage deals" on deals
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Public can read active events" on events
  for select using (active = true);
create policy "Admin can manage events" on events
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Public can read published posts" on blog_posts
  for select using (published = true);
create policy "Admin can manage blog posts" on blog_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ==================== STARTER DATA ====================
-- Your real weekly deals, so the site isn't empty on first load.

insert into deals (day_label, items, sort_order) values
('Monday', '🍰 40% OFF Cake|🌿 20% OFF Raw Garden, Trilogy, 710 Labs, Froot & Dab Daddy|💨 Hush: Buy 1 Get 20% OFF · Buy 2+ Get 30% OFF', 1),
('Tuesday', '🔥 30% OFF Connected, Alien Labs, STIIIZY & Jeeter|🍬 20% OFF Kushy Punch|🏪 20% OFF Entire Store', 2),
('Wednesday', '🌿 30% OFF CBX, Heirbloom, Highatus, Sluggers & Wizard Trees|🍫 60% OFF Kiva, Camino & Lost Farm|🏪 20% OFF Entire Store', 3),
('Thursday', '🔥 St. Ides: Buy 2+ Get 30% OFF|🫐 Wyld & Good Tide: Buy 2 Get 1 for $1|🚬 Royal Blunts: Buy 2 (1g) or Buy 1 (1.5g) Get 40% OFF', 4);

insert into events (title, event_date, event_time, location, description, is_blast) values
('Open Mic Night', '2026-08-22', '7:00 PM', 'Weed Working Studio', 'Live studio session — free entry, first come first served.', true),
('Vinyl Swap @ The Museum', '2026-08-09', '1:00 – 4:00 PM', 'The Museum', 'Bring records to trade, browse the collection.', false),
('New Drop Tasting', '2026-08-27', '5:00 – 7:00 PM', 'Shop Floor', 'Sample the newest arrivals before they hit the shelf.', false);

insert into blog_posts (title, category, excerpt, published_date) values
('Inside the Museum: This Month''s New Pieces', 'Culture', 'A look at what just landed in the hip-hop archive on our shop floor — new vinyl, memorabilia, and a couple of pieces we''ve been hunting down for months.', '2026-08-02'),
('Booking Studio Time: What to Know', 'Studio', 'How local artists can reserve a session at Weed Working — rates, gear on hand, and how to prep before you walk in.', '2026-07-24'),
('This Week''s Top-Shelf Picks', 'Product', 'What''s moving fast on the shelf right now, and why — a rundown from the budtenders on today''s standouts.', '2026-07-15');
