/*
 * Lemonnade "Deals near me" widget
 * Add to any page (menu, deals, home):
 *   <div id="geo-nearby"></div>
 *   <script src="/geo-nearby.js" defer></script>
 * Location is only requested when the shopper taps the button,
 * and it's checked on the server and not stored.
 */
(function () {
  var SUPABASE_URL = 'https://ccczquselvfnomyatdat.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_uMlPLAmhfGmVFiHniYqdPQ_vtAwKoVI';

  var root = document.getElementById('geo-nearby');
  if (!root) return;

  var css = document.createElement('style');
  css.textContent =
    '.gn{font-family:inherit;margin:16px 0}' +
    '.gn-btn{display:inline-flex;align-items:center;gap:8px;background:#f5c400;color:#111;border:none;border-radius:999px;padding:12px 20px;font:inherit;font-weight:800;cursor:pointer}' +
    '.gn-btn:disabled{opacity:.6;cursor:wait}' +
    '.gn-msg{margin-top:10px;font-size:14px;opacity:.85}' +
    '.gn-deal{margin-top:12px;padding:14px 16px;border:2px solid #f5c400;border-radius:12px;background:#111;color:#fff}' +
    '.gn-deal b{display:block;font-size:18px;margin-bottom:4px}' +
    '.gn-deal p{margin:0 0 6px;font-size:14px;color:#ddd}' +
    '.gn-code{display:inline-block;margin-top:4px;padding:4px 10px;border:1px dashed #f5c400;border-radius:6px;color:#f5c400;font-weight:800;letter-spacing:.08em}' +
    '.gn-fine{font-size:11px;color:#999;margin-top:6px}';
  document.head.appendChild(css);

  root.className = 'gn';
  root.innerHTML = '<button type="button" class="gn-btn">\uD83D\uDCCD Deals near me</button><div class="gn-out"></div>';
  var btn = root.querySelector('.gn-btn');
  var out = root.querySelector('.gn-out');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function msg(t) { out.innerHTML = '<div class="gn-msg">' + esc(t) + '</div>'; }

  btn.addEventListener('click', function () {
    if (!('geolocation' in navigator)) return msg("Your browser can't share location.");
    btn.disabled = true;
    msg('Checking for deals near you…');
    navigator.geolocation.getCurrentPosition(function (pos) {
      fetch(SUPABASE_URL + '/rest/v1/rpc/geo_nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ p_lat: pos.coords.latitude, p_lng: pos.coords.longitude, p_accuracy: pos.coords.accuracy || 0 })
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (deals) {
          btn.disabled = false;
          if (!deals || !deals.length) return msg('No location deals where you are right now — check this week\u2019s deals instead.');
          out.innerHTML = deals.map(function (d) {
            return '<div class="gn-deal"><b>' + esc(d.headline) + '</b>' +
              (d.offer ? '<p>' + esc(d.offer) + '</p>' : '') +
              (d.promo_code ? '<span class="gn-code">' + esc(d.promo_code) + '</span>' : '') +
              (d.fine_print ? '<div class="gn-fine">' + esc(d.fine_print) + '</div>' : '') +
              '</div>';
          }).join('');
        })
        .catch(function () { btn.disabled = false; msg('Something went wrong. Try again.'); });
    }, function (err) {
      btn.disabled = false;
      msg(err.code === 1 ? 'Location is blocked — turn it on for your browser to see nearby deals.' : "Couldn't get your location. Try again.");
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  });
})();
