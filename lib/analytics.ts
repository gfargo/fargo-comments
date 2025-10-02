import { track as vercelTrack } from '@vercel/analytics/server'

/**
 * Analytics Event Types
 * Centralized event naming for consistency across the application
 */
export const AnalyticsEvents = {
  // Registry & Distribution Events
  REGISTRY_ACCESSED: 'registry_accessed',
  COMPONENT_ACCESSED: 'component_accessed',
  COMPONENT_INSTALLED: 'component_installed',
  COMPONENT_404: 'component_not_found',
  REGISTRY_ERROR: 'registry_error',

  // Demo & Documentation Events
  VARIANT_VIEWED: 'variant_viewed',
  DEMO_PAGE_VISITED: 'demo_page_visited',
  ADAPTER_EXAMPLE_VIEWED: 'adapter_example_viewed',

  // Interactive Elements
  COMMENT_ACTION: 'comment_action',
  COMPOSER_USED: 'composer_used',
  MENTION_TRIGGERED: 'mention_triggered',
  EMOJI_PICKER_OPENED: 'emoji_picker_opened',

  // User Journey & Conversion
  GETTING_STARTED_CLICKED: 'getting_started_clicked',
  DOCUMENTATION_OPENED: 'documentation_opened',
  GITHUB_CLICKED: 'github_clicked',
  COPY_CODE_CLICKED: 'copy_code_clicked',
  INSTALLATION_COMMAND_COPIED: 'installation_command_copied',

  // Integration Signals
  STORAGE_ADAPTER_SELECTED: 'storage_adapter_selected',

  // Performance & Errors
  COMPONENT_LOAD_TIME: 'component_load_time',
  BUILD_FAILURE: 'build_failure',
  FILE_NOT_FOUND: 'file_not_found',
} as const

export type AnalyticsEventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents]

/**
 * Base event properties that all analytics events should include
 */
export interface BaseEventProperties {
  timestamp: number
  user_agent?: string
  referrer?: string
  path?: string
}

/**
 * Registry-specific event properties
 */
export interface RegistryEventProperties extends BaseEventProperties {
  type: 'registry_index' | 'component_download' | 'component_search'
  component_name?: string
  component_version?: string
  file_count?: number
  dependency_count?: number
}

/**
 * Component-specific event properties
 */
export interface ComponentEventProperties extends BaseEventProperties {
  component_name: string
  variant?: string
  adapter?: string
  action?: 'view' | 'install' | 'update' | 'remove'
}

/**
 * Demo interaction event properties
 */
export interface DemoEventProperties extends BaseEventProperties {
  demo_type: string
  action: string
  variant?: string
  feature?: string
}

/**
 * Error event properties
 */
export interface ErrorEventProperties extends BaseEventProperties {
  error_type: string
  error_message?: string
  component?: string
  stack_trace?: string
}

/**
 * Performance event properties
 */
export interface PerformanceEventProperties extends BaseEventProperties {
  metric_name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
}

/**
 * Union type of all possible event properties
 */
export type EventProperties =
  | RegistryEventProperties
  | ComponentEventProperties
  | DemoEventProperties
  | ErrorEventProperties
  | PerformanceEventProperties
  | BaseEventProperties

/**
 * Analytics utility for consistent event tracking
 */
export class Analytics {
  /**
   * Track a server-side event with Vercel Analytics
   */
  static async trackServer(
    eventName: AnalyticsEventName | string,
    properties?: Partial<EventProperties>
  ): Promise<void> {
    try {
      const enrichedProperties = {
        ...properties,
        timestamp: Date.now(),
      }

      await vercelTrack(eventName, enrichedProperties)
    } catch (error) {
      // Fail silently - don't break the application for analytics
      console.error('Analytics tracking error:', error)
    }
  }

  /**
   * Extract user agent information from request headers
   */
  static getUserAgent(headers: Headers): string | undefined {
    return headers.get('user-agent') || undefined
  }

