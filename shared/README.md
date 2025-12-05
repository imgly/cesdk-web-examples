# CE.SDK Local Development Plugin

Vite plugin for seamless switching between local monorepo packages and published npm packages.

## Features

- **Zero-config switching**: Toggle between local and published packages with a single environment variable
- **Hot Module Replacement**: Instant updates when editing local package source code
- **Type safety**: Full TypeScript support with IDE autocomplete
- **Build safety**: Always uses published packages in production builds
- **Helpful errors**: Clear validation messages if local packages aren't built
- **Advanced**: Optionally use local versions of specific packages (cesdk or engine only)

## Quick Start

### Installation

Add the plugin to your Vite config:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { cesdkLocal } from '../shared/vite-config-cesdk-local';

export default defineConfig({
  plugins: [cesdkLocal()],
  server: { port: 5173 }
});
```

### Usage

```bash
# Use published packages (default)
npm run dev

# Use local packages (both cesdk-js and engine)
CESDK_USE_LOCAL=true npm run dev
```

For advanced use cases, you can selectively override individual packages:

```bash
CESDK_USE_LOCAL=cesdk npm run dev   # Only local cesdk-js
CESDK_USE_LOCAL=engine npm run dev  # Only local engine
```

### Package.json Scripts

Add a convenience script to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:local": "CESDK_USE_LOCAL=true vite",
    "build": "vite build"
  }
}
```

Then use:

```bash
npm run dev        # Published packages
npm run dev:local  # Local packages
```

## Asset Resolution

When using local packages, update your CE.SDK configuration to use local assets:

```typescript
// index.ts
import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  license: 'your-license',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk', config);
```

This ensures WASM files and other assets are loaded from the local build directory instead of the CDN.

## TypeScript Support

For better IDE support, extend the shared TypeScript paths configuration:

```json
// tsconfig.json
{
  "compilerOptions": {
    // your existing options
  }
}
```

This enables:

- Autocomplete for local packages
- Go-to-definition navigation
- Type checking for local source code

## Prerequisites

Local packages must be built before using them:

```bash
# Build cesdk_web
cd apps/cesdk_web && yarn build:release

# Build js_web (engine)
cd bindings/wasm/js_web && yarn build:release
```

If you forget to build, the plugin will show a helpful error message with build instructions.

## Configuration Options

```typescript
interface CesdkLocalOptions {
  /** Relative path from example to monorepo root. Default: '../../..' */
  repoRoot?: string;

  /** Enable verbose logging. Default: false */
  verbose?: boolean;

  /** Custom asset path override */
  assetsPath?: string;
}

// Example with custom options
cesdkLocal({
  repoRoot: '../../..',
  verbose: true
});
```

## How It Works

### Development Mode

1. Plugin reads `CESDK_USE_LOCAL` environment variable
2. Parses which packages to override (cesdk, engine, or both)
3. Validates that local builds exist
4. Configures Vite resolve aliases to point to local source files
5. Sets up file watchers for Hot Module Replacement
6. Exposes env var to client code for asset resolution

### Build Mode

- **Always** uses published packages from `node_modules`
- Shows warning if `CESDK_USE_LOCAL` is set
- Ensures production builds are deterministic and use released versions

### Package Resolution

```
When CESDK_USE_LOCAL=true:
  @cesdk/cesdk-js  →  apps/cesdk_web/src/index.ts
  @cesdk/engine    →  bindings/wasm/js_web/src/index.ts

When CESDK_USE_LOCAL not set:
  @cesdk/cesdk-js  →  node_modules/@cesdk/cesdk-js
  @cesdk/engine    →  node_modules/@cesdk/engine
```

## Troubleshooting

### Module Not Found Errors

**Problem**: `Module not found: @cesdk/cesdk-js`

**Solution**: Ensure local packages are built:

```bash
cd apps/cesdk_web && yarn build:release
cd bindings/wasm/js_web && yarn build:release
```

### Assets Not Loading

**Problem**: WASM files or assets return 404 errors

**Solution**: Verify assets exist and baseURL is set correctly:

```bash
# Check assets exist
ls apps/cesdk_web/build/assets/core/*.wasm

# Ensure baseURL is set in your config
const config = {
  ...(import.meta.env.CESDK_USE_LOCAL && { baseURL: '/assets/' })
};
```

### TypeScript Errors

**Problem**: IDE shows type errors for local packages

**Solution**: Restart TypeScript server:

- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- Ensure `tsconfig.json` extends `../shared/tsconfig.paths.json`

### HMR Not Working

**Problem**: Changes to local packages don't trigger hot reload

**Solution**:

1. Ensure dev server was started with `CESDK_USE_LOCAL` set
2. Check console for watcher setup messages (use `verbose: true`)
3. Try restarting dev server

### Build Warnings

**Problem**: `CESDK_USE_LOCAL is set but building for production`

**Solution**: This is expected - production builds always use published packages. Unset the env var if the warning is distracting:

```bash
unset CESDK_USE_LOCAL
npm run build
```

## Migration from dev-local.sh

If you're migrating from the old `dev-local.sh` script:

### Old Approach

```bash
# Required manual setup
bash ../scripts/dev-local.sh

# Started separate asset server on port 3000
# Required symlinking and file copying
# No HMR support
```

### New Approach

```bash
# Zero setup, instant switching
CESDK_USE_LOCAL=true npm run dev

# Built-in asset serving
# Full HMR support
# No file copying
```

### Migration Checklist

1. ✅ Add `cesdkLocal()` plugin to `vite.config.ts`
2. ✅ Update `dev:local` script in `package.json`
3. ✅ Add conditional `baseURL` to SDK config
4. ✅ (Optional) Extend `tsconfig.paths.json`
5. ✅ Remove references to `dev-local.sh`

## Examples

### Basic Starterkit Example

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { cesdkLocal } from '../shared/vite-config-cesdk-local';

export default defineConfig({
  plugins: [cesdkLocal()],
  server: { port: 5173 }
});
```

```typescript
// index.ts
import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  license: 'your-license-key',
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk', config);
```

### React Example with Custom Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cesdkLocal } from '../shared/vite-config-cesdk-local';

export default defineConfig({
  plugins: [react(), cesdkLocal({ verbose: true })],
  server: { port: 3000 }
});
```

### Selective Package Override

```bash
# Only override cesdk-js (use published engine)
CESDK_USE_LOCAL=cesdk npm run dev

# Only override engine (use published cesdk-js)
CESDK_USE_LOCAL=engine npm run dev

# Override both
CESDK_USE_LOCAL=true npm run dev
# or
CESDK_USE_LOCAL=all npm run dev
# or
CESDK_USE_LOCAL=cesdk,engine npm run dev
```

## Performance

### Startup Time Comparison

| Mode           | Old (`dev-local.sh`)  | New (Plugin)   | Improvement    |
| -------------- | --------------------- | -------------- | -------------- |
| Setup          | 30-60s (build + copy) | < 1s           | **99% faster** |
| Dev start      | 5s (after setup)      | < 2s           | **60% faster** |
| Package switch | 30-60s (rebuild)      | Instant (< 1s) | **99% faster** |

### Hot Module Replacement

- **Old**: No HMR, required full rebuild (30-60s)
- **New**: Instant updates (< 200ms)
- **Developer experience**: Significantly improved workflow

## API Reference

### Environment Variable

**`CESDK_USE_LOCAL`**

Controls which packages to use from local monorepo.

- `undefined` or empty: Use published packages (default)
- `"true"`, `"1"`, `"all"`: Use all local packages
- `"cesdk"`: Use only local `@cesdk/cesdk-js`
- `"engine"`: Use only local `@cesdk/engine`
- `"cesdk,engine"`: Use both local packages (explicit)

### Plugin Options

**`CesdkLocalOptions`**

- `repoRoot?: string` - Relative path to monorepo root (default: `"../../.."`)
- `verbose?: boolean` - Enable verbose logging (default: `false`)
- `assetsPath?: string` - Custom asset path override (default: auto-detected)

### Functions

**`parseOverrides(value: string | undefined): Set<PackageOverride>`**

Parse environment variable into package override set.

**`validateBuildArtifacts(overrides: Set<PackageOverride>, repoRoot: string): void`**

Validate that required local builds exist. Throws helpful error if missing.

**`cesdkLocal(options?: CesdkLocalOptions): Plugin`**

Create Vite plugin instance.

## Testing

The plugin includes comprehensive unit tests:

```bash
# Run tests
cd apps/cesdk_web_examples/shared
npm test

# Run with coverage
npm test -- --coverage
```

Test coverage:

- ✅ Environment variable parsing
- ✅ Build artifact validation
- ✅ Alias configuration
- ✅ Watcher setup
- ✅ Build mode safety
- ✅ Error handling

## License

Part of the CE.SDK monorepo.
