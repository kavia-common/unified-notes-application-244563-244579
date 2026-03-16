'use client';

// This file injects theme-specific (Retro/Light) CSS styles. Imported in layout.tsx.

import React from "react";

export default function ThemeStyles() {
  return (
    <style global jsx>{`
      [data-theme='retro'] {
        --color-background: #f7f5ec;
        --color-surface: #fff8df;
        --color-primary: #1e293b;
        --color-accent: #3b82f6;
        --color-accent2: #06b6d4;
        --color-text: #18181b;
        --color-tag-bg: #c9eaf8;
      }
      [data-theme='light'] {
        --color-background: #f9fafb;
        --color-surface: #ffffff;
        --color-primary: #111827;
        --color-accent: #3b82f6;
        --color-accent2: #06b6d4;
        --color-text: #1e293b;
        --color-tag-bg: #e0ecff;
      }
      html, body {
        background: var(--color-background);
        color: var(--color-text);
        height: 100%;
      }
      .note-list {
        background: var(--color-surface);
        border-right: 2px solid var(--color-accent);
      }
      .note-list .active {
        background: var(--color-tag-bg);
        color: var(--color-primary);
        font-weight: bold;
      }
      .notes-app-main {
        display: flex;
        flex-direction: row;
        min-height: 100vh;
        width: 100vw;
      }
      .sidebar {
        width: 320px;
        max-width: 100vw;
        padding: 0;
        background: var(--color-surface);
        border-right: 2px solid var(--color-accent2);
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .main-panel {
        flex: 1 1 0;
        padding: 0;
        min-width: 0;
        background: var(--color-background);
        display: flex;
        flex-direction: column;
      }
      @media (max-width: 900px) {
        .sidebar {
          width: 56vw;
          min-width: 180px;
        }
      }
      @media (max-width: 700px) {
        .notes-app-main {
          flex-direction: column;
        }
        .sidebar {
          width: 100vw;
          height: 38vh;
          max-height: 260px;
          border-right: none;
          border-bottom: 2px solid var(--color-accent2);
          flex-direction: row;
        }
        .main-panel { min-height: 48vh }
      }
      .retro-header {
        font-family: monospace, system-ui, sans-serif;
        background: var(--color-accent);
        color: white;
        padding: 0.8rem 2rem;
        font-size: 1.8rem;
        text-shadow: 1px 2px 0 var(--color-accent2);
        letter-spacing: 0.04em;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `}</style>
  );
}
