'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'retro' | 'light';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'retro',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('retro');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'retro' || stored === 'light') {
      setTheme(stored);
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => setTheme((x) => (x === 'retro' ? 'light' : 'retro'));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
