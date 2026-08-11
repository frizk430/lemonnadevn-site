// Lemonnade Van Nuys — shared site components
// Renders header, marquee, footer, and age gate on every page from one source of truth.
// To change the nav, logo, or footer site-wide, edit ONLY this file.

const LOGO_DATA_URI_KEY = 'lmnd_logo_b64'; // logo is injected separately, see index.html loader

const NAV_ITEMS = [
  { label: 'Shop All', href: 'menu.html' },
  { label: 'Categories', href: 'menu.html' },
  { label: 'Deals', href: 'deals.html' },
  { label: 'Museum & Studio', href: 'studio.html' },
  { label: 'Events', href: 'events.html' },
  { label: 'Blog', href: 'blog.html' },
];

function renderMarquee() {
  return `
  <div class="marquee">
    <div class="marquee-track">
      <span>★ WEEKLY DEALS LIVE NOW</span>
      <span>★ 7040 HAYVENHURST AVE, VAN NUYS · OPEN DAILY 8AM–9:50PM</span>
      <span>★ HIP-HOP MUSEUM + WEED WORKING STUDIO ON SITE</span>
      <span>★ WEEKLY DEALS LIVE NOW</span>
      <span>★ 7040 HAYVENHURST AVE, VAN NUYS · OPEN DAILY 8AM–9:50PM</span>
      <span>★ HIP-HOP MUSEUM + WEED WORKING STUDIO ON SITE</span>
    </div>
  </div>`;
}

function renderHeader(activeHref, logoSrc) {
  const navLinks = NAV_ITEMS.map(item => {
    const active = item.href === activeHref ? ' style="color:var(--yellow);"' : '';
    return `<a href="${item.href}"${active}>${item.label}</a>`;
  }).join('\n        ');

  const mobileLinks = NAV_ITEMS.map(item =>
    `<a href="${item.href}" onclick="toggleMobileNav()">${item.label}</a>`
  ).join('\n      ');

  return `
    <header>
      <button class="burger" id="burgerBtn" onclick="toggleMobileNav()" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <a href="index.html" class="logo"><img src="${logoSrc}" alt="Lemonnade Van Nuys logo"></a>
      <nav>
        ${navLinks}
        <a href="menu.html" class="nav-cta">Shop Menu →</a>
      </nav>
    </header>

    <div class="mobile-nav-backdrop" id="mobileNavBackdrop" onclick="toggleMobileNav()"></div>
    <nav class="mobile-nav" id="mobileNav">
      ${mobileLinks}
      <a href="menu.html" class="nav-cta" onclick="toggleMobileNav()">Shop Menu →</a>
    </nav>`;
}

function renderFooter(logoSrc) {
  return `
    <footer>
      <div>
        <a href="index.html" class="logo"><img src="${logoSrc}" alt="Lemonnade Van Nuys logo"></a>
        <p style="max-width:280px;">7040 Hayvenhurst Ave<br>Van Nuys, CA · Open Daily 8AM–9:50PM</p>
      </div>
      <div><h5>Shop</h5><ul><li><a href="menu.html">Flower</a></li><li><a href="menu.html">Vapes</a></li><li><a href="menu.html">Edibles</a></li><li><a href="deals.html">Deals</a></li></ul></div>
      <div><h5>Experience</h5><ul><li><a href="studio.html">Museum</a></li><li><a href="studio.html">Studio</a></li><li><a href="events.html">Events</a></li><li><a href="about.html">Contact</a></li></ul></div>
      <div><h5>Legal</h5><ul><li>21+ Only</li><li>Terms</li><li>Privacy</li><li>Licensing</li></ul></div>
      <div><h5>Follow Us</h5><ul>
        <li><a href="https://instagram.com/LemonnadeVanNuys" target="_blank" rel="noopener">@LemonnadeVanNuys</a></li>
        <li><a href="https://instagram.com/WeWorkingStudios" target="_blank" rel="noopener">@WeWorkingStudios</a></li>
      </ul></div>
    </footer>
    <div class="foot-bottom">
      <span>© 2026 Lemonnade Van Nuys</span>
      <span>Built for Lemonnade</span>
    </div>`;
}

function renderAgeGate(logoSrc) {
  return `
  <div id="ageGate">
    <div class="gate-card">
      <img class="gate-logo" src="${logoSrc}" alt="Lemonnade logo">
      <div class="gate-eyebrow">Lemonnade · Van Nuys, CA</div>
      <h1 class="gate-title display">Prove it.</h1>
      <p class="gate-sub">You must be 21+ or a valid CA medical patient (18+) to enter.<br>We check ID on every order — online and in-store.</p>
      <div class="gate-buttons">
        <button class="btn btn-yellow" onclick="passGate()">I'm 21+ / Medical Patient</button>
        <button class="btn btn-outline" onclick="denyGate()">I'm Under 21</button>
      </div>
      <div class="gate-deny" id="denyMsg">Sorry — you must be 21 years or older (or a valid medical patient 18+) to access this site, per California state law.</div>
      <div class="gate-fine">By entering, you agree to our <a href="#">Terms</a>. For use only by adults 21+. Keep out of reach of children.</div>
    </div>
  </div>`;
}

// --- Mounts everything and wires up behavior. Call this once per page. ---
function mountLemonnadeSite({ activeHref, logoSrc }) {
  document.body.insertAdjacentHTML('afterbegin', renderAgeGate(logoSrc));

  const site = document.getElementById('site');
  if (site) {
    site.insertAdjacentHTML('afterbegin', renderMarquee() + renderHeader(activeHref, logoSrc));
    site.insertAdjacentHTML('beforeend', renderFooter(logoSrc));
  }

  // Age gate: check if already passed this session
  if (sessionStorage.getItem('lmnd_age_ok') === '1') {
    document.getElementById('ageGate').classList.add('hidden');
    site.classList.add('revealed');
  }
}

function passGate() {
  sessionStorage.setItem('lmnd_age_ok', '1');
  document.getElementById('ageGate').classList.add('hidden');
  document.getElementById('site').classList.add('revealed');
}

function denyGate() {
  document.getElementById('denyMsg').classList.add('show');
}

function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const btn = document.getElementById('burgerBtn');
  const isOpen = nav.classList.toggle('open');
  backdrop.classList.toggle('open', isOpen);
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen);
}
