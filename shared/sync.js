/* Snooty deck live sync: pushes the presenter's current slide number to
   every phone that scanned the slide-2 QR code, over Firebase's Realtime
   Database REST API. No SDK, no build step: a GET with ?live=true opens
   a Server-Sent Events stream, so followers get the update in real time
   (not on a polling interval), and a plain PUT is all the presenter side
   needs to write. Exposed as SN.sync alongside the rest of shared/*.js.

   Everything lives under /sessions/<id>/..., where <id> comes from the
   page's own ?session= param (the deck mints a fresh random one per tab
   load and stamps it into its QR + internal links). Without this, two
   open deck tabs -- e.g. testing on a laptop while also running the real
   presentation -- would both read/write the same fixed path, so a phone
   that scanned tab A's QR would start following whichever tab last wrote
   a slide, not the tab it actually scanned.

   Data shape at /sessions/<id>/session.json: { "slide": <number>, "updatedAt": <ms> }
*/
(function () {
  'use strict';

  const DB_URL = 'https://snooty-beta-deck-default-rtdb.firebaseio.com';

  /* The deck page (deck.html/deck-preview.html) mints this and puts it in
     its own URL before anything else runs; phone-facing pages just relay
     whatever ?session= they were sent with. Falls back to "1" only if the
     page truly has none (e.g. opened with no query string at all), so
     stray direct loads don't crash rather than to invite collision --
     that legacy fixed session is a last resort, not the normal path. */
  function getSessionId() {
    const v = new URLSearchParams(location.search).get('session');
    return v || '1';
  }

  const SESSION_ID = getSessionId();
  const BASE = '/sessions/' + encodeURIComponent(SESSION_ID);
  const PATH = BASE + '/session.json';

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

  /* Single source of truth for which presenter slide sends a follower's
     phone to which scripted stop. wait.html uses this to make the FIRST
     jump; every stop page (discover/booking/dashboard) also calls
     followStops() below so it keeps listening and hands off to the NEXT
     stop when the presenter advances again. Without that second listener,
     a phone that already landed on a stop has no code left running that
     watches for further slide changes, so advancing past it does nothing. */
  /* 1-indexed slide numbers, matching what show() pushes via
     SN.sync.setSlide(i+1) in deck-preview.html. Keyed to the CURRENT
     7-stop route (Discovery/Style Page/Storefront/Booking/Business/
     Messaging/Money), each stop being 3 slides (intro "explain" ->
     phone-preview "Stop N" -> pause) except Money, which has two
     intro slides back to back and no phone-preview of its own. Only
     the 6 numbered "Stop N" phone-preview slides release a phone from
     wait.html; every other slide (intros, pauses, Money, and
     everything before/after the 7-stop route, including Welcome,
     which carries the QR itself) keeps phones parked on the wait
     screen so attention stays on the presenter until a Stop slide
     deliberately releases them. re-derive these numbers from
     deck-preview.html's own ENTRY_SLIDE_FOR_STOP/PAUSE_SLIDE_FOR_STOP
     (1-indexed here vs 0-indexed there) if the slide order ever
     changes again -- this map does NOT update itself. */
  const S = '&session=' + encodeURIComponent(SESSION_ID);
  const STOP_MAP = {
    9: 'discover.html?script=1' + S, /* Stop 1: Discovery -- discover.html, tap into a card to see the look overlay */
    10: 'wait.html?' + S.slice(1), /* Style Page (explain), back to wait until Stop 2 */
    12: 'look.html?script=1' + S, /* Stop 2: Style Page -- look.html */
    13: 'wait.html?' + S.slice(1), /* Storefront (explain), back to wait until Stop 3 */
    15: 'profile.html?script=1' + S, /* Stop 3: Storefront -- profile.html */
    16: 'wait.html?' + S.slice(1), /* Booking (explain), back to wait until Stop 4 */
    18: 'booking.html?script=1' + S, /* Stop 4: Booking -- starts at step 1 (service selection) */
    19: 'wait.html?' + S.slice(1), /* Business (explain), back to wait until Stop 5 */
    21: 'dashboard.html?script=1' + S, /* Stop 5: Business -- dashboard.html, the live Approve tap */
    22: 'wait.html?' + S.slice(1), /* Messaging (explain), back to wait until Stop 6 */
    24: 'messages.html?script=1' + S, /* Stop 6: Messaging -- messages.html */
    25: 'wait.html?' + S.slice(1), /* Money pt.1, back to wait for the rest of the close (Money has no phone stop) */
  };

  /* Call from any scripted stop page: watches the live slide and
     navigates to STOP_MAP's destination as soon as the presenter moves
     to a DIFFERENT mapped slide than the one that sent this phone here.
     Uses replace(), not href=, so each stop overwrites the iframe's
     current history entry instead of pushing a new one: with href=,
     pressing the phone's back button would flicker back to the PREVIOUS
     stop for an instant before this same listener caught the still-live
     slide and forced it forward again. replace() leaves nothing there
     to go back to -- which is why the block below pushes exactly ONE
     entry of its own, so back has a defined, deliberate result (the
     wait screen) instead of doing nothing or leaking to whatever the
     iframe's src happened to be before app-shell.html set it. */
  function followStops() {
    watchSlide((slide) => {
      const dest = STOP_MAP[slide];
      if (dest && location.pathname.indexOf(dest.split('?')[0]) === -1) {
        location.replace(dest);
      }
    });
    goBackToWait();
  }

  /* Every scripted stop is meant to feel like a dead end you can only
     leave by the presenter advancing -- except the phone's own back
     button, which should always be a safety valve back to the wait
     screen rather than a no-op or a flicker. history.pushState here
     (not the location.replace() the rest of this file uses) plants
     exactly one real entry pointing at THIS SAME URL, so the very
     first back press fires popstate without changing the address bar,
     and the handler swaps the iframe to wait.html itself. Skipped on
     wait.html: it's already the destination, nothing to send back to. */
  function goBackToWait() {
    if (location.pathname.indexOf('wait.html') !== -1) return;
    history.pushState({ snootyStop: true }, '', location.href);
    window.addEventListener('popstate', () => {
      location.replace('wait.html?' + S.slice(1));
    });
  }

  /* ---------- Presence (how many phones are following along) ----------
     There's no Firebase SDK here (no build step, plain REST + SSE), so
     there's no real onDisconnect hook: a phone that closes its tab can't
     tell the server it left. Instead each phone writes a heartbeat under
     /presence/<clientId>.json every 5s; the presenter counts whatever
     heartbeats are newer than STALE_MS and treats the rest as gone. That
     puts departures on a ~15s lag instead of instant, the tradeoff for
     staying dependency-free. clientId is cached in sessionStorage so a
     phone that navigates between stops (wait -> discover -> booking...)
     keeps writing the SAME key instead of registering as a new visitor
     on every page. */
  const PRESENCE_PATH = BASE + '/presence.json';
  const HEARTBEAT_MS = 5000;
  const STALE_MS = 15000;

  function clientId() {
    let id = sessionStorage.getItem('snooty-client-id');
    if (!id) {
      id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('snooty-client-id', id);
    }
    return id;
  }

  /* Call once from any phone-facing page (wait.html and every scripted
     stop) to register this phone as "following along" and keep renewing
     that as long as the tab stays open, visible, AND in front. A phone
     that's backgrounded (screen locked, switched to another app, or a
     different browser tab in front) should NOT count as "connected",
     so the beat only fires while document.visibilityState === 'visible'.
     Going to the background simply stops renewing the timestamp, it
     ages past STALE_MS on its own and the presenter's count drops it,
     same as if the tab had been closed. Coming back to the foreground
     fires an immediate beat instead of waiting out the interval, so
     re-appearing on the presenter's count feels instant. */
  function startHeartbeat() {
    const id = clientId();
    const beat = () => {
      if (document.visibilityState !== 'visible') return;
      fetch(DB_URL + BASE + '/presence/' + id + '.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Date.now()),
      }).catch(() => {});
    };
    beat();
    setInterval(beat, HEARTBEAT_MS);
    document.addEventListener('visibilitychange', beat);
  }

  /* Presenter side: streams /presence.json (same SSE-with-poll-fallback
     shape as watchSlide) and reports how many entries are still fresh. */
  function watchPresenceCount(onChange) {
    let last = null;
    const emit = (count) => {
      if (count !== last) { last = count; onChange(count); }
    };
    const countFresh = (data) => {
      if (!data) return 0;
      const now = Date.now();
      return Object.values(data).filter((ts) => typeof ts === 'number' && now - ts < STALE_MS).length;
    };

    let es = null;
    let pollTimer = null;
    let recheckTimer = null;
    function startPolling() {
      if (pollTimer) return;
      pollTimer = setInterval(() => {
        fetch(DB_URL + PRESENCE_PATH)
          .then((r) => r.json())
          .then((data) => emit(countFresh(data)))
          .catch(() => {});
      }, 4000);
    }

    try {
      es = new EventSource(DB_URL + PRESENCE_PATH + '?live=true');
      const refetch = () => {
        fetch(DB_URL + PRESENCE_PATH)
          .then((r) => r.json())
          .then((data) => emit(countFresh(data)))
          .catch(() => {});
      };
      es.addEventListener('put', refetch);
      es.addEventListener('patch', refetch);
      es.onerror = () => { es.close(); startPolling(); };
    } catch (err) {
      startPolling();
    }

    fetch(DB_URL + PRESENCE_PATH)
      .then((r) => r.json())
      .then((data) => emit(countFresh(data)))
      .catch(() => {});

    /* Heartbeats going stale (a phone closed mid-presentation) is a
       passive fact, nothing PUTs to tell us that happened, so re-count
       on a timer too, independent of whether Firebase sends a new event. */
    recheckTimer = setInterval(() => {
      fetch(DB_URL + PRESENCE_PATH)
        .then((r) => r.json())
        .then((data) => emit(countFresh(data)))
        .catch(() => {});
    }, 5000);

    return function stop() {
      if (es) es.close();
      if (pollTimer) clearInterval(pollTimer);
      if (recheckTimer) clearInterval(recheckTimer);
    };
  }

  window.SN = window.SN || {};
  window.SN.sync = {
    sessionId: SESSION_ID,
    setSlide: setSlide,
    watchSlide: watchSlide,
    STOP_MAP: STOP_MAP,
    followStops: followStops,
    startHeartbeat: startHeartbeat,
    watchPresenceCount: watchPresenceCount,
  };
})();
