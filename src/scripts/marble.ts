// A living marble slab: domain-warped fbm veins over a granite speckle.
// It drifts calmly, and its warp and speed ramp up around whichever
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
  vec2 frag = gl_FragCoord.xy;
  float scale = min(u_res.x, u_res.y);
  vec2 p = frag / scale;
  vec2 at = u_attract / scale;

  // Local influence of the attractor: a soft pool around the hovered thing.
  float d = distance(p, at);
  float pool = exp(-d * d / 0.09) * u_energy;

  // Swirl the domain around the attractor.
  vec2 rel = p - at;
  float ang = pool * 1.6;
  rel = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * rel;
  p = at + rel;

  float t = u_phase;
  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)), fbm(p * 1.4 + vec2(5.2, 1.3 - t)));
  float warp = 2.2 + pool * 2.4;
  vec2 r = vec2(
    fbm(p * 1.4 + warp * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p * 1.4 + warp * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float f = fbm(p * 1.4 + warp * r);

  // Ground: mottled stone with obsidian pockets, easing between emerald and sapphire.
  vec3 deep = mix(vec3(0.008, 0.105, 0.058), vec3(0.008, 0.050, 0.130), u_hue);
  vec3 emerald = mix(vec3(0.015, 0.300, 0.160), vec3(0.020, 0.140, 0.380), u_hue);
  vec3 obsidian = vec3(0.010, 0.014, 0.013);
  vec3 col = mix(deep, emerald, smoothstep(0.30, 0.80, f));
  col = mix(col, deep * 0.6, smoothstep(0.55, 0.85, r.y) * 0.6);
  col = mix(col, obsidian, smoothstep(0.58, 0.95, length(q)) * 0.92);

  // Marble veins: a broad milky band and a fine sharp seam, both following the
  // warped field, with widths that swell and pinch along their length.
  float band = f * 7.0 + r.x * 3.0;
  float swell = 0.25 + 0.75 * fbm(p * 3.1 + 4.0 + 0.05 * t);
  float broad = 1.0 - smoothstep(0.0, 0.22 * swell, abs(fract(band) - 0.5));
  float fine = 1.0 - smoothstep(0.0, 0.035 * swell, abs(fract(band * 1.7 + q.y) - 0.5));
  vec3 milkBase = mix(vec3(0.16, 0.40, 0.29), vec3(0.17, 0.30, 0.52), u_hue);
  vec3 milk = mix(milkBase, u_tint * 0.6, u_tintAmt * (0.3 + pool));
  vec3 seamBase = mix(vec3(0.30, 0.56, 0.44), vec3(0.32, 0.48, 0.72), u_hue);
  vec3 seamCol = mix(seamBase, u_tint * 0.85, u_tintAmt * (0.35 + pool));
  col = mix(col, milk, broad * 0.5 * (0.6 + 0.4 * swell));
  col = mix(col, seamCol, fine * (0.6 + pool * 0.4) * swell);

  // Granite: fine grain plus irregular light and dark flecks, fixed to the slab.
  col += (hash(frag) - 0.5) * 0.03;
  float light = smoothstep(0.80, 0.86, noise(frag * 0.55 + 31.0)) * step(0.5, hash(floor(frag * 0.2)));
  float dark = smoothstep(0.78, 0.84, noise(frag * 0.45 + 7.0));
  col = mix(col, vec3(0.62, 0.72, 0.66), light * 0.4);
  col = mix(col, vec3(0.0, 0.03, 0.02), dark * 0.55);

  // Gentle vignette keeps type legible toward the edges.
  vec2 uv = frag / u_res;
  col *= 0.82 + 0.18 * smoothstep(1.1, 0.2, length(uv - vec2(0.45, 0.55)));

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
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  // The slab is soft, so render below device resolution; the grain still reads.
  let scale = 1;
  const resize = () => {
    scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
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

  // Map a client-space point into the canvas's flipped-y pixel space.
  const toCanvas = (x: number, y: number): [number, number] => {
    const rect = canvas.getBoundingClientRect();
    return [(x - rect.left) * scale, (rect.height - (y - rect.top)) * scale];
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
    if (!el) return;
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
    resize();
    draw();
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
