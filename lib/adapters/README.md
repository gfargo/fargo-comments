# Comment Storage Adapters

This directory contains a comprehensive adapter pattern implementation for comment storage, providing multiple storage backends with a unified interface. The adapter system allows you to easily switch between different storage solutions while maintaining the same API.

## Architecture Overview

All adapters implement the `CommentStorageAdapter` interface, which defines a consistent contract for:
- Comment CRUD operations
- Thread and reply handling
- Lexical editor state persistence
- Source-based comment filtering (using `sourceId`/`sourceType`)

## Available Adapters

### 1. LocalStorageAdapter
**File:** `local-storage-adapter.ts`  
**Use Case:** Client-side persistence, demos, prototypes, offline-first applications

\`\`\`typescript
import { LocalStorageAdapter } from '@/lib/adapters'

const adapter = new LocalStorageAdapter({
  enableDemoData: true
})
\`\`\`

**Features:**
- Browser localStorage persistence
- Automatic date serialization/deserialization
- Built-in demo users and data
- No backend required
- Perfect for development and demos

### 2. ApiAdapter
**File:** `api-adapter.ts`  
**Use Case:** Traditional REST API backends

\`\`\`typescript
import { ApiAdapter } from '@/lib/adapters'

const adapter = new ApiAdapter({
  apiEndpoint: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer token',
    'X-API-Key': 'your-key'
  }
})
\`\`\`

**Features:**
- HTTP REST API integration
- Configurable base URL and headers
- Full CRUD operations via API endpoints
- Error handling for failed requests
- Ideal for client-server architectures

### 3. ServerActionAdapter
**File:** `server-action-adapter.ts`  
**Use Case:** Next.js applications using server actions

\`\`\`typescript
import { ServerActionAdapter } from '@/lib/adapters'

const adapter = new ServerActionAdapter({
  enableDemoData: false
})
\`\`\`

**Features:**
- Leverages Next.js server actions
- Type-safe server-side operations
- Perfect for Next.js app router applications
- **Requires implementation of server action files**

**⚠️ Implementation Required:**
This adapter is a template that requires you to create your own server action files. You need to implement the following files in your project:

**`app/actions/comments.ts`**
\`\`\`typescript
'use server'

import type { Comment, CommentThread, User } from '@/types/comments'

export async function getCommentsAction(): Promise<Comment[]> {
  // Your database query logic here
  // Example: return await db.comments.findMany()
}

export async function addCommentAction(comment: Comment): Promise<void> {
  // Your database insert logic here
  // Example: await db.comments.create({ data: comment })
}

export async function updateCommentAction(commentId: string, updates: Partial<Comment>): Promise<void> {
  // Your database update logic here
  // Example: await db.comments.update({ where: { id: commentId }, data: updates })
}

export async function deleteCommentAction(commentId: string): Promise<void> {
  // Your database delete logic here
  // Example: await db.comments.delete({ where: { id: commentId } })
}

export async function addLexicalCommentAction(
  content: string,
  editorState: string,
  author: User,
  mentions: any[],
  tags: any[],
  sourceId?: string,
  sourceType?: string,
  parentId?: string,
): Promise<Comment> {
  // Your comment creation logic here with Lexical editor state
  // Example: return await db.comments.create({ data: { content, editorState, authorId: author.id, sourceId, sourceType, parentId } })
}

export async function getCommentsBySourceAction(sourceId: string, sourceType: string): Promise<Comment[]> {
  // Your filtered query logic here
  // Example: return await db.comments.findMany({ where: { sourceId, sourceType } })
}

// ... implement other required actions
\`\`\`

**Database Integration Examples:**
- **Prisma**: `await prisma.comments.findMany()`
- **Drizzle**: `await db.select().from(comments)`
- **Supabase**: `await supabase.from('comments').select('*')`
- **Direct SQL**: Your custom database queries

### 4. TanstackQueryAdapter
**File:** `tanstack-query-adapter.ts`  
**Use Case:** React applications requiring advanced caching and state management

\`\`\`typescript
import { useTanstackQueryAdapter } from '@/lib/adapters'

function MyComponent() {
  const adapter = useTanstackQueryAdapter({
    apiEndpoint: '/api',
    headers: { 'Content-Type': 'application/json' }
  })
  
  // Use hooks for optimal data fetching
  const { data: comments } = adapter.hooks.useComments()
  
  // Use mutations for updates
  const addComment = adapter.mutations.addComment
}
\`\`\`

**Features:**
- TanStack Query integration for caching
- Optimistic updates and automatic cache invalidation
- Both hook-based and traditional async interfaces
- Background refetching and error handling
- Ideal for complex React applications

## Usage with CommentProvider

Pass any adapter to the `CommentProvider` to use it throughout your application:

\`\`\`typescript
import { CommentProvider } from '@/contexts/comment-context'
import { LocalStorageAdapter, ApiAdapter } from '@/lib/adapters'

// Using LocalStorage (default)
<CommentProvider storageAdapter={new LocalStorageAdapter()}>
  <App />
</CommentProvider>

// Using API backend
<CommentProvider storageAdapter={new ApiAdapter({ apiEndpoint: '/api' })}>
  <App />
</CommentProvider>

// Using server actions
<CommentProvider storageAdapter={new ServerActionAdapter()}>
  <App />
</CommentProvider>
\`\`\`

## Factory Function

Use the `createStorageAdapter` factory for convenient adapter creation:

\`\`\`typescript
import { createStorageAdapter } from '@/lib/adapters'

const adapter = createStorageAdapter('localStorage', {
  enableDemoData: true
})

const apiAdapter = createStorageAdapter('api', {
  apiEndpoint: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' }
})
\`\`\`

## Generic Source System

All adapters support the generic source system using `sourceId` and `sourceType`:

\`\`\`typescript
// Comments can be associated with any entity type
await adapter.addLexicalComment(
  'Great point!',
  editorState,
  user,
  [], // mentions
  [], // tags
  'project-123', // sourceId
  'project', // sourceType
  parentId
)

// Filter comments by source
const projectComments = await adapter.getCommentsBySource('project-123', 'project')
const documentComments = await adapter.getCommentsBySource('doc-456', 'document')
\`\`\`

## Legacy Usage Note

The original `lib/comment-storage.ts` file is still used in some components but is being phased out in favor of the adapter pattern. Consider migrating remaining usages to use adapters for better consistency and maintainability.

## Creating Custom Adapters

Implement the `CommentStorageAdapter` interface to create custom storage solutions:

\`\`\`typescript
import { CommentStorageAdapter } from './comment-storage-adapter'

export class CustomAdapter implements CommentStorageAdapter {
  async getComments(): Promise<Comment[]> {
    // Your implementation
  }
  
  // ... implement all required methods
}
\`\`\`

This adapter system provides maximum flexibility while maintaining a consistent API across different storage backends.
