/**
 * Gallery Types
 *
 * Type definitions for the template gallery component.
 */

/**
 * Template asset from the premium templates CDN.
 */
export interface TemplateAsset {
  id: string;
  label: { en: string };
  groups: string[];
  tags?: Record<string, string[]>;
  meta: {
    uri: string;
    thumbUri: string;
    width?: number;
    height?: number;
  };
}

/**
 * Template category definition.
 */
export interface Category {
  id: string;
  label: string;
  groupPattern: string;
}

/**
 * Response from the premium templates CDN.
 */
export interface TemplateSourceData {
  id: string;
  assets: TemplateAsset[];
}
