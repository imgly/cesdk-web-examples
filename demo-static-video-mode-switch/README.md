# Static / Video Mode Switch Demo

Swap a running CE.SDK editor between a Static (design) and a Video configuration
without remounting. The same editor instance and scene stay loaded — only the
feature set, UI orders, and relevant engine settings are reconfigured.

Since CE.SDK v1.72 scenes no longer have a mode, and all engine features work
on every scene regardless of how it was created. This demo shows how a host
application can adapt the editor UI to the task at hand at runtime.

## Getting Started

### Clone the Repository

This demo lives in the [CE.SDK web examples](https://github.com/imgly/cesdk-web-examples) repository. Clone it and change into the demo folder, or open the demo directly on [StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/main/demo-static-video-mode-switch).

```bash
git clone https://github.com/imgly/cesdk-web-examples.git
cd cesdk-web-examples/demo-static-video-mode-switch
```

### Install Dependencies

```bash
npm install
```

### Download Assets

CE.SDK requires engine assets (fonts, icons, UI elements) served from your
`public/` directory.

```bash
curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/imgly-assets.zip
unzip imgly-assets.zip -d public/
rm imgly-assets.zip
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## How It Works

- `src/imgly/index.ts` exposes `applyMode(cesdk, mode)`. On each switch it
  calls `cesdk.resetEditor()` and installs either `DesignEditorConfig` or
  `VideoEditorConfig` on the same editor instance, alongside the asset
  sources relevant to that mode.
- `src/imgly/config/<mode>/` bundles the feature set, UI orders, actions,
  i18n, and engine settings for that mode.
- The scene and engine state are preserved across switches — only the
  configuration plugin is swapped.

### Per-mode engine settings

A scene authored for Video hides content in two independent ways when it
is rendered at playback time `0`: elements animate in, so at `t=0` they sit
at the start of their in-animation (off-page or fully transparent), and
clips placed later on the timeline are culled entirely.

Rather than mutate the scene, the demo pairs the two render-time engine
settings that switch each behaviour off, and flips them on each mode
change:

| Setting                   | Static  | Video   | Effect                                                                                                       |
| ------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `blockAnimations/enabled` | `false` | `true`  | Render blocks at their base transform instead of at the start of their in-animation.                         |
| `playback/showAllBlocks`  | `true`  | `false` | Keep every block visible regardless of the playhead, instead of culling it outside its time offset/duration. |

For the scene bundled with this demo, `blockAnimations/enabled` is the one
doing the visible work: every element starts at `timeOffset 0` and runs for
the full page duration, so nothing is ever culled and toggling
`playback/showAllBlocks` changes nothing on screen. It is set anyway
because the two belong together — a scene whose clips _are_ staggered
across the timeline needs it, and Static should present any video scene in
full, not just this one. The same pairing is used by the built-in design
and viewer editor configurations.

Both settings are display-only. The scene is never touched, so switching
back to Video restores the timeline exactly as authored, and neither
setting affects export.

`playback/showAllBlocks` requires CE.SDK v1.76.0 or later. See
`config/design/settings.ts` and `config/video/settings.ts`.

## Architecture

```
src/
├── app/
│   └── App.tsx                  # Editor host; owns the current mode
├── imgly/
│   ├── config/
│   │   ├── design/              # Static (design) configuration
│   │   └── video/               # Video configuration
│   ├── modeSwitch.ts            # Segmented control in the navigation bar
│   └── index.ts                 # Editor initialization + applyMode
└── index.tsx                    # Application entry point
```

## Prerequisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=demo-static-video-mode-switch">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=demo-static-video-mode-switch">IMG.LY</a></p>
