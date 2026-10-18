# Text Variables - CE.SDK Guide

This example demonstrates text variable management in CE.SDK for Web. Text variables enable data-driven template personalization by allowing you to insert placeholder tokens like `{{variableName}}` that get replaced with actual values at render time.

## Features Demonstrated

- **Discovering Variables**: Use `engine.variable.findAll()` to list all variables in a scene
- **Creating/Updating Variables**: Create or update variables with `engine.variable.setString(key, value)`
- **Reading Values**: Retrieve variable values with `engine.variable.getString(key)`
- **Binding to Text**: Insert `{{variable}}` tokens into text blocks
- **Detecting References**: Check if blocks contain variables with `engine.block.referencesAnyVariables(id)`
- **Removing Variables**: Clean up with `engine.variable.remove(key)`
- **Bulk Updates**: Populate multiple variables from external data sources
- **Localization**: Set friendly UI labels with `cesdk.i18n.setTranslations()`
- **Validation**: Check that all required variables have values before export

## Running the Example

### Development Server

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the example.

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

- `index.ts` - CE.SDK initialization and plugin loading
- `browser.ts` - Main plugin class with variable demonstrations
- `utils.ts` - Grid layout utilities
- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration

## Key Concepts

### Variable Store

Variables are stored globally in the engine's variable store. Multiple text blocks can reference the same variable.

### Token Syntax

Use double curly braces: `{{variableName}}`. Variable names are case-sensitive.

### Automatic Resolution

CE.SDK automatically resolves variable tokens at render time. Changes to variable values immediately update all text blocks that reference them.

### Use Cases

- Automated document generation (certificates, invoices, reports)
- Mass personalization (marketing materials with recipient data)
- Data-driven design (populate templates from JSON/CSV/API)
- Form-based editing (expose variables in custom UI)

## Related Guides

- [Placeholders](/guides/create-templates/placeholders/) - For dynamic image/video content
- [Form-Based Editing](/guides/create-templates/form-based-editing/) - Expose variables in custom UI
- [Design Generation](/guides/automation/design-generation/) - Batch template processing

## License

This example requires a valid CE.SDK license. Get your free trial at [https://img.ly/forms/free-trial](https://img.ly/forms/free-trial).
