# Comment Storage Adapters

This document provides a comprehensive overview of the storage adapter pattern used in the Okayd Comment System. The adapters provide a unified interface for data persistence, allowing developers to easily integrate their preferred backend.

## Architecture Overview

All adapters implement the `CommentStorageAdapter` interface, which defines a consistent contract for all comment-related data operations. The system is intentionally decoupled from user and other entity management; its sole focus is on the persistence of comments.

The core responsibilities defined by the interface are:
- Comment CRUD (Create, Read, Update, Delete) operations.
- Handling for rich text content via Lexical editor state.
- Fetching comment threads and replies.
- Filtering comments based on a generic `sourceId` and `sourceType`.

## Available Adapters

### 1. LocalStorageAdapter
**File:** `local-storage-adapter.ts`  
**Use Case:** Ideal for client-side persistence, demos, prototypes, and offline-first applications. It requires no backend setup.

\`\`\`typescript
import { LocalStorageAdapter } from '@/lib/adapters'
const adapter = new LocalStorageAdapter();
\`\`\`

### 2. ApiAdapter
**File:** `api-adapter.ts`  
**Use Case:** For applications with a traditional REST or GraphQL API backend.

\`\`\`typescript
import { ApiAdapter } from '@/lib/adapters'
const adapter = new ApiAdapter({
  apiEndpoint: 'https://api.example.com/comments',
  headers: { 'Authorization': 'Bearer your_token' }
});
\`\`\`

### 3. ServerActionAdapter
**File:** `server-action-adapter.ts`  
**Use Case:** For Next.js applications utilizing Server Actions for data mutations. This adapter serves as a template, and you must implement the actual server action functions.

\`\`\`typescript
// In your app/actions/comments.ts
'use server'
import type { Comment } from '@/lib/types/comments'

export async function addLexicalCommentAction(/*...args*/): Promise<Comment> {
  // Your database logic here (e.g., using Prisma or Drizzle)
}

// ... other actions
\`\`\`

### 3.1. CachedServerActionAdapter
**File:** `cached-server-action-adapter.ts`  
**Use Case:** Enhanced server action adapter that uses React's `cache()` to deduplicate read operations within a single request. Perfect for server-side rendering and preventing duplicate database queries.

\`\`\`typescript
import { CachedServerActionAdapter, type ServerActionSet } from '@/lib/adapters'
import { serverActions } from '@/app/actions/comments' // Your implementations

const adapter = new CachedServerActionAdapter({
  serverActions,
  enableCaching: true, // default: true
})

// In your app/actions/comments.ts
'use server'
export const serverActions: ServerActionSet = {
  getCommentsAction: async () => {
    // This will be cached by React cache()
    return db.comment.findMany(/* ... */)
  },
  // ... other actions
}
\`\`\`

**Benefits:**
- Automatic deduplication of read operations within a single request
- Plays well with TanStack Query for client-side caching
- Zero configuration caching for server-side operations
- Maintains the same interface as other adapters

### 4. TanstackQueryAdapter
**File:** `tanstack-query-adapter.ts`  
**Use Case:** For applications using TanStack Query for advanced data fetching, caching, and state management. It provides hooks for queries and mutations.

\`\`\`typescript
import { useTanstackQueryAdapter } from '@/lib/adapters'

function MyComponent() {
  const adapter = useTanstackQueryAdapter({ apiEndpoint: '/api' });
  const { data: comments } = adapter.hooks.useComments();
  const addComment = adapter.mutations.addComment;
}
\`\`\`

## Usage with CommentProvider

To activate an adapter, pass an instance of it to the `CommentProvider`.

\`\`\`typescript
import { CommentProvider } from '@/lib/contexts/comment-context'
import { ApiAdapter, CachedServerActionAdapter } from '@/lib/adapters'
import { serverActions } from '@/app/actions/comments'

// Using API adapter
<CommentProvider storageAdapter={new ApiAdapter({ apiEndpoint: '/api' })}>
  <YourApp />
</CommentProvider>

// Using cached server actions (recommended for Next.js)
<CommentProvider storageAdapter={new CachedServerActionAdapter({ serverActions })}>
  <YourApp />
</CommentProvider>
\`\`\`

## Generic Source System

All adapters use a generic source system to associate comments with any entity in your application. This is achieved with `sourceId` and `sourceType`.

\`\`\`typescript
// Associate a comment with a specific project document
await adapter.addLexicalComment(
  content,
  editorState,
  currentUser,
  [], // mentions
  [], // tags
  'doc-123',    // sourceId: The ID of the document
  'document',   // sourceType: The type of entity
);

// Retrieve all comments for that document
const documentComments = await adapter.getCommentsBySource('doc-123', 'document');
\`\`\`

## Creating a Custom Adapter

You can create your own adapter by implementing the `CommentStorageAdapter` interface. This is useful for connecting to different database types, GraphQL, or other backend services.

\`\`\`typescript
import { CommentStorageAdapter } from './comment-storage-adapter'

export class MyCustomAdapter implements CommentStorageAdapter {
  async getComments(): Promise<Comment[]> {
    // Your custom implementation
  }
  
  // ... implement all other required methods
}
\`\`\`
