/**
 * Gallery Constants
 *
 * Constants for the template gallery component.
 */

import type { Category } from './Gallery.types';

/**
 * Base URL for premium templates CDN.
 */
export const PREMIUM_TEMPLATES_BASE_URL =
  'https://staticimgly.com/imgly/premium-templates/1.0.0';

/**
 * Template categories available in the premium templates CDN.
 */
export const CATEGORIES: Category[] = [
  { id: 'e-commerce', label: 'E-commerce', groupPattern: 'e-commerce' },
  { id: 'event', label: 'Event', groupPattern: 'event' },
  { id: 'personal', label: 'Personal', groupPattern: 'personal' },
  { id: 'professional', label: 'Professional', groupPattern: 'professional' },
  { id: 'socials', label: 'Socials', groupPattern: 'socials' }
];
