# Design Editor Starter Kit

This starter kit demonstrates how to integrate and customize the CE.SDK Design Editor for your web application. The Design Editor offers two integration approaches: you can import the turnkey configuration directly from NPM for immediate use, or download the starter kit to customize the configuration to match your specific requirements.

## Getting Started

The Design Editor offers two integration approaches. You can import the turnkey configuration directly from NPM for immediate use, or download the starter kit to customize the configuration to match your specific requirements.

### Clone the repository

```bash
git clone https://github.com/imgly/cesdk-web-examples.git
```

Or using GitHub CLI:

```bash
gh repo clone imgly/cesdk-web-examples
```

### Install dependencies and run the Design Editor development server

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

The Design Editor starter kit is organized around configuration files that control different aspects of the editor. Each file manages a specific area—from enabling features to customizing UI layout and engine behavior.

```
starterkit-design-editor/
  └── src/
      ├── index.ts        # Main integration example
      └── imgly/
          ├── plugin.ts       # Main plugin orchestration
          ├── actions.ts      # Actions (Load, Save, Export)
          ├── features.ts     # Feature toggles
          ├── settings.ts     # Engine behavior
          ├── i18n.ts         # Internationalization
          └── ui/             # UI configuration
              ├── canvas.ts         # Canvas bar and menus
              ├── components.ts     # Component customization
              ├── dock.ts           # Asset library entries
              ├── inspectorBar.ts   # Inspector bar controls
              ├── navigationBar.ts  # Navigation bar buttons
              ├── panel.ts          # Panel positions
              └── index.ts          # UI exports
```

### Configuration Files

- **plugin.ts** - Main plugin orchestration that brings together all configuration
- **actions.ts** - Custom actions for Load, Save, and Export functionality
- **features.ts** - Feature toggles to enable/disable editing capabilities
- **settings.ts** - Engine behavior and appearance configuration
- **i18n.ts** - Translations and localization
- **ui/canvas.ts** - Canvas bar buttons and context menus
- **ui/components.ts** - UI component customization
- **ui/dock.ts** - Asset library dock configuration
- **ui/inspectorBar.ts** - Inspector bar controls for different edit modes
- **ui/navigationBar.ts** - Navigation bar button order and configuration
- **ui/panel.ts** - Panel positions in the editor layout

## Learn More

For complete documentation on integration, customization, and advanced features, visit the [Design Editor documentation](https://img.ly/docs/cesdk/web/prebuilt-solutions/design-editor+9bf041/).
