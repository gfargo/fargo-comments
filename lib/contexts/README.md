# Context Providers

This document provides a detailed overview of the React Context providers that power the Okayd Comment System. These providers are the primary mechanism for managing state and injecting application-specific data into the comment components.

## Architecture Overview

The system relies on two core providers:

1.  **`CommentProvider`**: Manages the state of all comments, handles data persistence through a storage adapter, and exposes actions for creating, updating, and deleting comments. It also includes a powerful event and hook system for extensibility.
2.  **`MentionProvider`**: Manages the data for `@mentions` and `#tags`, allowing developers to supply their own user and entity data from any source.

These providers should be wrapped around your application or the specific components that will use the comment system.

---

## `CommentProvider`

The `CommentProvider` is the central hub for the entire comment system. It is **required** for any comment functionality to work.

### Props

| Prop              | Type                    | Description                                                                                                                            |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `children`        | `React.ReactNode`       | **Required.** The child components that will have access to the context.                                                               |
| `currentUser`     | `User \| null`          | **Required.** The user object for the currently authenticated user. The system is stateless regarding users; you must provide this.     |
| `storageAdapter`  | `CommentStorageAdapter` | An instance of a storage adapter (e.g., `LocalStorageAdapter`, `ApiAdapter`). Defaults to `LocalStorageAdapter` if not provided.         |
| `initialComments` | `Comment[]`             | An optional array of comments to initialize the state with. This is useful for server-side rendering (SSR).                            |
| `config`          | `CommentConfig`         | An optional configuration object to customize features like the default variant and available editor plugins.                          |
| `hooks`           | `Partial<CommentHooks>` | An optional object of hook functions to extend or modify the system's behavior at key lifecycle events.                                |

### Usage Example

\`\`\`tsx
import { CommentProvider } from '@/lib/contexts/comment-context';
import { LocalStorageAdapter } from '@/lib/adapters';
import { CommentList } from '@/lib/components/comments/comment-list';

const myCurrentUser = { id: 'user-1', name: 'Jane Doe', ... };
const myStorageAdapter = new LocalStorageAdapter();

function App() {
  return (
    <CommentProvider
      currentUser={myCurrentUser}
      storageAdapter={myStorageAdapter}
    >
      <CommentList sourceId="document-123" sourceType="document" />
    </CommentProvider>
  );
}
\`\`\`

### Interacting with the Context

Use the `useComments()` hook to access the context's state and methods from any child component.

\`\`\`tsx
import { useComments } from '@/lib/contexts/comment-context';

function MyComponent() {
  const { state, currentUser, addComment } = useComments();
  // ...
}
\`\`\`

---

## Extensibility

The `CommentProvider` includes two powerful systems for extending its core functionality: an **Event System** for listening to actions, and a **Hook System** for modifying data and behavior.

### Event System

The event system allows you to listen for actions that have occurred within the comment system. This is ideal for triggering side effects like sending notifications, updating analytics, or logging.

**Available Events:**
- `comment:added`
- `comment:updated`
- `comment:deleted`
- `reaction:added`
- `reaction:removed`
- `comments:loaded`
- `error`

**Usage:**

Use the `useCommentEvent` hook to subscribe to an event within any component wrapped by `CommentProvider`.

\`\`\`tsx
import { useCommentEvent } from '@/lib/contexts/comment-context';

function NotificationPlugin() {
  useCommentEvent('comment:added', ({ comment, user }) => {
    console.log(`New comment from ${user.name}: "${comment.content}"`);
    // Trigger a push notification or analytics event
  });

  return null; // This component does not render anything
}
\`\`\`

### Hook System

The hook system allows you to intercept and modify data at key points in the comment lifecycle. This is useful for data validation, content moderation, or adding custom metadata.

**Available Hooks:**
- `beforeAddComment`
- `afterAddComment`
- `beforeUpdateComment`
- `afterUpdateComment`
- `beforeSaveComment`
- `afterSaveComment`

**Usage:**

Pass a `hooks` object to the `CommentProvider`. Each hook is an async function that receives the data and a context object, and can return modified data.

\`\`\`tsx
import { CommentProvider } from '@/lib/contexts/comment-context';

const myCommentHooks = {
  beforeSaveComment: async (data, context) => {
    // Add a custom metadata field to every comment before it's saved
    const enrichedComment = {
      ...data.comment,
      customData: { processedAt: new Date().toISOString() },
    };
    return { comment: enrichedComment };
  },
};

function App() {
  return (
    <CommentProvider hooks={myCommentHooks} currentUser={...}>
      {/* ... */}
    </CommentProvider>
  );
}
\`\`\`

---

## `MentionProvider`

The `MentionProvider` is responsible for supplying the data used in the Lexical editor's `@mention` and `#tag` functionality.

### Purpose

-   Decouples the comment system from any specific user or entity data source.
-   Provides a centralized, asynchronous way to load data for mentions and tags.
-   Allows developers to "bring their own users" and taggable entities.

### Props

| Prop               | Type                          | Description                                                                                             |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `children`         | `React.ReactNode`             | **Required.** The child components that will have access to the context.                                |
| `initialUsers`     | `MentionUser[]`               | An optional array of users to pre-populate the mention list, useful for SSR.                            |
| `initialTags`      | `MentionTag[]`                | An optional array of tags to pre-populate the tag list, useful for SSR.                                 |
| `getUsersCallback` | `() => Promise<MentionUser[]>` | A callback function that returns a promise resolving to an array of users for `@mentions`.              |
| `getTagsCallback`  | `() => Promise<MentionTag[]>`  | A callback function that returns a promise resolving to an array of entities for `#tags`.               |

### Usage Example

\`\`\`tsx
import { MentionProvider } from '@/lib/contexts/mention-context';

// Example functions to fetch your application's data
async function fetchMyUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  // Transform the data to match the MentionUser interface
  return users.map(user => ({ id: user.uuid, value: user.username, ... }));
}

async function fetchMyDocuments() {
  const response = await fetch('/api/documents');
  const docs = await response.json();
  // Transform the data to match the MentionTag interface
  return docs.map(doc => ({ id: doc.id, value: doc.title, type: 'document' }));
}

function App() {
  return (
    <MentionProvider
      getUsersCallback={fetchMyUsers}
      getTagsCallback={fetchMyDocuments}
    >
      {/* The rest of your application, including the CommentProvider */}
    </MentionProvider>
  );
}
\`\`\`
