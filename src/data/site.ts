/** An RGB triple in 0..1, fed straight to the marble shader as a vein tint. */
export type Tint = readonly [number, number, number];

export interface Project {
  name: string;
  url: string;
  blurb: string;
  stack: readonly string[];
  tint: Tint;
}

export interface Link {
  label: string;
  url: string;
}

export const person = {
  name: 'Ben Greenier',
  role: 'Senior Software Engineer at Gather',
  description:
    'Ben Greenier is a senior software engineer at Gather who builds real-time media tools, native bindings in Rust and C++, and the odd city-builder mod.',
};

export const links: readonly Link[] = [
  { label: 'GitHub', url: 'https://github.com/bengreenier' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/pub/ben-greenier/5a/2b5/1a7' },
  { label: 'X', url: 'https://x.com/bengreenier' },
];

const ts: Tint = [0.42, 0.36, 1.0];
const rust: Tint = [1.0, 0.45, 0.2];
const mods: Tint = [0.62, 1.0, 0.3];

export const projects: readonly Project[] = [
  {
    name: 'sobx',
    url: 'https://github.com/bengreenier/sobx',
    blurb:
      'MobX-compatible observables, compiled ahead of time. Ships plugins for Vite, Rollup, webpack, esbuild, Rolldown and Rspack. Still in alpha.',
    stack: ['TypeScript', 'Compiler'],
    tint: ts,
  },
  {
    name: 'react-user-media',
    url: 'https://github.com/bengreenier/react-user-media',
    blurb: 'React hooks and components for getUserMedia and getDisplayMedia.',
    stack: ['TypeScript', 'React'],
    tint: ts,
  },
  {
    name: 'trpc-webrtc',
    url: 'https://github.com/bengreenier/trpc-webrtc',
    blurb: 'tRPC adapters that turn any RTCDataChannel into a type-safe, in-browser tRPC server, with queries, mutations and subscriptions.',
    stack: ['TypeScript', 'WebRTC'],
    tint: ts,
  },
  {
    name: 'napi-audio',
    url: 'https://github.com/bengreenier/napi-audio',
    blurb: 'A native audio stack for NAPI-compatible JS runtimes. It decodes audio to PCM and supports streams.',
    stack: ['Rust', 'Node-API'],
    tint: rust,
  },
  {
    name: 'partially',
    url: 'https://github.com/bengreenier/partially',
    blurb: 'A derive macro that mirrors your struct with every field wrapped in Option, then applies it back.',
    stack: ['Rust', 'Macros'],
    tint: rust,
  },
  {
    name: 'win_event_hook',
    url: 'https://github.com/bengreenier/win_event_hook',
    blurb: 'A safe Rust API over Win32 SetWinEventHook, built on the windows crate.',
    stack: ['Rust', 'Win32'],
    tint: rust,
  },
  {
    name: 'csii-mods',
    url: 'https://github.com/bengreenier/csii-mods',
    blurb: 'Mods for Cities Skylines II, starting with BetterAssetMenu.',
    stack: ['C#', 'TypeScript', 'Game mod'],
    tint: mods,
  },
  {
    name: 'vscode-node-readme',
    url: 'https://github.com/bengreenier/vscode-node-readme',
    blurb: 'Read a JavaScript module’s docs without leaving VS Code. It has 40k+ installs.',
    stack: ['TypeScript', 'VS Code'],
    tint: ts,
  },
];
