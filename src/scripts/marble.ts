// A living risograph print: flat inks (black ground, a torn green field with
// blue grain, vermilion and cobalt strokes, black slabs) with glitch tearing.
// It drifts calmly; tearing and stroke drift ramp up around whichever
// interactive element ([data-energy]) the visitor is near, hovering or focusing.

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_phase;
uniform vec2 u_attract;
uniform float u_energy;
uniform vec3 u_tint;
uniform float u_tintAmt;
uniform float u_hue;
uniform float u_unit;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Anchor to the top-left and scale by width only, so a change in viewport
  // height (mobile browser chrome) can never shift or rescale the print.
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 p = frag / u_unit;
  vec2 at = u_attract / u_unit;
  float t = u_phase;

  // Local influence of the attractor: a soft pool around the hovered thing.
  float d = distance(p, at);
  float pool = exp(-d * d / 0.06) * u_energy;

  // Glitch tearing: thin horizontal bands slip sideways. A few always do;
  // near an interaction more bands tear, and further.
  float bandId = floor(p.y * 55.0);
  float tears = step(0.86 - pool * 0.6, hash(vec2(bandId, 7.0)));
  float slip = (hash(vec2(bandId, floor(t * 3.0))) - 0.5) * (0.02 + pool * 0.2) * tears;
  vec2 q = vec2(p.x + slip, p.y);

  // Torn edges: noise stretched along x, so edges fray into horizontal teeth.
  float jag = (noise(vec2(q.x * 7.0, q.y * 80.0)) - 0.5) * 0.12;

  // Ink field: one big flat field with torn edges.
  float field = step(0.43, fbm(vec2(q.x * 1.1, q.y * 0.9) + vec2(3.0, t * 0.04)) + jag);

  // Strokes: tall vertical brush strokes that sway slowly. The second sample is
  // offset like a misregistered plate, which leaves a dark line on one edge.
  float sway = 0.6 * fbm(vec2(q.y * 0.8, t * 0.05));
  // A slight lean, like the diagonal strokes in a screenprint.
  vec2 sp = vec2(q.x * 8.0 + q.y * 1.4 + sway, q.y * 0.4 - t * 0.03);
  float rough = (noise(vec2(q.x * 60.0, q.y * 10.0)) - 0.5) * 0.06;
  float cut = 0.6 - pool * 0.06;
  float stroke = step(cut, fbm(sp + vec2(11.0, 0.0)) + rough);
  float strokeOff = step(cut, fbm(sp + vec2(11.1, 0.012)) + rough);
  float which = step(0.5, noise(vec2(q.x * 4.0 + q.y * 0.7 + sway, 4.0)));

  // Black slabs: diagonal shapes cutting across everything.
  vec2 rp = mat2(0.8, -0.6, 0.6, 0.8) * q;
  float slab = step(0.7, fbm(vec2(rp.x * 2.4, rp.y * 0.6) + vec2(40.0, -t * 0.02)) + jag * 0.5);

  vec3 black = vec3(0.043, 0.051, 0.043);
  vec3 green = vec3(0.247, 0.541, 0.290);
  vec3 blue = vec3(0.184, 0.333, 0.894);
  vec3 red = vec3(0.941, 0.325, 0.227);
  // The green/blue cycle swaps the two inks between the field and the strokes.
  vec3 fieldInk = mix(green, blue, u_hue);
  vec3 altInk = mix(blue, green, u_hue);

  // Riso grain: the field is speckled with the other ink, denser in vertical bands.
  float density = 0.12 + 0.3 * noise(vec2(q.x * 14.0, q.y * 2.0));
  float speck = step(1.0 - density * 0.5, hash(floor(frag)));
  vec3 col = mix(black, mix(fieldInk, altInk, speck), field);

  vec3 strokeInk = mix(red, altInk, which);
  strokeInk = mix(strokeInk, u_tint, u_tintAmt * min(pool * 1.5, 0.85));
  col = mix(col, strokeInk, stroke);
  col = mix(col, black, abs(stroke - strokeOff) * 0.9);
  col = mix(col, black, slab);

  // Uneven ink and paper tooth.
  col *= 0.88 + 0.12 * noise(frag * 0.3);
  col += (hash(frag + 3.1) - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}
