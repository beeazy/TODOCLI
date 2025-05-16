// Configuration constants
const BUNDLE_ID = 'com.goodworkevans.TODOCLI';
const APP_NAME = 'TODOCLI';

// Theme definitions
export const themes = {
  matrix: {
    name: "Matrix",
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#00FF00",
    onAccent: "#FFFFFF",
    success: "#00FF00",
    error: "#FF4444",
    muted: "#666666",
    surface: "#111111",
    border: "#00FF00",
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
const DEFAULT_THEME = 'matrix';
const selectedTheme = themes[DEFAULT_THEME];

// App theme configuration
const THEME = {
  backgroundColor: selectedTheme.background,
  accentColor: selectedTheme.accent,
  textColor: selectedTheme.foreground,
  surfaceColor: selectedTheme.surface,
};

// Splash screen configuration
const splashConfig = {
  image: './assets/images/splash-icon.png',
  imageWidth: 200,
  resizeMode: 'contain',
  backgroundColor: THEME.backgroundColor,
};

export default {
  expo: {
    name: APP_NAME,
    slug: APP_NAME.toLowerCase(),
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'todocli',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,

    // EAS configuration
    extra: {
      eas: {
        projectId: "05412c76-ac91-44d6-a20f-e49ca701345f"
      }
    },

    // iOS specific configuration
    ios: {
      supportsTablet: true,
      bundleIdentifier: BUNDLE_ID,
      userInterfaceStyle: 'dark',
      splash: splashConfig,
    },

    // Android specific configuration
    android: {
      adaptiveIcon: {
        backgroundColor: THEME.backgroundColor,
        foregroundImage: './assets/images/ic_launcher_foreground.png',
        backgroundImage: './assets/images/ic_launcher_background.png',
        monochromeImage: './assets/images/ic_launcher_monochrome.png',
      },
      edgeToEdgeEnabled: true,
      package: BUNDLE_ID,
      navigationBar: {
        backgroundColor: THEME.backgroundColor,
        barStyle: 'light-content',
      },
      splash: splashConfig,
    },

    // Web specific configuration
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
      themeColor: THEME.backgroundColor,
      backgroundColor: THEME.backgroundColor,
    },

    // Plugins configuration
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        splashConfig,
      ],
    ],

    // Experimental features
    experiments: {
      typedRoutes: true,
    },

    // Global theme configuration
    colors: {
      primary: THEME.accentColor,
      background: THEME.backgroundColor,
      text: THEME.textColor,
      surface: THEME.surfaceColor,
    },
  },
}; 