# Comment Components

This directory contains the core React components responsible for rendering and managing the comment system's UI. The architecture is designed to be modular, variant-driven, and highly extensible.

## 📁 Directory Structure

\`\`\`plaintext
├── variants/                       # Directory for all visual styles of a single comment
├── comment-action-bar.tsx          # Renders the row of buttons (Like, Reply, Edit, etc.)
├── comment-drawer.tsx              # A slide-out panel for displaying a global comment list
├── comment-list.tsx                # The main component for rendering a list/thread of comments
├── comment-search.tsx              # Provides search and filtering functionality
├── comment-source-reference.tsx    # Renders the "Referenced" block within a comment
├── comment-variations.tsx          # A wrapper that dynamically renders the correct comment variant
└── delete-confirmation-dialog.tsx  # A modal dialog for confirming comment deletion
\`\`\`

## Component Breakdown

### `comment-list.tsx`

This is the primary component for displaying a collection of comments. It orchestrates the rendering of the composer, search/filter controls, and the list of comments themselves.

**Key Features:**
- Renders a list of comments in a flat-threaded view.
- Integrates the `LexicalCommentComposer` for adding new comments.
- Includes optional `CommentSearch` and sorting controls.
- Manages the state for replying to a specific comment.

### `comment-variations.tsx`

This component acts as a router for displaying a single comment. It takes a `variant` prop and dynamically renders the corresponding component from the `variants/` directory. This makes it easy to switch the entire look and feel of the comment system by changing a single prop.

**Available Variants:**
- `card`
- `bubble`
- `timeline`
- `compact`
- `plain`
- `social`
- `professional`
- `clean`
- `thread`
- `github`
- `email`
- `notion`
- `mobile`

### `comment-action-bar.tsx`

This component renders the set of actions available on a comment (e.g., Like, Reply, Edit, Delete). It is highly dynamic and adjusts its appearance and available buttons based on the current `variant` and user permissions.

### `variants/`

This directory holds the individual React components for each visual style of a comment. Each variant component is responsible for its own layout and styling, but they all share common child components like `CommentActionBar` and `LexicalReadOnlyRenderer`.

### `comment-drawer.tsx`

A specialized component that uses a slide-out sheet (`shadcn/ui`) to display a `CommentList`. This is useful for providing a global, easily accessible view of all comments related to a page or application.

### `comment-search.tsx`

Provides a user interface for full-text search and filtering of comments by author, date range, and status. It receives the full list of comments and returns the filtered list to its parent (`CommentList`).

### `comment-source-reference.tsx`

A small, reusable component dedicated to rendering the `sourceReference` block that can appear on a comment. It adapts its styling based on the parent comment's `variant`.

### `delete-confirmation-dialog.tsx`

A modal dialog that asks the user to confirm before deleting a comment. It also handles the case where a comment cannot be deleted because it has replies.
