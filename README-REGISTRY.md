# Component Registry Guide

This guide covers the comprehensive component registry system for Fargo Comments, which allows users to install components into their projects using the ShadcnUI CLI pattern.

## 📦 Overview

The Fargo Comments registry provides a ShadcnUI-compatible component distribution system that allows developers to:
- Install specific components rather than the entire library
- Get automatic dependency management
- Maintain consistent import paths across projects
- Integrate seamlessly with existing ShadcnUI workflows

## 🚀 Quick Start

### Prerequisites

Ensure your project has ShadcnUI configured:

```bash
# Initialize ShadcnUI in your project (if not already done)
npx shadcn@latest init
```

Your `components.json` should include the following aliases:
```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib",
    "lib": "@/lib"
  }
}
```

### Installation Commands

```bash
# Core commenting system (required first)
npx shadcn@latest add https://commentsby.griffen.codes/r/core

# Comment list with search functionality
npx shadcn@latest add https://commentsby.griffen.codes/r/comment-list

# Comment drawer/sidebar component
npx shadcn@latest add https://commentsby.griffen.codes/r/drawer

# Storage adapters (choose based on your backend)
npx shadcn@latest add https://commentsby.griffen.codes/r/adapter-server-actions
npx shadcn@latest add https://commentsby.griffen.codes/r/adapter-api
npx shadcn@latest add https://commentsby.griffen.codes/r/adapter-tanstack-query
```

## 📚 Available Components

### Core System (`fargo-comments-core`)

**What it includes:**
- Context providers (`CommentProvider`, `MentionProvider`)
- Custom hooks for comment management
- TypeScript types and interfaces
- Lexical editor with plugins and configuration
- Comment variants system (12+ design options)
- Event and hook systems
- Base storage adapter interface
- Utility functions

**Dependencies installed:**
```json
{
  "lexical": "latest",
  "@lexical/react": "latest",
  "@lexical/link": "latest",
  "@lexical/list": "latest",
  "@lexical/utils": "latest",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.5",
  "class-variance-authority": "^0.7.1",
  "lexical-beautiful-mentions": "latest",
  "@emoji-mart/data": "latest",
  "emoji-mart": "latest",
  "lucide-react": "^0.454.0",
  "date-fns": "4.1.0"
}
```

### Comment List (`fargo-comments-comment-list`)

**What it includes:**
- `CommentList` component with full functionality
- `CommentSearch` component for filtering
- Built-in composer integration
- Sort and filter controls

**Registry dependencies:** `core`

### Comment Drawer (`fargo-comments-drawer`)

**What it includes:**
- `CommentDrawer` sidebar component
- Responsive drawer behavior
- Integration with comment list

**Registry dependencies:** `core`, `comment-list`

### Storage Adapters

#### Server Actions Adapter (`fargo-comments-adapter-server-actions`)

**What it includes:**
- `ServerActionAdapter` for Next.js Server Actions
- `CachedServerActionAdapter` with React cache integration
- TypeScript interfaces and examples

**Registry dependencies:** `core`

#### API Adapter (`fargo-comments-adapter-api`)

**What it includes:**
- `ApiAdapter` for REST API integration
- Configurable endpoints and request handling

**Registry dependencies:** `core`

#### TanStack Query Adapter (`fargo-comments-adapter-tanstack-query`)

**What it includes:**
- `TanstackQueryAdapter` with caching and optimistic updates
- React Query integration patterns

**Additional dependencies:** `@tanstack/react-query: ^5.0.0`
**Registry dependencies:** `core`

## 🏗️ Integration Examples

### Basic Setup

After installing the core system and comment list:

```tsx
// app/page.tsx
import { CommentProvider } from "@/lib/comments/contexts/comment-context";
import { MentionProvider } from "@/lib/comments/contexts/mention-context";
import { CommentList } from "@/lib/comments/components/comments/comment-list";
import { LocalStorageAdapter } from "@/lib/comments/adapters";

const currentUser = { 
  id: "user-1", 
  name: "Jane Doe", 
  email: "jane@example.com",
  avatar: "/avatars/jane.jpg"
};

const storageAdapter = new LocalStorageAdapter();

export default function CommentsPage() {
  return (
    <MentionProvider
      getUsersCallback={fetchUsers}
      getTagsCallback={fetchTags}
    >
      <CommentProvider
        currentUser={currentUser}
        storageAdapter={storageAdapter}
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

// Your data fetching functions
async function fetchUsers(query: string) {
  // Return users matching the query
  return users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
}

async function fetchTags(query: string) {
  // Return tags matching the query
  return tags.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
}
```

### With Server Actions

After installing the server actions adapter:

```tsx
// app/actions/comments.ts
"use server";

import { Comment } from "@/lib/comments/types/comments";

export async function getComments(): Promise<Comment[]> {
  // Your database logic
  return await db.comment.findMany();
}

export async function addComment(comment: Comment): Promise<void> {
  // Your database logic
  await db.comment.create({ data: comment });
}

// ... other actions

// app/page.tsx
import { CachedServerActionAdapter } from "@/lib/comments/adapters";
import * as commentActions from "./actions/comments";

const serverActionAdapter = new CachedServerActionAdapter(commentActions);

export default function Page() {
  return (
    <CommentProvider
      currentUser={currentUser}
      storageAdapter={serverActionAdapter}
    >
      {/* Your components */}
    </CommentProvider>
  );
}
```

### With API Integration

After installing the API adapter:

