# Player Starter Kit

This starter kit demonstrates how to integrate and customize the CE.SDK Player for your web application. The Player offers two integration approaches: you can import the turnkey configuration directly from NPM for immediate use, or download the starter kit to customize the configuration to match your specific requirements.

## Getting Started

The Player offers two integration approaches. You can import the turnkey configuration directly from NPM for immediate use, or download the starter kit to customize the configuration to match your specific requirements.

### Clone the repository

```bash
git clone https://github.com/imgly/cesdk-web-examples.git
```

Or using GitHub CLI:

```bash
gh repo clone imgly/cesdk-web-examples
```

### Install dependencies and run the Player development server

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

The Player starter kit is organized around a simple configuration file that controls the player behavior.

```
starterkit-player-editor/
  └── src/
      ├── index.ts    # Main integration example
      └── imgly/
          └── plugin.ts   # Main plugin configuration
```

### Configuration Files

- **plugin.ts** - Main plugin configuration that sets up the player

## Learn More

For complete documentation on integration, customization, and advanced features, visit the [Player documentation](https://img.ly/docs/cesdk/web/prebuilt-solutions/player+4c6b1d/).
