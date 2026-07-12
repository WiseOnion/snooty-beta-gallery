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

  /* Single source of truth for which presenter slide sends a follower's
     phone to which scripted stop. wait.html uses this to make the FIRST
     jump; every stop page (discover/messages/booking) also calls
     followStops() below so it keeps listening and hands off to the NEXT
     stop when the presenter advances again. Without that second listener,
     a phone that already landed on a stop has no code left running that
     watches for further slide changes, so advancing past it does nothing. */
  const STOP_MAP = {
    3: 'discover.html?script=1&session=1',
    4: 'messages.html?script=1&session=1',
    5: 'wait.html?session=1', /* Q&A pause 1: phones return to the holding screen, attention up front */
    6: 'booking.html?script=1&session=1', /* starts at step 1 (service selection), the real beginning of the flow */
    9: 'wait.html?session=1', /* Q&A pause 2 */
  };

  /* Call from any scripted stop page: watches the live slide and
     navigates to STOP_MAP's destination as soon as the presenter moves
     to a DIFFERENT mapped slide than the one that sent this phone here. */
  function followStops() {
    watchSlide((slide) => {
      const dest = STOP_MAP[slide];
      if (dest && location.pathname.indexOf(dest.split('?')[0]) === -1) {
        location.href = dest;
      }
    });
  }

  window.SN = window.SN || {};
  window.SN.sync = { setSlide: setSlide, watchSlide: watchSlide, STOP_MAP: STOP_MAP, followStops: followStops };
})();
