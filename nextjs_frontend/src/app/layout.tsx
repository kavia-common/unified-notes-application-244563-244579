import type { Metadata } from "next";
import "./globals.css";
import ThemeStyles from "./ui/ThemeStyles";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";

export const metadata: Metadata = {
  title: "Unified Notes",
  description: "Cloud Notes App – Markdown, Tags, Retro UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyles />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
