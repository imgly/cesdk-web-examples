# CE.SDK Guide: Panel Customization (Browser)

This example demonstrates how to use CE.SDK's Panel API to customize the user interface panels.

## Features Demonstrated

- **Opening and Closing Panels**: Programmatically show and hide panels
- **Panel Positioning**: Position panels on the left or right side of the canvas
- **Floating Panels**: Make panels float over the canvas or dock beside it
- **Panel State Checking**: Check if panels are open before performing actions
- **Finding Panels**: Discover all available panels and filter by criteria
- **Panel Payloads**: Pass data to panels (like asset library entries)
- **Responsive Panel Layouts**: Adjust panel behavior based on viewport size

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run check:syntax
```

### Linting

```bash
npm run check:lint
```

## Code Structure

- **`index.ts`** - Minimal CE.SDK initialization
- **`browser.ts`** - Main plugin with panel customization examples
- **`utils.ts`** - Grid layout utilities

## Key Concepts

### Panel IDs

CE.SDK provides several built-in panels:

- `//ly.img.panel/inspector` - Block inspector panel
- `//ly.img.panel/assetLibrary` - Main asset library
- `//ly.img.panel/assetLibrary.replace` - Replacement asset library
- `//ly.img.panel/settings` - Settings panel

### Panel API Methods

- `cesdk.ui.openPanel(panelId, options?)` - Open a panel
- `cesdk.ui.closePanel(panelId)` - Close panels (supports wildcards)
- `cesdk.ui.isPanelOpen(panelId, criteria?)` - Check if panel is open
- `cesdk.ui.findAllPanels(criteria?)` - Find panels by criteria
- `cesdk.ui.setPanelPosition(panelId, position)` - Set default position
- `cesdk.ui.setPanelFloating(panelId, floating)` - Set floating behavior
- `cesdk.ui.getPanelPosition(panelId)` - Get panel position
- `cesdk.ui.getPanelFloating(panelId)` - Get floating state

## Learn More

- [CE.SDK Documentation](https://img.ly/docs/cesdk/)
- [Panel Customization Guide](https://img.ly/docs/cesdk/guides/user-interface/customization/panel/)
- [Feature API](https://img.ly/docs/cesdk/api/feature/)

## License

This example is part of the CE.SDK examples collection.
