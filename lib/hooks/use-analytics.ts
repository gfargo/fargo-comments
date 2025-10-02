import { useCallback } from 'react'
import { track } from '@vercel/analytics/react'
import { AnalyticsEventName, EventProperties } from '@/lib/analytics'

/**
 * Hook for tracking analytics events in React components
 *
 * @example
 * ```tsx
 * const { trackEvent } = useAnalytics()
 *
 * trackEvent('comment_action', {
 *   demo_type: 'comment-list',
 *   action: 'add',
 *   variant: 'card'
 * })
 * ```
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (eventName: AnalyticsEventName | string, properties?: Partial<EventProperties>) => {
      try {
        const enrichedProperties = {
          ...properties,
          timestamp: Date.now(),
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        }

        // Use Vercel Analytics React track function
        track(eventName, enrichedProperties)
      } catch (error) {
        // Fail silently - don't break the application for analytics
        console.error('Analytics tracking error:', error)
      }
    },
    []
  )

  return { trackEvent }
}

/**
 * Hook for tracking component mount/unmount events
 *
 * @example
 * ```tsx
 * useComponentTracking('comment-list', { variant: 'card' })
 * ```
 */
export function useComponentTracking(
  componentName: string,
  properties?: Record<string, any>
) {
  const { trackEvent } = useAnalytics()

  // Track component mount
  useCallback(() => {
    trackEvent('component_viewed', {
      component_name: componentName,
      ...properties,
    })
  }, [trackEvent, componentName, properties])()

  return { trackEvent }
}

/**
 * Hook for tracking user interactions with debouncing
 * Useful for high-frequency events like typing or scrolling
 *
 * @example
 * ```tsx
 * const trackInteraction = useInteractionTracking('composer_typing', 500)
 *
 * <input onChange={() => trackInteraction({ feature: 'rich-text' })} />
 * ```
 */
export function useInteractionTracking(
  eventName: string,
  debounceMs: number = 300
) {
  const { trackEvent } = useAnalytics()
  let timeoutId: NodeJS.Timeout | null = null

  const trackInteraction = useCallback(
    (properties?: Record<string, any>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        trackEvent(eventName, properties)
        timeoutId = null
      }, debounceMs)
    },
    [trackEvent, eventName, debounceMs]
  )

  return trackInteraction
}
