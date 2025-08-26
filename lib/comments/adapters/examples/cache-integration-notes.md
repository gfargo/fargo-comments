# React Cache + TanStack Query Integration

## How They Work Together

The `CachedServerActionAdapter` and TanStack Query adapter are designed to be complementary, not conflicting:

### Server-Side (React cache())
- **Scope**: Single request deduplication
- **Duration**: Request lifetime only  
- **Purpose**: Prevent duplicate database calls during SSR/RSC
- **Example**: Multiple components calling `getCommentsBySource()` with same params

### Client-Side (TanStack Query)
- **Scope**: Client-side caching across requests
- **Duration**: Configurable (staleTime, gcTime)
- **Purpose**: Reduce unnecessary network requests
- **Example**: Navigating between pages, refetching data

## Integration Benefits

```typescript
// Server action with React cache (server-side)
export const getCommentsAction = cache(async (sourceId: string) => {
  // This will be called once per request, even if multiple components need it
  return db.comment.findMany({ where: { sourceId } })
})

// TanStack Query usage (client-side)  
const { data } = useQuery({
  queryKey: ['comments', sourceId],
  queryFn: () => fetch(`/api/comments?sourceId=${sourceId}`).then(r => r.json()),
  staleTime: 5 * 60 * 1000, // 5 minutes client cache
})
```

## Performance Impact

### Without React Cache
```
Request 1: Component A calls getComments() → DB Query
Request 1: Component B calls getComments() → DB Query (duplicate!)  
Request 1: Component C calls getComments() → DB Query (duplicate!)
```

### With React Cache  
```
Request 1: Component A calls getComments() → DB Query  
Request 1: Component B calls getComments() → Cached result
Request 1: Component C calls getComments() → Cached result
```

### With Both React Cache + TanStack Query
```
Request 1: SSR components → Single DB query (React cache)
Request 2: Client navigation → Cached response (TanStack Query)  
Request 3: After staleTime → Fresh fetch, single DB query (React cache)
```

## Configuration Recommendations

### For Next.js Apps with Server Actions
```typescript
// Recommended: Use both for optimal caching
const serverAdapter = new CachedServerActionAdapter({
  serverActions,
  enableCaching: true, // Server-side deduplication
})

const clientHooks = useTanstackQueryAdapter({
  apiEndpoint: '/api',
  // TanStack Query handles client-side caching
})
```

### Cache Key Strategy
Ensure cache keys align between server and client:

```typescript
// Server action cache key (implicit)
getCommentsBySource(sourceId, sourceType)

// TanStack Query cache key (explicit)  
queryKey: ['comments', 'bySource', sourceId, sourceType]
```

## Testing Compatibility

Run this test to verify no conflicts:

1. Enable both adapters
2. Make multiple requests with same parameters
3. Verify:
   - Server logs show single DB query per request
   - Client shows cached responses for repeated calls
   - No race conditions or stale data issues

The combination provides optimal performance at both server and client layers.