import premiumTemplates from './premium-templates.json';

export type PlaceholderFieldType = 'text' | 'multiline' | 'date' | 'image';

export interface PlaceholderFieldDefinition {
  id: string;
  label: string;
  type: PlaceholderFieldType;
  description?: string;
  blockName?: string;
  required?: boolean;
  sampleValue?: string;
}

export interface TemplateDefinition {
  id: string;
  title: string;
  description: string;
  sceneUrl: string;
  previewUrl?: string;
  layoutType: string;
  tags: string[];
  placeholders?: PlaceholderFieldDefinition[];
}

type PremiumTemplatesFile = {
  assets?: Array<{
    id: string;
    label?: { en?: string };
    tags?: { en?: string[] };
    groups?: string[];
    meta?: {
      uri?: string;
      thumbUri?: string;
    };
  }>;
};

const getTemplateBaseURL = (): string | null => {
  const baseURL = process.env.NEXT_PUBLIC_PREMIUM_TEMPLATES_BASE_URL;

  if (!baseURL) {
    console.error(
      'Premium templates CDN URL is not configured. This cookbook requires access to premium templates.'
    );
    console.error('Set NEXT_PUBLIC_PREMIUM_TEMPLATES_BASE_URL in .env.local or run: npm run secrets');
    return null;
  }

  return baseURL;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[_\s]+/g, ' ')
    .trim();

function createTemplateFromAsset(
  asset: NonNullable<PremiumTemplatesFile['assets']>[number]
): TemplateDefinition | null {
  const baseURL = getTemplateBaseURL();
  if (!baseURL) {
    return null;
  }

  const sceneUrl = asset.meta?.uri?.replace('{{base_url}}', `${baseURL}/dist/templates`);

  if (!sceneUrl) {
    return null;
  }

  const previewUrl = asset.meta?.thumbUri?.replace('{{base_url}}', `${baseURL}/dist/templates`);
  const tags = asset.tags?.en ?? [];
  const title = asset.label?.en ?? asset.id;
  const layoutType = asset.groups?.[0] ?? 'premium-template';

  let description: string;
  if (tags.length > 0) {
    description = `Tags: ${tags.join(', ')}`;
  } else {
    description = 'Premium Template';
  }

  return {
    id: asset.id,
    title,
    description,
    sceneUrl,
    previewUrl,
    layoutType,
    tags,
    placeholders: []
  };
}

const premiumCatalog: TemplateDefinition[] = (() => {
  const data = premiumTemplates as PremiumTemplatesFile;
  const assets = data.assets ?? [];

  return assets
    .map(createTemplateFromAsset)
    .filter((template): template is TemplateDefinition => template !== null);
})();

const uniqueById = (templates: TemplateDefinition[]) => {
  const seen = new Set<string>();
  const result: TemplateDefinition[] = [];
  for (const template of templates) {
    if (!seen.has(template.id)) {
      seen.add(template.id);
      result.push(template);
    }
  }
  return result;
};

export const TEMPLATE_CATALOG: TemplateDefinition[] = premiumCatalog;

export function getTemplatesByLayout(layoutType: string, limit = 4) {
  const normalized = normalize(layoutType);
  const matchesByGroup = TEMPLATE_CATALOG.filter(
    (template) => normalize(template.layoutType) === normalized
  );
  const matchesByTag = TEMPLATE_CATALOG.filter((template) =>
    template.tags.some((tag) => normalize(tag).includes(normalized))
  );
  const matchesByTitle = TEMPLATE_CATALOG.filter((template) =>
    normalize(template.title).includes(normalized)
  );

  const combined = uniqueById([
    ...matchesByGroup,
    ...matchesByTag,
    ...matchesByTitle,
    ...TEMPLATE_CATALOG
  ]);

  return combined.slice(0, limit);
}

export function getTemplateById(id: string) {
  return TEMPLATE_CATALOG.find((entry) => entry.id === id);
}
