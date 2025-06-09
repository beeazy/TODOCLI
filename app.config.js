// Configuration constants
const BUNDLE_ID = 'com.goodworkevans.TODOCLI';
const APP_NAME = 'TODOCLI';

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
      splash: {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#000000',
      },
    },

    // Android specific configuration
    android: {
      adaptiveIcon: {
        backgroundColor: '#000000',
        foregroundImage: './assets/images/ic_launcher_foreground.png',
        backgroundImage: './assets/images/ic_launcher_background.png',
        monochromeImage: './assets/images/ic_launcher_monochrome.png',
      },
      edgeToEdgeEnabled: true,
      package: BUNDLE_ID,
      navigationBar: {
        backgroundColor: '#0f1211',
        barStyle: 'light-content',
      },
      splash: {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#0f1211',
      },
    },

    // Web specific configuration
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/icon.png',
      themeColor: '#0f1211',
      backgroundColor: '#0f1211',
    },

    // Updates configuration
    updates: {
      url: "https://u.expo.dev/05412c76-ac91-44d6-a20f-e49ca701345f"
    },
    runtimeVersion: "1.0.1",

    // Plugins configuration
    plugins: [
      [
        'expo-router',
        {
          sitemap: false
        }
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#0f1211',
        },
      ],
    ],

    // Experimental features
    experiments: {
      typedRoutes: true,
    },
  },
}; 