`;

const HUE_PERIOD_S = 60;

interface State {
  energy: number;
  target: number;
  phase: number;
  hueClock: number;
  attract: [number, number];
  attractGoal: [number, number];
  tint: [number, number, number];
  tintAmt: number;
  tintGoal: number;
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

function parseTint(el: Element | null): [number, number, number] | null {
  const raw = el?.getAttribute('data-tint');
  if (!raw) return null;
  const parts = raw.split(',').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return [parts[0]!, parts[1]!, parts[2]!];
}

export function startMarble(canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  if (!prog) return;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, 'u_res'),
    phase: gl.getUniformLocation(prog, 'u_phase'),
    attract: gl.getUniformLocation(prog, 'u_attract'),
    energy: gl.getUniformLocation(prog, 'u_energy'),
    tint: gl.getUniformLocation(prog, 'u_tint'),
    tintAmt: gl.getUniformLocation(prog, 'u_tintAmt'),
    hue: gl.getUniformLocation(prog, 'u_hue'),
    unit: gl.getUniformLocation(prog, 'u_unit'),
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  // The slab is soft, so render below device resolution; the grain still reads.
  let scale = 1;
  // Pattern scale in canvas pixels, derived from width alone: about the full width
  // on phones, easing to width / 1.6 on wide screens so desktop veins stay generous.
  let unit = 1;
  let sizedW = 0;
  let sizedH = 0;
  // The canvas is sized to the large viewport in CSS, so scrolling never resizes it;
  // only repaint at a new size when the element's box really changed (rotation, window resize).
  const resize = (): boolean => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === sizedW && h === sizedH) return false;
    sizedW = w;
    sizedH = h;
    scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const wide = Math.min(Math.max((w - 480) / (1000 - 480), 0), 1);
    unit = canvas.width / (1 + 0.6 * wide);
    gl.viewport(0, 0, canvas.width, canvas.height);
    return true;
  };
  resize();

  const s: State = {
    energy: 0,
    target: 0,
    phase: Math.random() * 50,
    hueClock: 0,
    attract: [canvas.width * 0.3, canvas.height * 0.6],
    attractGoal: [canvas.width * 0.3, canvas.height * 0.6],
    tint: [0.4, 0.8, 0.6],
    tintAmt: 0,
    tintGoal: 0,
  };

  // Map a client-space point into the canvas's top-left-anchored pixel space.
  const toCanvas = (x: number, y: number): [number, number] => {
    const rect = canvas.getBoundingClientRect();
    return [(x - rect.left) * scale, (y - rect.top) * scale];
  };

  const energetic = () => Array.from(document.querySelectorAll<HTMLElement>('[data-energy]'));

  const nearest = (x: number, y: number) => {
    let best: HTMLElement | null = null;
    let bestD = Infinity;
    for (const el of energetic()) {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const dist = Math.hypot(dx, dy);
      if (dist < bestD) {
        bestD = dist;
        best = el;
      }
    }
    return { el: best, dist: bestD };
  };

  const onPointer = (e: PointerEvent) => {
    // Touch has no hover: a finger dragging to scroll shouldn't stir or tint the stone.
    if (e.pointerType === 'touch') return;
    const { el, dist } = nearest(e.clientX, e.clientY);
    // Within ~200px the slab starts to stir; touching the element is full energy.
    s.target = Math.max(0, 1 - dist / 200);
    s.attractGoal = toCanvas(e.clientX, e.clientY);
    const tint = parseTint(el);
    if (tint && dist < 40) {
      s.tint = tint;
      s.tintGoal = 1;
    } else {
      s.tintGoal = 0;
    }
    if (reduced.matches) draw();
  };

  const onLeave = () => {
    s.target = 0;
    s.tintGoal = 0;
  };

  const onFocus = (e: FocusEvent) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-energy]');
    // Only keyboard focus wakes the stone; a tap that focuses a link should not.
    if (!el || !el.matches(':focus-visible')) return;
    const r = el.getBoundingClientRect();
    s.attractGoal = toCanvas(r.left + Math.min(r.width, 320) / 2, r.top + r.height / 2);
    s.target = 1;
    const tint = parseTint(el);
    if (tint) {
      s.tint = tint;
      s.tintGoal = 1;
    }
    if (reduced.matches) draw();
  };

  const onBlur = () => {
    s.target = 0;
    s.tintGoal = 0;
  };

  const draw = () => {
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.unit, unit);
    gl.uniform1f(u.phase, s.phase);
    gl.uniform2f(u.attract, s.attract[0], s.attract[1]);
    gl.uniform1f(u.energy, s.energy);
    gl.uniform3f(u.tint, s.tint[0], s.tint[1], s.tint[2]);
    gl.uniform1f(u.tintAmt, s.tintAmt);
    // Green to blue and back, once a minute, on wall-clock time so interaction never rushes it.
    gl.uniform1f(u.hue, 0.5 - 0.5 * Math.cos((2 * Math.PI * s.hueClock) / HUE_PERIOD_S));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let last = performance.now();
  let raf = 0;
  const frame = (now: number) => {
    const elapsed = (now - last) / 1000;
    last = now;
    // Clamp the physics step, but let the hue cycle track real time even on slow devices.
    const dt = Math.min(elapsed, 0.05);
    s.hueClock += Math.min(elapsed, 1);
    // Energy rises quickly and settles slowly, so the slab exhales after you leave.
    const rate = s.target > s.energy ? 6 : 1.4;
    s.energy += (s.target - s.energy) * (1 - Math.exp(-rate * dt));
    s.tintAmt += (s.tintGoal - s.tintAmt) * (1 - Math.exp(-3 * dt));
    const follow = 1 - Math.exp(-4 * dt);
    s.attract[0] += (s.attractGoal[0] - s.attract[0]) * follow;
    s.attract[1] += (s.attractGoal[1] - s.attract[1]) * follow;
    // Calm drift, accelerating with energy.
    s.phase += dt * (0.035 + s.energy * s.energy * 0.45);
    draw();
    raf = requestAnimationFrame(frame);
  };

  const run = () => {
    cancelAnimationFrame(raf);
    if (reduced.matches || document.hidden) {
      // Snap to the resting state and paint one still frame.
      s.energy = s.target;
      s.tintAmt = s.tintGoal;
      s.attract = [...s.attractGoal];
      draw();
      return;
    }
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  window.addEventListener('resize', () => {
    if (resize()) draw();
  });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  document.addEventListener('focusin', onFocus);
  document.addEventListener('focusout', onBlur);
  document.addEventListener('visibilitychange', run);
  reduced.addEventListener('change', run);

  canvas.dataset['ready'] = 'true';
  run();
}
