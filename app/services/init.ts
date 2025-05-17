import Aptabase from '@aptabase/react-native';

export function initializeAnalytics() {
  try {
    Aptabase.init(process.env.EXPO_PUBLIC_APTABASE_API_KEY as string);
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to initialize Aptabase:', error);
    }
  }
} 