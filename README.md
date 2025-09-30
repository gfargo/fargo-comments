# Fargo Comments

An open source, production-ready React commenting system built with Next.js, TypeScript, and Lexical editor. Batteries not included - bring your own storage, authentication, and styling preferences. Perfect for modern web applications requiring sophisticated commenting functionality.

## 📚 Documentation

This repository contains several specialized README files for different aspects of the system:

- **[Context Providers Guide](lib/contexts/README.md)** - A guide to the core state management providers, including the event and hook systems.
- **[Custom Hooks Guide](lib/hooks/README.md)** - An overview of the custom React hooks.
- **[Comment Components Guide](lib/components/comments/README.md)** - An overview of the core UI components for rendering comments.
- **[Lexical Editor Guide](lib/components/lexical/README.md)** - Complete guide to rich text editing, plugins, and customizations.
- **[Storage Adapters Guide](lib/comments/adapters/README.md)** - Comprehensive guide to all storage adapter implementations.
- **[Database Schema Guide](README-SCHEMA.md)** - Database requirements and Prisma schema for production deployment.

## 🚀 Features

### Rich Text Editing

- **Lexical Editor Integration**: Powered by Meta's Lexical editor with full rich text capabilities.
- **Auto-List Creation**: Type `-` for bullet lists or `1.` for numbered lists.
- **Automatic Link Detection**: URLs and email addresses are automatically converted to clickable links.
- **Emoji Search**: Type `:` followed by search terms for instant emoji insertion with smart positioning.
- **@Mentions & #Tags**: Smart mention system with async user/tag loading. Connect to any data source for users and taggable entities through a dedicated context provider.
- **Inline Editing**: Edit comments in-place with auto-clearing composers.

### Design System

- **12+ Design Variants**: Card, bubble, timeline, GitHub, social, professional, mobile, and more.
- **Responsive Design**: Mobile-first approach with adaptive layouts.
- **Theme Support**: Built-in light/dark mode with CSS custom properties.
- **Tailwind CSS v4**: Modern styling with semantic design tokens.

### Comment Threading

- **Flat Thread Architecture**: Prevents deep nesting while maintaining visual hierarchy.
- **Smart Reply System**: Replies to replies become replies to the parent.
- **Visual Indentation**: Clear conversation flow with proper spacing.

### Storage & Data Management

- **Adapter Pattern**: Pluggable storage system supporting multiple backends.
- **Schema Flexibility**: Designed to integrate with existing User models without requiring modifications to your tables. The system only needs an `authorId` on a comment.
- **Local Storage**: Default localStorage implementation for demos.
- **Server Actions**: Next.js server action adapter for database integration.
- **Tanstack Query**: React Query adapter with caching and optimistic updates.
- **API Integration**: RESTful API adapter for external services.

### Extensibility
- **Event System**: Subscribe to comment lifecycle events (e.g., `comment:added`) to trigger side effects like notifications or analytics.
- **Hook System**: Intercept and modify data at key points (e.g., `beforeAddComment`) for validation, moderation, or adding custom metadata.

## 📁 Project Structure

