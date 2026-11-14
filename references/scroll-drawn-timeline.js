                    /* ==========================================================================
       Scroll-Drawn Timeline · SVG + GSAP ScrollTrigger
       Built by EmiraIT — https://emirait.com · MIT

       How it works
       · Landscape screens: the section is pinned while a U-shaped line draws
         itself (stroke-dashoffset). A "camera" (one transform on an SVG <g>)
         follows the glowing tip, each pin pops in as the line reaches it, and
         at the end the camera pulls back to show the whole timeline.
       · Phones / portrait: the same entries as a vertical list with a line
         that fills as you scroll.

       Make it yours: edit CONFIG and TIMELINE below. The first half of the
       entries runs along the top (left → right), the rest along the bottom
       (right → left). Any number of entries works; ~10–14 per row fit best.

       Libraries (Pen Settings → JS): gsap 3.13, ScrollTrigger 3.13,
       Lenis 1.3 (optional, smooth scrolling).
       ========================================================================== */

    const CONFIG = {
      heading: 'Timeline',   // drawn vertically beside the start of the line; short words fit best
      labelChars: 19,        // names wrap after about this many characters
      scrollLength: 4.6,     // screen-heights of scrolling for the whole drawing
      /* SVG drawing above this; must match the @media query in the CSS */
      wideQuery: '(min-width: 640px) and (min-height: 300px) and (orientation: landscape)',
      smoothScroll: true     // buttery scrolling when Lenis is loaded
    };

    /* placeholder group companies; several names in one year get a divider */
    const TIMELINE = [
      { year: '1976', names: ['Printing & Publishing House'] },
      { year: '1978', names: ['General Trading Company'] },
      { year: '1982', names: ['Neighbourhood Supermarkets'] },
      { year: '1985', names: ['Music & Audio'] },
      { year: '1988', names: ['Artisan Bakery'] },
      { year: '1989', names: ['Seafood Processing'] },
      { year: '1992', names: ['Trading Establishment'] },
      { year: '1993', names: ['Pre-press & Design Studio'] },
      { year: '1995', names: ['Mercantile & Marine Logistics'] },
      { year: '1998', names: ['Food Processing Plant'] },
      { year: '2001', names: ['Family Health Clinic'] },
      { year: '2003', names: ['Furniture Gallery', 'The Print House'] },
      { year: '2004', names: ['Foods Division'] },
      { year: '2006', names: ['Music Academy', 'Pure Music Store'] },
      { year: '2008', names: ['Industries & Manufacturing'] },
      { year: '2010', names: ['Free Zone Trading Hub'] },
      { year: '2014', names: ['Regional Branch, Qatar'] },
      { year: '2015', names: ['Kids Gym Franchise'] },
      { year: '2016', names: ['Plywood Mill', 'Metal & Pipes Manufacturing'] },
      { year: '2018', names: ['Pro Audio Distribution'] },
      { year: '2019', names: ['IT Services', 'City Media'] },
      { year: '2021', names: ['Regional Office, KSA'] },
      { year: '2023', names: ['Community Shopping Mall'] },
      { year: '2025', names: ['New Logistics Facility'] }
    ];
    /* ---------- helpers ---------- */
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }; // smoothstep
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sv = (tag, attrs, parent) => { // create an SVG element
      const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    };

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ---------- the world: a 1600 × 880 SVG ----------
       The line runs along the top, round the right-hand bend and back along
       the bottom. Its length is known exactly, so each pin knows how far the
       line must be drawn before it appears. */
    const VW = 1600, VH = 880;
    const Y1 = 300, Y2 = 610, X0 = 300, XR = 1500, R = 46, XL = 24;
    const ARC = Math.PI * R / 2;
    const TRACK = `M${X0} ${Y1}H${XR}A${R} ${R} 0 0 1 ${XR + R} ${Y1 + R}V${Y2 - R}A${R} ${R} 0 0 1 ${XR} ${Y2}H${XL}`;
    const TRACK_LEN = (XR - X0) + ARC + (Y2 - Y1 - 2 * R) + ARC + (XR - XL);
    const PIN = 'M0-5C-5-13-21-21-21-37A21 21 0 1 1 21-37C21-21 5-13 0-5Z';

    function wrap(name) {
      const lines = [];
      let line = '';
      for (const word of name.split(/\s+/)) {
        if (line && (line + ' ' + word).length > CONFIG.labelChars) { lines.push(line); line = word; }
        else line = line ? line + ' ' + word : word;
      }
      return line ? lines.concat(line) : lines;
    }

    /* one pin + a vertical label hanging below the line */
    function entry(cam, item, x, y, len) {
      const g = sv('g', { class: 'tl-entry', transform: `translate(${x} ${y})` }, cam);
      const pin = sv('g', {}, g);
      sv('path', { class: 'tl-pinshape', d: PIN }, pin);
      sv('text', { class: 'tl-year', x: 0, y: -32 }, pin).textContent = item.year;
      /* rows across the label column: wrapped lines, plus a divider between names */
      const rows = item.names.flatMap((name, n) => (n ? [null] : []).concat(wrap(name)));
      const width = rows.reduce((w, r) => w + (r === null ? 8 : 15), 0);
      const label = sv('g', {}, g);
      const col = sv('g', { transform: 'translate(0 18) rotate(-90)' }, label); // reads bottom to top
      const text = sv('text', { class: 'tl-label', 'text-anchor': 'end' }, col);
      let cur = -width / 2; // centre the column on the pin
      rows.forEach(r => {
        if (r === null) sv('line', { class: 'tl-sep', x1: -118, x2: 0, y1: cur + 3, y2: cur + 3 }, col);
        else sv('tspan', { x: 0, y: cur + 11 }, text).textContent = r;
        cur += r === null ? 8 : 15;
      });
      sv('title', {}, g).textContent = `${item.year}: ${item.names.join(', ')}`;
      return { pin, label, len };
    }

    function buildSVG() {
      const cam = $('.tl-cam');
      const half = Math.ceil(TIMELINE.length / 2);
      const top = TIMELINE.slice(0, half), bottom = TIMELINE.slice(half);

      sv('text', { class: 'tl-heading', transform: `translate(236 ${Y1 - 4}) rotate(-90)` }, cam).textContent = CONFIG.heading;
      const chevs = sv('g', {}, sv('g', { transform: `translate(262 ${Y1 - 92})` }, cam));
      sv('path', { d: 'M40 0l34 30-34 30H62l34-30L62 0z', fill: '#fff', opacity: '.28' }, chevs);
      sv('path', { class: 'tl-chev', d: 'M0 14l18 16L0 46h11l18-16L11 14zM20 14l18 16-18 16h11l18-16-18-16z' }, chevs);

      sv('path', { class: 'tl-track-ghost', d: TRACK }, cam);
      const track = sv('path', { class: 'tl-track', d: TRACK }, cam);

      /* top row left → right, bottom row right → left; len = distance along the line */
      const step = (a, b, n, i) => n > 1 ? a + i * (b - a) / (n - 1) : (a + b) / 2;
      const entries = [
        ...top.map((it, i) => { const x = step(400, 1440, top.length, i); return entry(cam, it, x, Y1, x - X0); }),
        ...bottom.map((it, i) => { const x = step(1440, 200, bottom.length, i); return entry(cam, it, x, Y2, TRACK_LEN - (x - XL)); })
      ];

      const tip = sv('g', {}, cam);
      sv('circle', { class: 'tl-tip-glow', r: 26 }, tip);
      sv('circle', { class: 'tl-tip', r: 4.5 }, tip);
      return { track, tip, chevs, entries };
    }

    function buildList() {
      $('.tl-list-head').textContent = CONFIG.heading;
      $('.tl-list').innerHTML = TIMELINE.map(it => `
        <li class="tl-li"><span class="tl-badge">${esc(it.year)}</span><span class="tl-names">${
          it.names.map(n => `<span>${esc(n)}</span>`).join('<hr>')}</span></li>`).join('');
    }

    /* ==========================================================================
       WIDE · pinned drawing; scroll progress P.v runs 0 → 1:
         .03 – .83   the line draws, pins pop in, the camera follows the tip
         .80 – .96   the camera pulls back to the full view
       ========================================================================== */
    function initWide(w) {
      const svg = $('.tl-svg'), cam = $('.tl-cam');
      w.track.style.strokeDasharray = TRACK_LEN;

      /* zoom in further on small screens so the labels stay readable */
      let Z0 = 1.55, lift = 110;
      function measure() {
        const r = svg.getBoundingClientRect();
        const scale = Math.min(r.width / VW, r.height / VH); // screen px per SVG unit
        Z0 = clamp(1.33 / scale, 1.55, 2.6);
        lift = 110 * 1.55 / Z0; // keep pins and labels framed at any zoom
      }

      const P = { v: 0 };
      function update() {
        const p = P.v;
        const len = TRACK_LEN * clamp((p - .03) / .8, 0, 1);
        w.track.style.strokeDashoffset = TRACK_LEN - len;
        const pt = w.track.getPointAtLength(len);
        w.tip.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
        w.tip.style.opacity = 1 - sstep(.84, .9, p);

        for (const e of w.entries) {
          const k = clamp((len - e.len + 50) / 120, 0, 1); // 0 → 1 as the tip passes this pin
          const kb = k < 1 ? 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2 : 1; // back-out overshoot
          e.pin.style.opacity = Math.min(1, k * 2);
          e.pin.setAttribute('transform', `translate(0 ${(1 - k) * -34}) scale(${Math.max(.001, kb)})`);
          e.label.style.opacity = clamp((k - .35) / .65, 0, 1);
          e.label.setAttribute('transform', `translate(0 ${(1 - k) * 16})`);
        }

        /* camera: look a little ahead of the tip, then pull back to the full view */
        const ahead = w.track.getPointAtLength(Math.min(TRACK_LEN, len + 170));
        const zk = sstep(.8, .96, p), z = lerp(Z0, 1, zk);
        const follow = lerp(0, ahead.y + lift, sstep(0, .1, p));
        const cx = clamp(lerp(ahead.x, VW / 2, zk), VW / 2 / z, VW - VW / 2 / z);
        const cy = clamp(lerp(follow, VH / 2, zk), VH / 2 / z, VH - VH / 2 / z);
        cam.setAttribute('transform', `translate(${VW / 2 - cx * z} ${VH / 2 - cy * z}) scale(${z})`);
      }

      measure();
      gsap.fromTo(P, { v: 0 }, {
        v: 1, ease: 'none', onUpdate: update,
        scrollTrigger: {
          trigger: '.tl-pin', start: 'top top', end: () => '+=' + innerHeight * CONFIG.scrollLength,
          pin: true, scrub: 1.2, anticipatePin: 1, invalidateOnRefresh: true,
          onRefreshInit: measure, onRefresh: update
        }
      });
      update();
      if (!REDUCED) gsap.to(w.chevs, { x: 10, duration: .9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    /* ==========================================================================
       NARROW · list; the line fills and each entry slides in
       ========================================================================== */
    function initNarrow() {
      const list = $('.tl-list');
      gsap.fromTo(list, { '--fill': 0 }, { '--fill': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 70%', scrub: 1 } });
      $$('.tl-li').forEach(li => {
        gsap.from(li.children, { autoAlpha: 0, x: 24, duration: .7, stagger: .08, scrollTrigger: { trigger: li, start: 'top 86%', once: true } });
      });
    }

    /* ==========================================================================
       Boot
       ========================================================================== */
    function initSmoothScroll() {
      if (!CONFIG.smoothScroll || REDUCED || !window.Lenis) return;
      const lenis = new Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: .95 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const world = buildSVG();
    buildList();
    initSmoothScroll();

    /* gsap.matchMedia() reverts every tween and ScrollTrigger of one layout
       before building the other, so resizing the preview just works */
    const mm = gsap.matchMedia();
    mm.add(CONFIG.wideQuery, () => initWide(world));
    mm.add(`not all and ${CONFIG.wideQuery}`, initNarrow);

    /* re-measure once the web fonts have arrived */
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