  /**
   * Extract referrer information from request headers
   */
  static getReferrer(headers: Headers): string | undefined {
    return headers.get('referer') || headers.get('referrer') || undefined
  }

  /**
   * Extract request path from URL
   */
  static getPath(url: string): string {
    try {
      return new URL(url).pathname
    } catch {
      return url
    }
  }

  /**
   * Create base properties from request
   */
  static createBaseProperties(request?: Request): BaseEventProperties {
    if (!request) {
      return { timestamp: Date.now() }
    }

    return {
      timestamp: Date.now(),
      user_agent: this.getUserAgent(request.headers),
      referrer: this.getReferrer(request.headers),
      path: this.getPath(request.url),
    }
  }

  /**
   * Track registry access event
   */
  static async trackRegistryAccess(
    type: RegistryEventProperties['type'],
    request?: Request,
    additionalProps?: Partial<RegistryEventProperties>
  ): Promise<void> {
    const properties: RegistryEventProperties = {
      ...this.createBaseProperties(request),
      type,
      ...additionalProps,
    }

    await this.trackServer(AnalyticsEvents.REGISTRY_ACCESSED, properties)
  }

  /**
   * Track component access event
   */
  static async trackComponentAccess(
    componentName: string,
    request?: Request,
    additionalProps?: Partial<ComponentEventProperties>
  ): Promise<void> {
    const properties: ComponentEventProperties = {
      ...this.createBaseProperties(request),
      component_name: componentName,
      action: 'view',
      ...additionalProps,
    }

    await this.trackServer(AnalyticsEvents.COMPONENT_ACCESSED, properties)
  }

  /**
   * Track component not found (404) event
   */
  static async trackComponentNotFound(
    componentName: string,
    request?: Request
  ): Promise<void> {
    const properties: ComponentEventProperties = {
      ...this.createBaseProperties(request),
      component_name: componentName,
      action: 'view',
    }

    await this.trackServer(AnalyticsEvents.COMPONENT_404, properties)
  }

  /**
   * Track error event
   */
  static async trackError(
    errorType: string,
    errorMessage?: string,
    request?: Request,
    additionalProps?: Partial<ErrorEventProperties>
  ): Promise<void> {
    const properties: ErrorEventProperties = {
      ...this.createBaseProperties(request),
      error_type: errorType,
      error_message: errorMessage,
      ...additionalProps,
    }

    await this.trackServer(AnalyticsEvents.REGISTRY_ERROR, properties)
  }

  /**
   * Track performance metric
   */
  static async trackPerformance(
    metricName: string,
    value: number,
    unit: PerformanceEventProperties['unit'] = 'ms',
    additionalProps?: Partial<PerformanceEventProperties>
  ): Promise<void> {
    const properties: PerformanceEventProperties = {
      timestamp: Date.now(),
      metric_name: metricName,
      value,
      unit,
      ...additionalProps,
    }

    await this.trackServer(AnalyticsEvents.COMPONENT_LOAD_TIME, properties)
  }

  /**
   * Track demo interaction event
   */
  static async trackDemo(
    demoType: string,
    action: string,
    additionalProps?: Partial<DemoEventProperties>
  ): Promise<void> {
    const properties: DemoEventProperties = {
      timestamp: Date.now(),
      demo_type: demoType,
      action,
      ...additionalProps,
    }

    await this.trackServer(AnalyticsEvents.DEMO_PAGE_VISITED, properties)
  }
}

/**
 * Client-side analytics helper (to be imported from @vercel/analytics/react)
 * This is a placeholder for client-side tracking utilities
 */
export const trackClient = async (
  eventName: AnalyticsEventName | string,
  properties?: Record<string, any>
) => {
  // This will be implemented using @vercel/analytics/react in client components
  // For now, it's a placeholder that can be extended
  if (typeof window !== 'undefined') {
    const enrichedProperties = {
      ...properties,
      timestamp: Date.now(),
      path: window.location.pathname,
      referrer: document.referrer || undefined,
    }

    // Client-side tracking will use the React hook
    console.log('Client track:', eventName, enrichedProperties)
  }
}
