import { trackEvent } from '@aptabase/react-native';

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track App Launch
  public trackAppLaunch(): void {
    this.logEvent('app_launch');
  }

  private logEvent(eventName: string): void {
    try {
      trackEvent(eventName);
    } catch (error) {
      // Silently fail in production, log in development
      if (__DEV__) {
        console.error('Analytics error:', error);
      }
    }
  }
}

export const analytics = AnalyticsService.getInstance();
export default analytics;