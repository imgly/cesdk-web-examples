import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class LocalizationExample implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default and demo asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Create a design scene
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Get the currently active locale
    const currentLocale = cesdk.i18n.getLocale();
    console.log('Current locale:', currentLocale);
    // Output: "en" (default fallback locale)

    // List all available locales
    const allLocales = cesdk.i18n.listLocales();
    console.log('Available locales:', allLocales);
    // Output: ["en", "de"] (default English and German)

    // Find English variants using wildcard
    const englishLocales = cesdk.i18n.listLocales({ matcher: 'en*' });
    console.log('English locales:', englishLocales);

    // Switch to German locale
    cesdk.i18n.setLocale('de');
    console.log('Switched to locale:', cesdk.i18n.getLocale());
    // The UI will now display in German

    // Add French translations
    cesdk.i18n.setTranslations({
      fr: {
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.back': 'Retour',
        'meta.currentLanguage': 'Français'
      }
    });

    // Switch to French
    cesdk.i18n.setLocale('fr');
    console.log('Switched to French locale');

    // Override specific labels for English while keeping defaults
    cesdk.i18n.setTranslations({
      en: {
        'common.save': 'Save Design',
        'common.export': 'Download'
      }
    });

    // White-label with custom terminology across multiple locales
    cesdk.i18n.setTranslations({
      en: {
        'action.save': 'Publish Design',
        'action.export': 'Download Design',
        'panel.adjustments.title': 'Enhance'
      },
      de: {
        'action.save': 'Design Veröffentlichen',
        'action.export': 'Design Herunterladen',
        'panel.adjustments.title': 'Verbessern'
      }
    });

    // Retrieve translations for specific locales
    const frenchTranslations = cesdk.i18n.getTranslations(['fr']);
    console.log('French translations:', frenchTranslations);

    // Get all translations
    const allTranslations = cesdk.i18n.getTranslations();
    console.log('All translations loaded:', Object.keys(allTranslations));

    // Translate custom keys programmatically
    const saveLabel = cesdk.i18n.translate('common.save');
    console.log('Save label:', saveLabel);

    // Use fallback keys
    const actionLabel = cesdk.i18n.translate(['custom.action', 'common.save']);
    console.log('Action label with fallback:', actionLabel);

    // Build language selector data
    const availableLocales = cesdk.i18n.listLocales();
    console.log('Building language selector with locales:', availableLocales);

    // Simulate dynamic language switching
    const switchLanguage = (locale: string) => {
      cesdk.i18n.setLocale(locale);
      console.log(`Switched to ${locale}`);
    };

    // Example: Switch between languages
    switchLanguage('en');
    switchLanguage('de');
    switchLanguage('fr');

    // Simulate loading translations from external source
    const loadExternalTranslations = async () => {
      // In a real application, you would fetch from a server:
      // const response = await fetch('/api/translations/es.json');
      // const translations = await response.json();

      // Simulate external Spanish translations
      const externalTranslations = {
        es: {
          'common.save': 'Guardar',
          'common.cancel': 'Cancelar',
          'common.back': 'Volver',
          'meta.currentLanguage': 'Español'
        }
      };

      cesdk.i18n.setTranslations(externalTranslations);
      console.log('Loaded external Spanish translations');
    };

    await loadExternalTranslations();

    // Add Italian with comprehensive translations for a fully localized UI
    cesdk.i18n.setTranslations({
      it: {
        // === NAVIGATION BAR (Top Bar) ===

        // Undo/Redo
        'common.undo': 'Annulla',
        'common.redo': 'Ripeti',
        'component.undo.undo': 'Annulla',
        'component.undo.redo': 'Ripeti',

        // File Operations
        'common.save': 'Salva',
        'common.export': 'Esporta',
        'common.download': 'Scarica',
        'component.fileOperation.save': 'Salva',
        'component.fileOperation.exportImage': 'Esporta Immagini',
        'component.fileOperation.exportPDF': 'Esporta PDF',
        'component.fileOperation.exportVideo': 'Esporta Video',
        'component.fileOperation.exportScene': 'Esporta Design',
        'component.fileOperation.importScene': 'Importa Design',
        'component.fileOperation.more': 'Mostra altre opzioni',

        // Zoom Controls
        'component.zoom.in': 'Aumenta Zoom',
        'component.zoom.out': 'Diminuisci Zoom',
        'component.zoom.fitPage': 'Adatta Pagina',
        'component.zoom.fitSelection': 'Adatta Selezione',
        'component.zoom.autoFit': 'Adattamento Automatico',
        'component.zoom.options': 'Vedi altre opzioni di zoom',

        // Top Bar Controls
        'component.topbar.back': 'Indietro',
        'component.topbar.close': 'Chiudi',
        'common.close': 'Chiudi',
        'component.settings.toggle': 'Personalizza Editor',
        'component.settings.toggle.description':
          "Apri impostazioni per personalizzare l'editor",

        // === DOCK (Left Sidebar) ===

        // Library/Asset Panel
        'component.library': 'Libreria',
        'component.library.elements': 'Elementi',
        'component.canvas.openLibrary': 'Aggiungi Elementi',
        'component.library.addFile': 'Aggiungi File',
        'component.library.searchPlaceholder': 'Cerca …',
        'component.library.clearSearch': 'Cancella ricerca',
        'component.library.noItems': 'Nessun Elemento',
        'component.library.loading': 'Caricamento …',

        // Library Categories
        'libraries.ly.img.image.label': 'Immagini',
        'libraries.ly.img.image.upload.label': 'Caricamenti Immagini',
        'libraries.ly.img.video.label': 'Video',
        'libraries.ly.img.video.upload.label': 'Caricamenti Video',
        'libraries.ly.img.audio.label': 'Audio',
        'libraries.ly.img.audio.upload.label': 'Caricamenti Audio',
        'libraries.ly.img.text.label': 'Testo',
        'libraries.ly.img.text.title.label': 'Titolo',
        'libraries.ly.img.text.headline.label': 'Intestazione',
        'libraries.ly.img.text.paragraph.label': 'Paragrafo',
        'libraries.ly.img.vectorpath.label': 'Forme',
        'libraries.ly.img.sticker.label': 'Adesivi',
        'libraries.ly.img.upload.label': 'Caricamenti',
        'libraries.ly.img.template.label': 'Modelli',
        'libraries.unsplash.label': 'Unsplash',

        // Inspector Panel
        'component.inspectorBar': 'Barra Ispettore',
        'action.showInspector': 'Mostra Ispettore',
        'action.closeInspector': 'Chiudi Ispettore',
        'component.propertyPopover.header': 'Proprietà',

        // === COMMON ELEMENTS ===

        // Basic Actions
        'common.cancel': 'Annulla',
        'common.back': 'Indietro',
        'common.done': 'Fatto',
        'common.apply': 'Applica',
        'common.reset': 'Ripristina',
        'common.delete': 'Elimina',
        'common.duplicate': 'Duplica',
        'common.add': 'Aggiungi',
        'common.replace': 'Sostituisci',
        'common.edit': 'Modifica',
        'common.load': 'Carica',
        'common.more': 'Altro',

        // Canvas
        'component.canvas': 'Area Editor',
        'common.mode.design': 'Design',
        'common.mode.preview': 'Anteprima',

        // Properties & Adjustments
        'common.properties': 'Proprietà',
        'common.opacity': 'Opacità',
        'common.fill': 'Riempimento',
        'common.color': 'Colore',
        'common.position': 'Posizione',
        'common.size': 'Dimensione',
        'common.rotation': 'Rotazione',
        'common.transform': 'Trasforma',

        // Adjustments
        'input.adjustments': 'Regolazioni',
        'property.adjustments.brightness': 'Luminosità',
        'property.adjustments.contrast': 'Contrasto',
        'property.adjustments.saturation': 'Saturazione',
        'property.adjustments.exposure': 'Esposizione',
        'property.adjustments.highlights': 'Luci',
        'property.adjustments.shadows': 'Ombre',
        'property.adjustments.temperature': 'Temperatura',
        'property.adjustments.sharpness': 'Nitidezza',

        // Blur & Effects
        'input.blur': 'Sfocatura',
        'input.effect': 'Effetto',
        'input.filter': 'Filtro',
        'component.assetSettings.blur': 'Sfocatura',
        'component.assetSettings.effects': 'Effetti',
        'component.assetSettings.filters': 'Filtri',
        'component.assetSettings.adjustments': 'Regolazioni',

        // Text Properties
        'input.text.advanced': 'Avanzate',
        'property.letterSpacing': 'Spaziatura Lettere',
        'property.lineHeight': 'Altezza Riga',
        'typography.typeface': 'Carattere',
        'typography.size': 'Dimensione',
        'typography.bold': 'Grassetto',
        'typography.italic': 'Corsivo',

        // Block Types
        'block.image': 'Immagine',
        'block.video': 'Video',
        'block.audio': 'Audio',
        'block.text': 'Testo',
        'block.shape': 'Forma',
        'block.sticker': 'Adesivo',
        'block.group': 'Gruppo',
        'block.page': 'Pagina',

        // Actions
        'action.align': 'Allinea',
        'action.arrange': 'Disponi',
        'action.group': 'Raggruppa',
        'action.ungroup': 'Separa',
        'common.lock': 'Blocca',
        'common.unlock': 'Sblocca',

        // Pages
        'common.page': 'Pagina',
        'action.page.add': 'Aggiungi Pagina',
        'action.page.delete': 'Elimina Pagina',

        // Metadata
        'meta.currentLanguage': 'Italiano'
      }
    });

    // Verify the new locale is available
    console.log('Available after Italian:', cesdk.i18n.listLocales());

    // Switch to Italian to display the fully translated UI
    cesdk.i18n.setLocale('it');
    console.log('UI now displaying in Italian');

    // Add a sample image to the canvas for visual content
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const image = await engine.block.addImage(imageUri, { x: 0, y: 0 });
    engine.block.setWidth(image, 800);
    engine.block.setHeight(image, 600);
  }
}

export default LocalizationExample;
