# Set Editing Constraints - Server-JS Guide Example

This example demonstrates how to use CE.SDK's Scope system to control editing capabilities in templates using Node.js/server environments.

## Features Demonstrated

- **Block-Level Scopes**: Setting per-block editing constraints programmatically
- **Global Scopes**: Setting default behavior for all blocks in headless mode
- **Common Patterns**: Lock position, prevent deletion, enable/disable all scopes
- **Scope Queries**: Checking which scopes are enabled on blocks
- **Scene Persistence**: Saving constrained scenes for client-side use
- **Server Export**: Exporting results as PNG and scene files

## Quick Start

```bash
# Install dependencies
npm install

# Run the example
npm run dev

# Build and check quality
npm run qa
```

## Code Quality

```bash
# Check syntax, formatting, and linting
npm run check:all

# Fix formatting and linting issues
npm run fix:all
```

## Examples Included

1. **Fully Editable** - All scopes explicitly enabled for complete editing freedom
2. **Locked Position** - Cannot move, but can resize, rotate, and delete
3. **Cannot Delete** - Protected from deletion/duplication, but can move/resize
4. **Fully Locked** - All scopes disabled, completely locked for watermarks/logos

## Output Files

Running the example creates:
- `output/constrained-scene.scene` - Scene file with all scope constraints preserved
- `output/editing-constraints-result.png` - Visual result showing all 4 examples

## Documentation

See the full guide in the CE.SDK documentation:
`/docs/cesdk/guides/create-templates/add-dynamic-content/set-editing-constraints`
