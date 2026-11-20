# Hide Elements - Browser Guide

This example demonstrates how to hide and show UI elements in CE.SDK for the browser.

## Getting Started

```bash
npm install
npm run dev
```

Open your browser to the URL shown in the terminal (usually http://localhost:5173).

## What This Example Shows

- Hiding elements with `cesdk.features`
- Hiding the navigation bar and individual buttons
- Hiding canvas elements (bar and menu)
- Hiding inspector elements
- Hiding panels and the dock
- Using ordering APIs to hide components
- Managing panel visibility dynamically
- Creating a minimal UI (canvas-only view)
- Using glob patterns to close several panels at once
- Dynamic visibility control based on context

## Key Concepts

- **`cesdk.features`** - Primary method for switching UI features on and off
- **Ordering APIs** - Control what appears in ordered component lists
- **Panel Management** - Control panel open/closed state
- **Glob Patterns** - Use wildcards to match several panel IDs

## Related Guides

- [UI Overview](/docs/guides/user-interface/overview)
- [Disable or Enable Features](/docs/guides/user-interface/customization/disable-or-enable)
- [Customize Dock](/docs/guides/user-interface/customization/dock)
- [Customize Panels](/docs/guides/user-interface/customization/panel)