```tsx
import { ApiAdapter } from "@/lib/comments/adapters";

const apiAdapter = new ApiAdapter({
  baseUrl: "https://api.yourapp.com",
  endpoints: {
    getComments: "/comments",
    addComment: "/comments",
    updateComment: "/comments/:id",
    deleteComment: "/comments/:id",
  },
});

export default function Page() {
  return (
    <CommentProvider
      currentUser={currentUser}
      storageAdapter={apiAdapter}
    >
      {/* Your components */}
    </CommentProvider>
  );
}
```

## 🎨 Customization

### Design Variants

The core system includes 12+ pre-built design variants:

```tsx
<CommentList variant="card" />      {/* Card-based design */}
<CommentList variant="bubble" />    {/* Chat bubble style */}
<CommentList variant="github" />    {/* GitHub-style comments */}
<CommentList variant="notion" />    {/* Notion-style design */}
<CommentList variant="timeline" />  {/* Timeline layout */}
<CommentList variant="mobile" />    {/* Mobile-optimized */}
```

### Event System Integration

```tsx
import { useCommentEvent } from "@/lib/comments/hooks/use-comment-context-hooks";

function MyComponent() {
  useCommentEvent("comment:added", ({ comment, user }) => {
    // Trigger notifications
    toast.success(`New comment from ${user.name}`);
    
    // Send to analytics
    analytics.track("Comment Added", {
      commentId: comment.id,
      sourceId: comment.sourceId,
    });
  });

  useCommentEvent("comment:updated", ({ comment }) => {
    // Handle comment updates
    console.log("Comment updated:", comment.id);
  });

  return <CommentList />;
}
```

### Hook System for Validation

```tsx
const hooks = {
  beforeAddComment: async (data, context) => {
    // Custom validation
    if (data.comment.content.length < 10) {
      throw new Error("Comment too short");
    }
    
    // Add custom metadata
    const enrichedComment = {
      ...data.comment,
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }
    };
    
    return { comment: enrichedComment };
  }
};

<CommentProvider hooks={hooks}>
  {/* Components */}
</CommentProvider>
```

## 🔧 Registry Architecture

### File Organization

All registry components are installed under the `@/lib/comments/` directory:

```
@/lib/comments/
├── adapters/           # Storage adapters
├── components/
│   ├── comments/       # Comment UI components
│   └── lexical/        # Rich text editor
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── reducers/           # State management
└── utils/              # Utility functions
```

### Dependency Management

The registry automatically:
- Installs required npm dependencies
- Resolves component dependencies (e.g., `drawer` depends on `comment-list`)
- Maintains consistent import paths
- Updates dependencies to match your project's versions

### Development Workflow

For maintainers working on the registry:

```bash
# Sync registry dependencies with package.json
npm run sync:registry-deps

# Auto-update dependencies
npm run sync:registry-deps:auto

# Generate registry files
npm run gen:registry

# Build (includes registry generation)
npm run build
```

The registry is automatically generated and kept in sync with the codebase through:
- Pre-build hooks that update dependencies
- Automated file scanning and component mapping
- Version synchronization with package.json

### Custom Registry Configuration

The registry configuration is defined in `scripts/registry.config.mjs`:

```javascript
export default {
  outDir: "registry",
  baseUrl: "https://commentsby.griffen.codes",
  defaults: {
    dependencies: {
      // Shared dependencies across all components
    }
  },
  items: [
    // Component definitions with include/exclude patterns
  ]
};
```

## 🚀 API Endpoints

The registry is served through Next.js API routes:

- **Registry Manifest**: `https://commentsby.griffen.codes/api/registry`
- **Component Definitions**: `https://commentsby.griffen.codes/api/registry/r/{component}`
- **Source Files**: `https://commentsby.griffen.codes/api/templates/{filepath}`

### Example Responses

**Registry Manifest** (`/api/registry`):
```json
{
  "registry": [
    {
      "name": "fargo-comments-core",
      "item": "https://commentsby.griffen.codes/r/core",
      "file": "r/core.json",
      "type": "components"
    }
  ]
}
```

**Component Definition** (`/api/registry/r/core`):
```json
{
  "name": "fargo-comments-core",
  "type": "components",
  "dependencies": {
    "lexical": "latest",
    "@lexical/react": "latest"
  },
  "files": [
    {
      "from": "lib/comments/contexts/comment-context.tsx",
      "to": "@/lib/comments/contexts/comment-context.tsx"
    }
  ]
}
```

## 🛠️ Troubleshooting

### Common Issues

**Import Resolution Errors**
```bash
# Ensure your components.json has the correct aliases
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib",
    "lib": "@/lib"
  }
}
```

**Missing Dependencies**
```bash
# Install peer dependencies manually if needed
npm install @radix-ui/react-dialog @radix-ui/react-select
```

**TypeScript Errors**
```bash
# Ensure TypeScript paths are configured in tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Version Compatibility

The registry automatically manages component versions, but ensure compatibility:

- **Node.js**: 18+
- **React**: 18+
- **Next.js**: 13+ (App Router)
- **TypeScript**: 5+

## 📖 Further Reading

- **[Main README](README.md)** - Project overview and quick start
- **[Database Schema Guide](README-SCHEMA.md)** - Production database setup
- **[Component Documentation](lib/components/comments/README.md)** - UI component details
- **[Storage Adapters](lib/comments/adapters/README.md)** - Storage implementation guides
- **[Lexical Editor Guide](lib/components/lexical/README.md)** - Rich text customization

---

Built with ❤️ by [Fargo](https://fargo.com) for modern applications requiring sophisticated commenting systems.