// Lemonnade Van Nuys — Supabase client + content helpers
// Loaded on every page that needs live data (deals, events, blog, admin).
// Requires supabase-config.js and the Supabase JS CDN script to load first.

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- DEALS ----------
async function fetchDeals() {
  const { data, error } = await supabaseClient
    .from('deals')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (error) { console.error('fetchDeals error:', error); return []; }
  return data;
}

// ---------- EVENTS ----------
async function fetchEvents() {
  const { data, error } = await supabaseClient
    .from('events')
    .select('*')
    .eq('active', true)
    .order('event_date', { ascending: true });
  if (error) { console.error('fetchEvents error:', error); return []; }
  return data;
}

// ---------- BLOG ----------
async function fetchBlogPosts() {
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_date', { ascending: false });
  if (error) { console.error('fetchBlogPosts error:', error); return []; }
  return data;
}

// ---------- AUTH (admin only) ----------
async function adminSignIn(email, password) {
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

async function adminSignOut() {
  return await supabaseClient.auth.signOut();
}

async function getCurrentSession() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

// ---------- ADMIN CRUD ----------
async function adminUpsert(table, row) {
  // If row has an id, this updates; otherwise it inserts a new one.
  return await supabaseClient.from(table).upsert(row).select();
}

async function adminDelete(table, id) {
  return await supabaseClient.from(table).delete().eq('id', id);
}

async function adminFetchAll(table, orderCol) {
  const { data, error } = await supabaseClient
    .from(table)
    .select('*')
    .order(orderCol, { ascending: true });
  if (error) { console.error(`adminFetchAll(${table}) error:`, error); return []; }
  return data;
}
