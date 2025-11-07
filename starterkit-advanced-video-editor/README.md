# Advanced Video Editor Starter Kit

This starter kit demonstrates how to integrate and customize the CE.SDK Advanced Video Editor for your web application. The Advanced Video Editor offers two integration approaches: you can import the turnkey configuration directly from NPM for immediate use, or download the starter kit to customize the configuration to match your specific requirements.

## Getting Started

The Advanced Video Editor offers two integration approaches. You can import the turnkey configuration directly from NPM for immediate use, or download the starter kit to customize the configuration to match your specific requirements.

### Clone the repository

```bash
git clone https://github.com/imgly/cesdk-web-examples.git
```

Or using GitHub CLI:

```bash
gh repo clone imgly/cesdk-web-examples
```

### Install dependencies and run the Advanced Video Editor development server

Using npm:

```bash
npm install
npm run dev
```

Using pnpm:

```bash
pnpm install
pnpm run dev
```

Using yarn:

```bash
yarn install
yarn dev
```

## Starter Kit Architecture

The Advanced Video Editor starter kit is organized around configuration files that control different aspects of the editor. Each file manages a specific area—from enabling features to customizing UI layout and engine behavior.

```
starterkit-advanced-video-editor/
  └── src/
      ├── index.ts        # Main integration example
      └── imgly/
          ├── plugin.ts       # Main plugin orchestration
          ├── features.ts     # Feature toggles
          ├── settings.ts     # Engine behavior
          ├── i18n.ts         # Internationalization
          └── ui/             # UI configuration
              ├── actions.ts        # Actions (Load, Save, Export)
              ├── navigationBar.ts  # Navigation bar buttons
              ├── inspectorBar.ts   # Inspector bar controls
              ├── panel.ts          # Panel positions
              ├── dock.ts           # Asset library entries
              ├── canvas.ts         # Canvas bar and menus
              ├── components.ts     # Component customization
              └── index.ts          # UI exports
```

### Configuration Files

- **plugin.ts** - Main plugin orchestration that brings together all configuration
- **features.ts** - Feature toggles to enable/disable editing capabilities
- **settings.ts** - Engine behavior and appearance configuration
- **i18n.ts** - Translations and localization
- **ui/actions.ts** - Custom actions for Load, Save, and Export functionality
- **ui/navigationBar.ts** - Navigation bar button order and configuration
- **ui/inspectorBar.ts** - Inspector bar controls for different edit modes
- **ui/panel.ts** - Panel positions in the editor layout
- **ui/dock.ts** - Asset library dock configuration
- **ui/canvas.ts** - Canvas bar buttons and context menus
- **ui/components.ts** - UI component customization

## Learn More

For complete documentation on integration, customization, and advanced features, visit the [Advanced Video Editor documentation](https://img.ly/docs/cesdk/web/prebuilt-solutions/advanced-video-editor+6b9d4f/).
