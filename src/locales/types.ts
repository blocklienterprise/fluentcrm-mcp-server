export interface ToolLocale {
  description: string;
  params?: Record<string, string>;
}

export interface Locale {
  tools: Record<string, ToolLocale>;
}
