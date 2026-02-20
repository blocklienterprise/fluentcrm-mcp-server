import { locale as en } from './locales/en.js';
import { locale as pl } from './locales/pl.js';
import type { Locale } from './locales/types.js';

const locales: Record<string, Locale> = { en, pl };

const lang = (process.env.MCP_LANG || 'en').toLowerCase();
const locale: Locale = locales[lang] ?? en;

if (lang !== 'en' && !locales[lang]) {
  console.error(`⚠️  Unknown MCP_LANG="${lang}", falling back to "en"`);
}

/**
 * Get a tool description or parameter description.
 * t('fluentcrm_list_contacts')          → tool description
 * t('fluentcrm_list_contacts', 'page')  → param description
 */
export function t(tool: string, param?: string): string {
  const entry = locale.tools[tool];
  if (!entry) return param ?? tool;
  if (param) return entry.params?.[param] ?? param;
  return entry.description;
}
