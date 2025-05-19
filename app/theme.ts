// Theme interface definition
export interface Theme {
  name: string;
  background: string;
  foreground: string;
  accent: string;
  onAccent: string;
  success: string;
  error: string;
  muted: string;
  surface: string;
  border: string;
}

// Theme definitions
export const themes: Record<string, Theme> = {
  matrix: {
    name: "Matrix",
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#39FF14",
    onAccent: "#FFFFFF",
    success: "#39FF14",
    error: "#FF4444",
    muted: "#666666",
    surface: "#111111",
    border: "#39FF14",
  },
  dracula: {
    name: "Dracula",
    background: "#282A36",
    foreground: "#F8F8F2",
    accent: "#BD93F9",
    onAccent: "#FFFFFF",
    success: "#50FA7B",
    error: "#FF5555",
    muted: "#6272A4",
    surface: "#44475A",
    border: "#BD93F9",
  },
  monokai: {
    name: "Monokai",
    background: "#272822",
    foreground: "#F8F8F2",
    accent: "#FD971F",
    onAccent: "#FFFFFF",
    success: "#A6E22E",
    error: "#F92672",
    muted: "#75715E",
    surface: "#3E3D32",
    border: "#FD971F",
  },
  solarizedDark: {
    name: "Solarized Dark",
    background: "#002B36",
    foreground: "#839496",
    accent: "#268BD2",
    onAccent: "#FFFFFF",
    success: "#859900",
    error: "#DC322F",
    muted: "#586E75",
    surface: "#073642",
    border: "#268BD2",
  },
  nord: {
    name: "Nord",
    background: "#2E3440",
    foreground: "#D8DEE9",
    accent: "#88C0D0",
    onAccent: "#FFFFFF",
    success: "#A3BE8C",
    error: "#BF616A",
    muted: "#4C566A",
    surface: "#3B4252",
    border: "#88C0D0",
  },
};

// Default theme
export const defaultTheme = themes.matrix;

// Storage keys
export const THEME_STORAGE_KEY = "@terminal_todo_theme";
export const PREMIUM_STORAGE_KEY = "@terminal_todo_premium";

// Default export of the theme configuration
export default {
  themes,
  defaultTheme,
  THEME_STORAGE_KEY,
  PREMIUM_STORAGE_KEY,
}; 