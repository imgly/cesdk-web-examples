# Custom Labels - CE.SDK Guide Example

This example demonstrates how to customize UI text labels in CreativeEditor SDK (CE.SDK) for browser applications.

## Features Demonstrated

- **Basic Label Override**: Changing single common labels (e.g., "Export" → "Download")
- **Navigation Labels**: Customizing back/close/done button labels
- **Action Labels**: Modifying context menu and action button labels
- **Panel Labels**: Customizing inspector and panel titles
- **Multiple Related Labels**: Overriding several related labels for consistent branding
- **Runtime Updates**: Changing labels after initialization

## Running the Example

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Concepts

### Using setTranslations API

```typescript
// Override specific labels while keeping the default English locale
cesdk.i18n.setTranslations({
  en: {
    'common.export': 'Download',
    'common.back': 'Close'
  }
});
```

### Translation Key Structure

- Format: `category.component.property`
- Categories: `action`, `common`, `panel`, `component`, `input`
- Examples:
  - `action.block.delete` - Delete action label
  - `common.save` - Save button label
  - `panel.inspector.title` - Inspector panel title

### Discovering Available Labels

1. Download English translation file: `https://cdn.img.ly/packages/imgly/cesdk-js/$VERSION$/assets/i18n/en.json`
2. Inspect UI with browser DevTools to identify label keys
3. Search for specific labels in the translation file

## File Structure

- `index.ts` - Entry point, initializes CE.SDK
- `browser.ts` - Main plugin implementation with custom label examples
- `utils.ts` - Grid layout utilities for positioning demonstration blocks
- `index.html` - HTML container for CE.SDK

## Related Documentation

- [Custom Labels Guide](https://img.ly/docs/cesdk/user-interface/appearance/custom-labels)
- [Localization Guide](https://img.ly/docs/cesdk/user-interface/localization)
- [i18n API Reference](https://img.ly/docs/cesdk/api/i18n)

## License

This example requires a CE.SDK license. Get a free trial at https://img.ly/forms/free-trial
