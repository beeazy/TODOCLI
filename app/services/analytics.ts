import { trackEvent } from '@aptabase/react-native';

// Event categories
export const EventCategory = {
  TASK: 'task',
  TAB: 'tab',
  THEME: 'theme',
  PRIORITY: 'priority',
  PREMIUM: 'premium',
  MODAL: 'modal',
  BUTTON: 'button',
  INTERACTION: 'interaction'
} as const;

// Event actions
export const EventAction = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  TOGGLE: 'toggle',
  CHANGE: 'change',
  VIEW: 'view',
  UPGRADE: 'upgrade',
  OPEN: 'open',
  CLOSE: 'close',
  CLICK: 'click',
  CANCEL: 'cancel',
  SAVE: 'save'
} as const;

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Task Events
  public trackTaskCreated(tabId: string): void {
    this.logEvent('task_created', { tabId });
  }

  public trackTaskUpdated(taskId: string, tabId: string): void {
    this.logEvent('task_updated', { taskId, tabId });
  }

  public trackTaskDeleted(taskId: string, tabId: string): void {
    this.logEvent('task_deleted', { taskId, tabId });
  }

  public trackTaskToggled(taskId: string, completed: boolean): void {
    this.logEvent('task_toggled', { taskId, completed });
  }

  public trackPriorityChanged(taskId: string, priority: string): void {
    this.logEvent('priority_changed', { taskId, priority });
  }

  // Tab Events
  public trackTabCreated(tabId: string): void {
    this.logEvent('tab_created', { tabId });
  }

  public trackTabDeleted(tabId: string): void {
    this.logEvent('tab_deleted', { tabId });
  }

  public trackTabViewed(tabId: string): void {
    this.logEvent('tab_viewed', { tabId });
  }

  // Theme Events
  public trackThemeChanged(themeName: string): void {
    this.logEvent('theme_changed', { themeName });
  }

  // Premium Events
  public trackPremiumUpgrade(): void {
    this.logEvent('premium_upgraded');
  }

  // Modal Events
  public trackModalOpened(modalName: string): void {
    this.logEvent('modal_opened', { modalName });
  }

  public trackModalClosed(modalName: string): void {
    this.logEvent('modal_closed', { modalName });
  }

  public trackModalAction(modalName: string, action: string): void {
    this.logEvent('modal_action', { modalName, action });
  }

  // Button Events
  public trackButtonClick(buttonName: string, context: string): void {
    this.logEvent('button_clicked', { buttonName, context });
  }

  // Input Events
  public trackInputSubmit(inputName: string, context: string): void {
    this.logEvent('input_submitted', { inputName, context });
  }

  // General Interaction Events
  public trackInteraction(action: string, context: string, details?: Record<string, any>): void {
    this.logEvent('user_interaction', { action, context, ...details });
  }

  private logEvent(
    eventName: string,
    properties: Record<string, string | number | boolean> = {}
  ): void {
    try {
      trackEvent(eventName, properties);
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