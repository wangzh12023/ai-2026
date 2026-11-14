/* Reused from Scroll-Drawn Timeline by EmiraIT (MIT).
 * https://codepen.io/sainul/pen/bNqMpXq
 * Original preserved in references/scroll-drawn-timeline.js.
 */
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }; // smoothstep
    const sv = (tag, attrs, parent) => { // create an SVG element
      const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    };
export { clamp, lerp, sstep, sv };
