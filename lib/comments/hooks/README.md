# Custom Hooks

This document provides an overview of the custom React hooks used within the Fargo Comment System. These hooks encapsulate logic for state management, user actions, and data retrieval, promoting code reuse and separation of concerns.

## 📁 Directory Structure

```plaintext
hooks/
├── use-comment-actions.ts      # Manages all user interactions and comment-related side effects.
├── use-comment-config.ts       # Manages the configuration state for the comment system.
├── use-comment-context-hooks.ts# Manages the registration and execution of lifecycle hooks.
└── use-comments-from-source.ts # A data-fetching hook to retrieve comments for a specific source.
```

## Hook Breakdown

### `useCommentActions`

This is a comprehensive hook that centralizes all the actions a user can perform on comments. It connects to the `useComments` context to dispatch actions and handles side effects like showing toasts and managing UI state (e.g., which comment is being replied to).

**Key Responsibilities:**
-   Wrapping core context actions (`addComment`, `updateComment`, `deleteComment`) with transition states (`isPending`) and user feedback (toasts).
-   Managing the reply flow state (`replyingTo`, `handleStartReply`, `handleCancelReply`).
-   Implementing the flat-threading logic by finding the root parent of a reply.
-   Providing simplified handlers for variant-specific actions like `handleLike` and `handleShare`.

### `useCommentsFromSource`

A data-fetching hook that simplifies retrieving comments associated with a specific entity.

**Key Features:**
-   Takes a `sourceId` and optional `sourceType` as arguments.
-   Uses `useComments` to get the full list of comments and filters them based on the source.
-   Memoizes the result for performance.
-   Returns derived statistics, such as `totalComments` and `unresolvedCount`.

**Usage Example:**
```tsx
const { comments, totalComments, loading } = useCommentsFromSource('document-123');
```

### `useCommentConfig`

This hook manages the configuration object for the entire comment system. It initializes the default configuration and provides a function to update it.

**Key Features:**
-   Holds the active `variant`, editor `features`, and `placeholder` text.
-   Provides an `updateConfig` function that allows for dynamic changes to the UI and features (e.g., changing the theme or disabling emojis at runtime).

### `useCommentContextHooks`

This internal hook is responsible for managing the lifecycle hook system within the `CommentProvider`.

**Key Responsibilities:**
-   Initializes the hook registry with any hooks passed to the `CommentProvider`.
-   Provides the `executeHooks` function that runs registered callbacks at the appropriate lifecycle event (e.g., `beforeAddComment`).
-   Creates the `context` object that is passed to every hook callback.
