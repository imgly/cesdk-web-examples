/**
 * Gallery Constants
 *
 * Constants for the template gallery component.
 */

import type { Category } from './Gallery.types';

/**
 * Template categories, in gallery order. Each one is a group of the premium
 * templates asset source.
 */
export const CATEGORIES: Category[] = [
  { id: 'e-commerce', label: 'E-commerce' },
  { id: 'event', label: 'Event' },
  { id: 'personal', label: 'Personal' },
  { id: 'professional', label: 'Professional' },
  { id: 'socials', label: 'Socials' }
];