```plaintext
├── app/
│   ├── _demo/                   # Demo components and data
│   ├── api/                     # Component registry API routes
│   │   ├── registry/            # Registry manifest and component definitions
│   │   └── templates/           # Serves component source files
│   └── ...                      # Other demo pages (composer, threads)
├── components/
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── comments/                # Main commenting system (registry-ready)
│   │   ├── adapters/            # Storage adapter implementations
│   │   │   ├── api-adapter.ts       # Implements storage via REST API calls
│   │   │   ├── comment-storage-adapter.ts # The interface all adapters must implement
│   │   │   ├── cached-server-action-adapter.ts # React cache() integration
│   │   │   ├── index.ts             # Exports all adapters and factory function
│   │   │   ├── local-storage-adapter.ts # Browser localStorage implementation
│   │   │   ├── server-action-adapter.ts # Next.js Server Actions integration
│   │   │   └── tanstack-query-adapter.ts # TanStack Query with caching
│   │   ├── components/
│   │   │   ├── comments/            # High-level comment components
│   │   │   │   ├── comment-list.tsx     # Main comment listing component
│   │   │   │   ├── comment-search.tsx   # Search and filtering
│   │   │   │   ├── comment-drawer.tsx   # Sidebar/drawer component
│   │   │   │   ├── variants/            # 12+ design variants
│   │   │   │   └── ...
│   │   │   └── lexical/             # Rich text editor implementation
│   │   │       ├── lexical-comment-composer.tsx
│   │   │       ├── plugins/             # Auto-lists, emoji, mentions
│   │   │       └── utils/
│   │   ├── contexts/
│   │   │   ├── comment-context.tsx  # Central state management
│   │   │   └── mention-context.tsx  # @mentions and #tags data
│   │   ├── hooks/                   # React hooks for comment functionality
│   │   ├── types/                   # TypeScript definitions
│   │   ├── reducers/                # State management
│   │   ├── utils/                   # Utility functions
│   │   ├── comment-events.ts        # Event system
│   │   └── lexical-utils.ts         # Lexical editor utilities
│   └── utils.ts                 # General utility functions
├── registry/                    # Generated component registry
│   ├── r/                       # Component definitions (JSON)
│   └── registry.json            # Registry manifest
├── scripts/                     # Registry generation and maintenance
│   ├── registry.config.mjs      # Registry configuration
│   ├── gen-registry.mjs         # Registry generator
│   └── sync-registry-deps.mjs   # Dependency synchronization
└── public/                      # Static assets
```

## 🎯 Usage Example

```tsx
import { CommentList } from '@/lib/components/comments/comment-list';
import { CommentProvider } from '@/lib/contexts/comment-context';
import { MentionProvider } from '@/lib/contexts/mention-context';
import { LocalStorageAdapter } from '@/lib/comments/adapters';

const myCurrentUser = { id: 'user-1', name: 'Jane Doe', ... };
const myStorageAdapter = new LocalStorageAdapter();

// Example functions to fetch your application's data
async function fetchMyUsers() { /* ... */ }
async function fetchMyTaggableItems() { /* ... */ }

function MyApp() {
  return (
    <MentionProvider
      getUsersCallback={fetchMyUsers}
      getTagsCallback={fetchMyTaggableItems}
    >
      <CommentProvider
        currentUser={myCurrentUser}
        storageAdapter={myStorageAdapter}
      >
        <CommentList
          sourceId="document-123"
          sourceType="document"
          variant="card"
        />
      </CommentProvider>
    </MentionProvider>
  );
}
```

## 🔧 Installation & Setup

### For Users: Install into Your Project

Add Fargo Comments to your existing application using our ShadcnUI-compatible registry:

```bash
# Install the core commenting system
npx shadcn@latest add https://comments.griffen.codes/r/core

# Add the comment list component
npx shadcn@latest add https://comments.griffen.codes/r/comment-list

# Optional: Add specific storage adapters
npx shadcn@latest add https://comments.griffen.codes/r/adapter-server-actions
npx shadcn@latest add https://comments.griffen.codes/r/adapter-api
```

**Available Components:**
- `core` - Essential commenting system (contexts, hooks, types, lexical editor)
- `comment-list` - Main comment list component with search
- `drawer` - Comment drawer/sidebar component
- `adapter-server-actions` - Next.js Server Actions storage adapter
- `adapter-api` - REST API storage adapter
- `adapter-tanstack-query` - TanStack Query storage adapter

For detailed registry usage, configuration, and integration examples, see the **[Component Registry Guide](README-REGISTRY.md)**.

### For Developers: Contributing to the Project

```bash
# Clone the repository
git clone <repository-url>
cd fargo-comments

# Install dependencies
pnpm install

# Run development server
npm run dev
```

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

## 🚀 Production Deployment

For production deployment with database integration, see the [Database Schema Guide](README-SCHEMA.md) for complete setup instructions.

## 🏢 About Fargo

Fargo builds modern tools for regulatory compliance and brand protection. Our flagship product, **Auditor**, helps CPG brands achieve regulatory compliance, examine label elements for accuracy, and use best practices to protect brand equity.

**Fargo Comments** was born from our need for a flexible, domain-agnostic commenting system that could work across different types of content - from audit findings to project discussions to document reviews.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Meta Lexical** - Rich text editing framework
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Tanstack Query** - Data fetching and caching
- **Next.js** - React framework

---

Built with ❤️ by [Fargo](https://fargo.com) for modern web applications requiring sophisticated commenting systems.