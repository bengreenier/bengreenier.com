// Stacked sheets: each [data-stack] element draws a stepped stack of offset
// sheets behind itself (see .sheets in global.css). The stack fans out as a fine
// pointer comes near, or while keyboard focus is inside it, and settles back after.

interface StackState {
  energy: number;
  target: number;
}

const REACH_PX = 220;

export function startSheets(): void {
  const stacks = Array.from(document.querySelectorAll<HTMLElement>('[data-stack]'));
  if (stacks.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const state = new Map<HTMLElement, StackState>(stacks.map((el) => [el, { energy: 0, target: 0 }]));

  let px = -1e4;
  let py = -1e4;
  let raf = 0;

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const tick = () => {
    raf = 0;
    let moving = false;
    for (const [el, s] of state) {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - px, 0, px - r.right);
      const dy = Math.max(r.top - py, 0, py - r.bottom);
      const near = fine.matches ? Math.max(0, 1 - Math.hypot(dx, dy) / REACH_PX) : 0;
      const focused = el.querySelector(':focus-visible') || el.matches(':focus-visible') ? 1 : 0;
      s.target = Math.max(near, focused);
      // Reduced motion: jump straight to the new state instead of animating.
      s.energy = reduced.matches ? s.target : s.energy + (s.target - s.energy) * 0.18;
      if (Math.abs(s.target - s.energy) < 0.002) s.energy = s.target;
      else moving = true;
      el.style.setProperty('--energy', s.energy.toFixed(3));
    }
    if (moving) schedule();
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      // Touch has no hover: a finger dragging to scroll shouldn't fan the stacks.
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      schedule();
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => {
    px = -1e4;
    py = -1e4;
    schedule();
  });
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', () => requestAnimationFrame(schedule));
  window.addEventListener('scroll', schedule, { passive: true });
}
