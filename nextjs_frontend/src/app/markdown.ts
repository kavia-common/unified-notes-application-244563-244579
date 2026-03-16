'use client';

import { marked } from 'marked';

// PUBLIC_INTERFACE
export function renderMarkdown(content: string): string {
  return marked(content, { breaks: true });
}
