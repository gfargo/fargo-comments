# Analytics Implementation Guide

This document describes the comprehensive analytics system implemented in Fargo Comments using Vercel Analytics.

## Overview

The analytics system tracks user interactions, component usage, performance metrics, and errors across the entire application. It uses a centralized utility (`lib/analytics.ts`) for consistent event tracking with type-safe event definitions.

## Architecture

### Core Components

1. **`lib/analytics.ts`** - Server-side analytics utility with type-safe event tracking
2. **`lib/hooks/use-analytics.ts`** - Client-side React hooks for component tracking
3. **`app/_demo/components/global-error-tracker.tsx`** - Global error tracking component
4. **`app/_demo/components/analytics-error-boundary.tsx`** - React error boundary with analytics

## Event Categories

### 1. Registry & Distribution Events

Track component registry access and installations:

```typescript
// Registry index access
Analytics.trackRegistryAccess('registry_index', request, {
  file_count: components.length
})

// Component downloads
Analytics.trackComponentAccess('component-name', request, {
  action: 'install',
  adapter: 'server-actions'
})

// Component not found (404)
Analytics.trackComponentNotFound('invalid-component', request)
```

**Events:**
- `registry_accessed` - Registry index viewed
- `component_accessed` - Specific component downloaded
- `component_not_found` - 404 errors for missing components

**Metadata:**
- `component_name` - Which component was accessed
- `component_version` - Version being installed
- `file_count` - Number of files in component
- `dependency_count` - Number of dependencies
- `user_agent` - User's browser/package manager
- `referrer` - Source of traffic

### 2. Demo & Documentation Events

Track user engagement with demo features:

```typescript
// Client-side tracking
const { trackEvent } = useAnalytics()

trackEvent(AnalyticsEvents.DEMO_PAGE_VISITED, {
  demo_type: 'composer',
  action: 'navigate'
})

trackEvent(AnalyticsEvents.COMMENT_ACTION, {
  demo_type: 'live-demo',
  action: 'add',
  variant: 'card'
})
```

**Events:**
- `variant_viewed` - Design variant demonstrations
- `demo_page_visited` - Demo page navigation
- `adapter_example_viewed` - Storage adapter examples
- `comment_action` - CRUD operations in demos
- `composer_used` - Rich text editor usage

**Metadata:**
- `demo_type` - Which demo (composer, threads, live-demo)
- `action` - User action (add, edit, delete, reply, like, share)
- `variant` - Design variant used (card, bubble, timeline, etc.)
- `feature` - Specific feature used (emoji, mention, etc.)

### 3. User Journey & Conversion Events

Track user engagement and conversion signals:

```typescript
// Installation command copied
trackEvent(AnalyticsEvents.INSTALLATION_COMMAND_COPIED, {
  component_name: 'core',
  feature: 'Core System'
})

// Documentation links
trackEvent(AnalyticsEvents.DOCUMENTATION_OPENED, {
  demo_type: 'installation-card',
  feature: 'Database Schema Guide'
})

// GitHub repository visits
trackEvent(AnalyticsEvents.GITHUB_CLICKED, {
  demo_type: 'installation-card',
  action: 'external-link'
})
```

**Events:**
- `getting_started_clicked` - CTA clicks
- `documentation_opened` - Doc link clicks
- `github_clicked` - Repository visits
- `copy_code_clicked` - Code snippet copies
- `installation_command_copied` - Install command copies

### 4. Performance Metrics

Track component load times and bundle sizes:

```typescript
// Server-side performance tracking
const startTime = Date.now()
// ... perform operation ...
const loadTime = Date.now() - startTime

Analytics.trackPerformance(
  'component_load',
  loadTime,
  'ms',
  { component_name: 'core' }
)

// Bundle size tracking
Analytics.trackPerformance(
  'component_size',
  totalBytes,
  'bytes',
  { component_name: 'core' }
)
```

**Events:**
- `component_load_time` - How long components take to load
- `registry_index_load` - Registry index load time

**Metrics:**
- Load times (milliseconds)
- Bundle sizes (bytes)
- File counts

### 5. Error Tracking

Comprehensive error tracking across the application:

