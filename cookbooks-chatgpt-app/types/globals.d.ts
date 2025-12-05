/**
 * Global type declarations for the ChatGPT App Starterkit.
 * Consolidates window interface extensions to avoid conflicts.
 */

import type { API, OpenAiGlobals, SetGlobalsEvent } from '@/utils/openai';

declare global {
  interface Window {
    /**
     * OpenAI ChatGPT widget API and globals.
     * Available when running inside ChatGPT's widget environment.
     */
    openai: API & OpenAiGlobals;

    /**
     * Base URL for the application, set at runtime.
     */
    innerBaseUrl: string;
  }

  interface WindowEventMap {
    'openai:set_globals': SetGlobalsEvent;
  }
}

export {};
