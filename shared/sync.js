/* Snooty deck live sync: pushes the presenter's current slide number to
   every phone that scanned the slide-2 QR code, over Firebase's Realtime
   Database REST API. No SDK, no build step: a GET with ?live=true opens
   a Server-Sent Events stream, so followers get the update in real time
   (not on a polling interval), and a plain PUT is all the presenter side
   needs to write. Exposed as SN.sync alongside the rest of shared/*.js.

   Data shape at /session.json: { "slide": <number>, "updatedAt": <ms> }
*/
(function () {
  'use strict';

  const DB_URL = 'https://snooty-beta-deck-default-rtdb.firebaseio.com';
  const PATH = '/session.json';

  function setSlide(slide) {
    fetch(DB_URL + PATH, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slide: slide, updatedAt: Date.now() }),
    }).catch(() => {}); /* presenter's own view never depends on this succeeding */
  }

  /* Streams slide changes via SSE. Falls back to a 2s poll if EventSource
     or the stream connection fails (e.g. corporate wifi blocking it),
     so following still works, just less instantly. */
  function watchSlide(onChange) {
    let last = null;
    const emit = (slide) => {
      if (slide !== last) { last = slide; onChange(slide); }
    };

    let es = null;
    let pollTimer = null;
    function startPolling() {
      if (pollTimer) return;
      pollTimer = setInterval(() => {
        fetch(DB_URL + PATH)
          .then((r) => r.json())
          .then((data) => { if (data && typeof data.slide === 'number') emit(data.slide); })
          .catch(() => {});
      }, 2000);
    }

    try {
      es = new EventSource(DB_URL + PATH + '?live=true');
      es.addEventListener('put', (e) => {
        try {
          const data = JSON.parse(e.data).data;
          if (data && typeof data.slide === 'number') emit(data.slide);
        } catch (err) { /* malformed event, ignore */ }
      });
      es.onerror = () => { es.close(); startPolling(); };
    } catch (err) {
      startPolling();
    }

    /* prime with current value immediately so a fresh follower doesn't
       wait for the next slide change to see where the presenter is */
    fetch(DB_URL + PATH)
      .then((r) => r.json())
      .then((data) => { if (data && typeof data.slide === 'number') emit(data.slide); })
      .catch(() => {});

    return function stop() {
      if (es) es.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }

  /* Guided-walkthrough progress pill, shown on every stop page during
     the QR-driven presentation (?session=1). Fixed to the top of the
     phone screen so the room always sees which chapter of the story
     they're in: Discover -> Booking -> Your Business, filling to a
     gold check as each stop completes. stopIndex is 1-based; pass 0
     for "not started yet" (all hollow). */
  const STOPS = ['Discover', 'Booking', 'Your Business'];
  function renderWalkthroughProgress(stopIndex) {
    let el = document.getElementById('wt-progress');
    if (!el) {
      el = document.createElement('div');
      el.id = 'wt-progress';
      el.style.cssText =
        'position:fixed; top:calc(10px + env(safe-area-inset-top)); left:50%; transform:translateX(-50%); z-index:600;' +
        'display:flex; align-items:center; gap:14px; background:rgba(24,24,24,0.85); backdrop-filter:blur(10px);' +
        '-webkit-backdrop-filter:blur(10px); border-radius:9999px; padding:8px 16px; pointer-events:none;';
      document.body.appendChild(el);
    }
    el.innerHTML = STOPS.map((name, i) => {
      const done = i + 1 < stopIndex, active = i + 1 === stopIndex;
      const dot = done
        ? '<span style="display:inline-flex; width:14px; height:14px; border-radius:50%; background:#C99A4A; align-items:center; justify-content:center; font-size:9px; color:#241505; font-weight:700;">✓</span>'
        : '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:' + (active ? '#C99A4A' : 'rgba(255,255,255,0.3)') + ';"></span>';
      const label = 'font-family:Jost,sans-serif; font-size:10.5px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:' +
        (active ? '#C99A4A' : done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)') + ';';
      return '<span style="display:flex; align-items:center; gap:6px;">' + dot + '<span style="' + label + '">' + name + '</span></span>';
    }).join('<span style="width:16px; height:1px; background:rgba(255,255,255,0.2);"></span>');
  }

  window.SN = window.SN || {};
  window.SN.sync = { setSlide: setSlide, watchSlide: watchSlide };
  window.SN.walkthroughProgress = renderWalkthroughProgress;
})();
