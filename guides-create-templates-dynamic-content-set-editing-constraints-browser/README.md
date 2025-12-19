# Set Editing Constraints - Browser Guide Example

This example demonstrates how to use CE.SDK's Scope system to control editing capabilities in templates.

## Features Demonstrated

- **Block-Level Scopes**: Setting per-block editing constraints
- **Global Scopes**: Setting default behavior for all blocks
- **Common Patterns**: Lock position, lock size, text-only editing
- **Scope Queries**: Checking which scopes are enabled
- **All Available Scopes**: Text editing, fills, transformations, lifecycle, appearance

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Capture hero images
npm run capture:hero_image
```

## Code Quality

```bash
# Check syntax, formatting, and linting
npm run check:all

# Fix formatting and linting issues
npm run fix:all
```

## Examples Included

1. **Fully Editable** - Default behavior with all scopes enabled
2. **Locked Position** - Cannot move, but can resize and rotate
3. **Locked Layout** - Fixed position and size, can still rotate
4. **No Transform** - Cannot move, resize, or rotate, but can change colors
5. **Text-Only Editing** - Container locked, but text content editable
6. **Cannot Delete** - Block protected from deletion
7. **Query Scopes** - Demonstrates checking scope states
8. **Global Scope** - Shows global scope effect on all blocks

## Documentation

See the full guide in the CE.SDK documentation:
`/docs/cesdk/guides/create-templates/add-dynamic-content/set-editing-constraints`