```typescript
// Server-side errors
Analytics.trackError(
  'registry_not_found',
  'Registry file does not exist',
  request,
  { component: 'registry_index' }
)

// Client-side errors (automatic)
// GlobalErrorTracker catches unhandled errors
// AnalyticsErrorBoundary catches React errors
```

**Events:**
- `registry_error` - All error types

**Error Types:**
- `registry_not_found` - Missing registry files
- `component_server_error` - Server errors
- `invalid_component_name` - Invalid input
- `file_not_found` - Missing source files
- `react_error` - React component errors
- `unhandled_error` - Global JavaScript errors
- `unhandled_rejection` - Promise rejections

## Usage Examples

### Server-Side API Routes

```typescript
import { Analytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Your logic here
    const data = await fetchData()

    // Track success
    await Analytics.trackRegistryAccess('registry_index', request, {
      file_count: data.length
    })

    // Track performance
    await Analytics.trackPerformance(
      'api_response_time',
      Date.now() - startTime,
      'ms'
    )

    return NextResponse.json(data)
  } catch (error) {
    // Track errors
    await Analytics.trackError(
      'api_error',
      error instanceof Error ? error.message : 'Unknown error',
      request
    )

    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

### Client-Side Components

```typescript
'use client'

import { useAnalytics } from '@/lib/hooks/use-analytics'
import { AnalyticsEvents } from '@/lib/analytics'

function MyComponent() {
  const { trackEvent } = useAnalytics()

  const handleAction = () => {
    // Track user action
    trackEvent(AnalyticsEvents.COMMENT_ACTION, {
      demo_type: 'my-component',
      action: 'button-click',
      variant: 'card'
    })

    // Your logic here
  }

  return <button onClick={handleAction}>Click me</button>
}
```

### Error Boundaries

```typescript
import { AnalyticsErrorBoundary } from '@/app/_demo/components/analytics-error-boundary'

function MyApp() {
  return (
    <AnalyticsErrorBoundary componentName="my-feature">
      <MyFeature />
    </AnalyticsErrorBoundary>
  )
}
```

## Data Privacy

The analytics system is designed with privacy in mind:

- **No PII Collection**: We don't collect personally identifiable information
- **Anonymous Sessions**: All tracking is anonymous
- **Aggregate Metrics**: Focus on aggregate usage patterns
- **Opt-out Respected**: Honors Do Not Track (DNT) headers

## Analytics Dashboard Insights

The tracked events enable you to answer key questions:

### Component Popularity
- Which components are most installed?
- Which design variants are most popular?
- Which storage adapters are most used?

### User Journey
- Where do users enter the site?
- Which demo pages are most engaging?
- What features are most explored?

### Performance
- How fast do components load?
- What are the bundle sizes?
- Are there performance bottlenecks?

### Error Monitoring
- What errors are users encountering?
- Which components are most error-prone?
- Are there missing files or broken links?

### Conversion Signals
- How many users copy install commands?
- Which documentation is most accessed?
- Are users clicking through to GitHub?

## Event Schema

All events follow a consistent schema:

```typescript
interface BaseEventProperties {
  timestamp: number        // Automatic
  user_agent?: string     // Automatic (server)
  referrer?: string       // Automatic
  path?: string          // Automatic
}

// Extended based on event type
interface RegistryEventProperties extends BaseEventProperties {
  type: 'registry_index' | 'component_download' | 'component_search'
  component_name?: string
  component_version?: string
  file_count?: number
  dependency_count?: number
}
```

## Best Practices

1. **Track User Intent**: Focus on tracking actions that indicate user intent and value
2. **Consistent Naming**: Use `AnalyticsEvents` constants for type safety
3. **Rich Metadata**: Include context to make events actionable
4. **Error Context**: Include enough detail to debug errors
5. **Performance Impact**: Analytics tracking is async and fails silently
6. **Test Events**: Verify events in Vercel Analytics dashboard

## Future Enhancements

Potential additions to the analytics system:

- **A/B Testing**: Variant testing for features
- **Cohort Analysis**: User segmentation and retention
- **Funnel Tracking**: Multi-step conversion funnels
- **Session Replay**: Visual debugging for errors
- **Custom Dashboards**: Real-time analytics views
