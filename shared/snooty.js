/* ============================================================
   Snooty Beta Gallery: shared micro-interaction include.
   Load after snooty.css and seed.js. Exposes window.SN.
   ============================================================ */
(function () {
  'use strict';
  const SN = {};

  /* ---------- Money / format helpers ---------- */
  SN.money = (cents, opts) => {
    const o = opts || {};
    const dollars = cents / 100;
    const hasCents = Math.round(cents) % 100 !== 0 || o.forceCents;
    return '$' + dollars.toLocaleString('en-US', {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    });
  };
  SN.mins = (m) => {
    const h = Math.floor(m / 60), r = m % 60;
    if (!h) return r + ' min';
    return r ? h + 'h ' + r + 'm' : h + (h === 1 ? ' hour' : ' hours');
  };
  SN.compact = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n);

  /* ---------- Blur-up image loading ----------
     Any <img data-src> inside .ph gets lazy-loaded with blur-up. */
  SN.hydrateImages = (root) => {
    const imgs = (root || document).querySelectorAll('img[data-src]:not([src])');
    const load = (img) => {
      img.src = img.dataset.src;
      if (img.complete) img.classList.add('is-loaded');
      else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      img.addEventListener('error', () => { img.closest('.ph') && img.closest('.ph').classList.add('ph-error'); }, { once: true });
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '300px' });
      imgs.forEach((img) => io.observe(img));
    } else {
      imgs.forEach(load);
    }
  };

  /* ---------- Count-up numbers ----------
     SN.countUp(el, 12800, {money:true, ms:800, prefix:'$'}) */
  SN.countUp = (el, target, opts) => {
    const o = Object.assign({ ms: 800, money: false, decimals: 0, prefix: '', suffix: '' }, opts);
    const start = performance.now();
    const from = o.from || 0;
    const fmt = (v) => {
      if (o.money) return SN.money(Math.round(v));
      return o.prefix + v.toLocaleString('en-US', { minimumFractionDigits: o.decimals, maximumFractionDigits: o.decimals }) + o.suffix;
    };
    const tick = (now) => {
      const t = Math.min(1, (now - start) / o.ms);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(from + (target - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Toast notifications ---------- */
  SN.toast = (title, body, opts) => {
    const o = opts || {};
    let holder = document.getElementById('sn-toasts');
    if (!holder) { holder = document.createElement('div'); holder.id = 'sn-toasts'; document.body.appendChild(holder); }
    const t = document.createElement('div');
    t.className = 'sn-toast';
    t.setAttribute('role', 'status');
    t.innerHTML =
      '<div class="sn-toast-icon">' + (o.icon || 'S') + '</div>' +
      '<div><div class="sn-toast-title"></div><div class="sn-toast-body"></div></div>';
    t.querySelector('.sn-toast-title').textContent = title;
    t.querySelector('.sn-toast-body').textContent = body || '';
    holder.appendChild(t);
    SN.chime();
    const ttl = o.ms || 3800;
    setTimeout(() => { t.classList.add('is-leaving'); setTimeout(() => t.remove(), 320); }, ttl);
    return t;
  };

  /* ---------- Sound (off by default, shared mute state) ---------- */
  const SOUND_KEY = 'snooty-sound-on';
  SN.soundOn = () => localStorage.getItem(SOUND_KEY) === '1';
  SN.setSound = (on) => localStorage.setItem(SOUND_KEY, on ? '1' : '0');
  SN.chime = () => {
    if (!SN.soundOn()) return;
    try {
      const ctx = SN._actx || (SN._actx = new (window.AudioContext || window.webkitAudioContext)());
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.36);
    } catch (e) { /* sound is decorative */ }
  };

  /* ---------- Purpose card ----------
     SN.purposeCard({kicker, title, body, cta}) shows once per page load. */
  SN.purposeCard = (cfg) => {
    const wrap = document.createElement('div');
    wrap.className = 'purpose-card';
    wrap.innerHTML =
      '<div class="purpose-card-inner">' +
      '<div class="purpose-kicker"></div><h2></h2><p></p>' +
      '<button class="btn btn-dark btn-block" type="button"></button>' +
      '</div>';
    wrap.querySelector('.purpose-kicker').textContent = cfg.kicker || 'Snooty Beta Preview';
    wrap.querySelector('h2').textContent = cfg.title;
    wrap.querySelector('p').textContent = cfg.body;
    wrap.querySelector('button').textContent = cfg.cta || 'Start exploring';
    const close = () => {
      wrap.style.transition = 'opacity 240ms ease'; wrap.style.opacity = '0';
      setTimeout(() => { wrap.remove(); if (cfg.onClose) cfg.onClose(); }, 250);
    };
    wrap.querySelector('button').addEventListener('click', close);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    document.body.appendChild(wrap);
  };

  /* ---------- Hotspot tour ----------
     SN.tour([{target:'#el', text:'...', dx:-8, dy:-8}], toggleBtn) */
  SN.tour = (spots, toggleBtn) => {
    let active = false;
    const nodes = [];
    const clear = () => { nodes.forEach((n) => n.remove()); nodes.length = 0; };
    const build = () => {
      spots.forEach((s) => {
        const target = document.querySelector(s.target);
        if (!target) return;
        const r = target.getBoundingClientRect();
        const dot = document.createElement('button');
        dot.className = 'hotspot';
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Tip: ' + s.text);
        dot.style.left = (r.left + window.scrollX + (s.dx != null ? s.dx : r.width - 14)) + 'px';
        dot.style.top = (r.top + window.scrollY + (s.dy != null ? s.dy : -6)) + 'px';
        const tip = document.createElement('div');
        tip.className = 'hotspot-tip';
        tip.textContent = s.text;
        document.body.appendChild(dot); document.body.appendChild(tip);
        nodes.push(dot, tip);
        dot.addEventListener('click', () => {
          const dr = dot.getBoundingClientRect();
          const openLeft = dr.left > window.innerWidth - 260;
          tip.style.left = (openLeft ? dr.left + window.scrollX - 246 : dr.left + window.scrollX + 30) + 'px';
          tip.style.top = (dr.top + window.scrollY - 4) + 'px';
          document.querySelectorAll('.hotspot-tip.is-open').forEach((o) => { if (o !== tip) o.classList.remove('is-open'); });
          tip.classList.toggle('is-open');
        });
      });
    };
    const set = (on) => {
      active = on;
      clear();
      if (active) build();
      if (toggleBtn) toggleBtn.classList.toggle('is-active', active);
    };
    if (toggleBtn) toggleBtn.addEventListener('click', () => set(!active));
    window.addEventListener('resize', () => { if (active) { clear(); build(); } });
    return { set: set };
  };

  /* ---------- Gallery progress dots ---------- */
  const SEEN_KEY = 'snooty-gallery-seen';
  SN.markSeen = (id) => {
    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
      if (!seen.includes(id)) { seen.push(id); localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); }
    } catch (e) { /* private mode */ }
  };
  SN.seen = () => { try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch (e) { return []; } };

  /* ---------- Fake load: skeleton for a beat, then content ----------
     SN.reveal(containerEl, buildFn, delayMs): container keeps its skeleton
     children for delayMs, then buildFn(container) replaces them. */
  SN.reveal = (el, buildFn, delayMs) => {
    setTimeout(() => {
      el.querySelectorAll('.skel').forEach((s) => s.classList.remove('skel'));
      buildFn(el);
      SN.hydrateImages(el);
    }, delayMs == null ? 650 : delayMs);
  };

  /* ---------- Desktop phone framing ---------- */
  SN.frameOnDesktop = () => {
    if (window.matchMedia('(min-width: 700px)').matches) document.body.classList.add('framed');
  };

  /* ---------- Zoom lock, JS fallback ----------
     touch-action:pan-x pan-y (snooty.css) is the real cross-platform
     blocker, but Safari's pinch gesture fires non-standard gesturestart/
     gesturechange events that predate touch-action support, and some
     older WebKit builds still act on them regardless. Belt and
     suspenders, no user-visible cost either way. */
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());
  /* Only swallows the tap when it lands within ~30px of the previous
     one inside the double-tap window: that's what double-tap-zoom
     actually is. Two quick taps on two DIFFERENT buttons are far
     enough apart to pass through untouched, so no real interaction
     (rapidly tapping Continue twice, etc.) ever gets eaten. */
  let lastTap = null;
  document.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const now = Date.now();
    if (lastTap && now - lastTap.time <= 300 &&
        Math.abs(t.clientX - lastTap.x) < 30 && Math.abs(t.clientY - lastTap.y) < 30) {
      e.preventDefault();
    }
    lastTap = { time: now, x: t.clientX, y: t.clientY };
  }, { passive: false });

  /* ---------- Dismiss the mobile keyboard, cross-platform ----------
     input.blur() alone reliably closes the keyboard on iOS Safari but
     often does NOT on Android Chrome (a known, long-standing platform
     gap). Toggling the field briefly readonly forces Android's IME to
     release even when blur is ignored; iOS is unaffected by the extra
     step, so the same call is safe to use everywhere. */
  SN.dismissKeyboard = (input) => {
    input.setAttribute('readonly', 'readonly');
    input.blur();
    setTimeout(() => input.removeAttribute('readonly'), 100);
  };

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => SN.hydrateImages(document));

  window.SN = SN;
})();
