# Okayd Comments

An open source, production-ready React commenting system built with Next.js, TypeScript, and Lexical editor. Batteries not included - bring your own storage, authentication, and styling preferences. Perfect for modern web applications requiring sophisticated commenting functionality.

## 📚 Documentation

This repository contains several specialized README files for different aspects of the system:

- **[Lexical Editor Documentation](components/lexical/README.md)** - Complete guide to rich text editing, plugins, and customizations
- **[Storage Adapters Documentation](lib/adapters/README.md)** - Comprehensive guide to all storage adapter implementations
- **[Database Schema Guide](README-SCHEMA.md)** - Database requirements and Prisma schema for production deployment

## 🚀 Features

### Rich Text Editing
- **Lexical Editor Integration**: Powered by Meta's Lexical editor with full rich text capabilities
- **Auto-List Creation**: Type `- ` for bullet lists or `1. ` for numbered lists
- **Automatic Link Detection**: URLs and email addresses are automatically converted to clickable links
- **Emoji Search**: Type `:` followed by search terms for instant emoji insertion with smart positioning
- **@Mentions & #Tags**: Smart mention system with async user/tag loading
- **Inline Editing**: Edit comments in-place with auto-clearing composers

### Design System
- **12+ Design Variants**: Card, bubble, timeline, GitHub, social, professional, mobile, and more
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme Support**: Built-in light/dark mode with CSS custom properties
- **Tailwind CSS v4**: Modern styling with semantic design tokens

### Comment Threading
- **Flat Thread Architecture**: Prevents deep nesting while maintaining visual hierarchy
- **Smart Reply System**: Replies to replies become replies to the parent
- **Visual Indentation**: Clear conversation flow with proper spacing

### Storage & Data Management
- **Adapter Pattern**: Pluggable storage system supporting multiple backends
- **Local Storage**: Default localStorage implementation for demos
- **Server Actions**: Next.js server action adapter for database integration
- **Tanstack Query**: React Query adapter with caching and optimistic updates
- **API Integration**: RESTful API adapter for external services

### Search & Filtering
- **Full-Text Search**: Search across comment content and metadata
- **Advanced Filtering**: Filter by user, date, status, and custom criteria
- **Real-Time Updates**: Live search with debounced input

## 📁 Project Structure

\`\`\`plaintext
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Main demo page
│   ├── composer/                # Lexical composer examples
│   ├── threads/                 # Thread visualization demos
│   └── layout.tsx               # Root layout with fonts
├── components/
│   ├── comments/                # Core comment components
│   │   ├── variants/           # 12+ design variants
│   │   ├── comment-list.tsx    # Main comment list component
│   │   ├── comment-search.tsx  # Search and filtering
│   │   └── comment-drawer.tsx  # Slide-out comment panel
│   ├── lexical/                # Lexical editor components
│   │   ├── lexical-comment-composer.tsx
│   │   ├── lexical-read-only-renderer.tsx
│   │   ├── plugins/            # Custom Lexical plugins
│   │   ├── config/             # Shared Lexical configuration
│   │   └── utils/              # Styling and utility functions
│   ├── layout/                 # Layout components
│   └── ui/                     # shadcn/ui components
├── contexts/
│   ├── comment-context.tsx     # Global comment state management
│   └── mention-context.tsx     # Centralized mention data provider
├── hooks/
│   ├── use-comment-actions.ts  # Comment CRUD and interaction management
│   ├── use-comments-from-source.ts # Source-filtered comment retrieval
│   ├── use-mobile.ts           # Mobile device detection
│   └── use-toast.ts            # Toast notification system
├── lib/
│   ├── adapters/               # Storage adapter implementations
│   ├── constants/              # Mock data and configurations
│   ├── comment-storage.ts      # Legacy storage interface
│   └── comment-utils.ts        # Utility functions
└── types/
    └── comments.ts             # TypeScript type definitions
\`\`\`

## 🎣 Custom Hooks

The system provides several specialized React hooks for different aspects of comment management:

### Core Comment Hooks

* **`useCommentActions`** - Comprehensive comment interaction management including CRUD operations, reactions, replies, and UI state management with error handling
* **`useCommentsFromSource`** - Retrieves and manages comments filtered by specific source ID and type, with statistics and loading states

### Utility Hooks

* **`useMobile`** - Mobile device detection using responsive breakpoints (< 768px) with real-time viewport updates
* **`useToast`** - Complete toast notification system with queuing, timeouts, and imperative API for user feedback

## 🎨 Design Variants

### Available Variants

1. **Card** - Clean card-based design with shadows
2. **Thread** - Nested conversation threads
3. **Bubble** - Chat bubble interface
4. **Timeline** - Vertical timeline with gradient connectors
5. **Social** - Social media style with avatars
6. **Professional** - Corporate/business styling
7. **Mobile** - Optimized for mobile devices
8. **Notion** - Notion-inspired minimal design
9. **Clean** - Ultra-minimal clean interface
10. **GitHub** - GitHub-style code review comments
11. **Email** - Email thread appearance
12. **Compact** - Space-efficient compact layout

### Variant-Specific Features

* **Adaptive Styling**: Each variant has unique color schemes, spacing, and typography
* **Context-Aware UI**: Buttons, composers, and interactions adapt to variant style
* **Responsive Behavior**: Variants optimize for different screen sizes

## 🔧 Installation & Setup

### Prerequisites

* Node.js 18+
* npm/yarn/pnpm

### Quick Start

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd okayd-comments

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### Environment Setup

No environment variables required for the default localStorage setup. For database integration, configure your storage adapter accordingly.

## 💾 Storage Adapters

### Local Storage (Default)

\`\`\`typescript
import { LocalStorageAdapter } from '@/lib/adapters'

const adapter = new LocalStorageAdapter()
\`\`\`

### Server Actions (Next.js)

\`\`\`typescript
import { ServerActionAdapter } from '@/lib/adapters'

const adapter = new ServerActionAdapter({
  createComment: createCommentAction,
  updateComment: updateCommentAction,
  deleteComment: deleteCommentAction,
  // ... other actions
})
\`\`\`

### Tanstack Query

\`\`\`typescript
import { useTanstackQueryAdapter } from '@/lib/adapters'

function MyComponent() {
  const adapter = useTanstackQueryAdapter({
    baseUrl: '/api/comments',
    queryClient: myQueryClient
  })
  
  return <CommentProvider storageAdapter={adapter}>...</CommentProvider>
}
\`\`\`

### API Integration

\`\`\`typescript
import { ApiAdapter } from '@/lib/adapters'

const adapter = new ApiAdapter({
  baseUrl: 'https://api.example.com',
  headers: { Authorization: 'Bearer token' }
})
\`\`\`

## 📡 Event System

The comment system includes a powerful event broadcasting system that allows developers to listen for comment actions and create custom plugins, notifications, analytics, or external integrations.

### Available Events

* **`comment:added`** - Fired when a new comment is created
* **`comment:updated`** - Fired when a comment is edited
* **`comment:deleted`** - Fired when a comment is removed
* **`comment:reaction:added`** - Fired when a reaction is added to a comment
* **`comment:reaction:removed`** - Fired when a reaction is removed
* **`comments:loaded`** - Fired when comments are initially loaded
* **`comments:error`** - Fired when an error occurs during comment operations

### Listening to Events

\`\`\`typescript
import { useCommentEvent } from '@/contexts/comment-context'

function NotificationPlugin() {
  useCommentEvent('comment:added', (comment) => {
    // Send notification
    console.log('New comment added:', comment.content)
    // Trigger email, push notification, etc.
  })

  useCommentEvent('comment:reaction:added', ({ comment, reaction, user }) => {
    // Analytics tracking
    analytics.track('Comment Reaction', {
      commentId: comment.id,
      reaction: reaction.type,
      userId: user.id
    })
  })

  return null // This is a headless plugin
}

function App() {
  return (
    <CommentProvider>
      <NotificationPlugin />
      <CommentList {...props} />
    </CommentProvider>
  )
}
\`\`\`

### Custom Event Integrations

\`\`\`typescript
// Email notification plugin
function EmailNotificationPlugin() {
  useCommentEvent('comment:added', async (comment) => {
    if (comment.parentId) {
      // Notify parent comment author of reply
      await sendEmail({
        to: comment.parent?.author.email,
        subject: 'New reply to your comment',
        template: 'comment-reply',
        data: { comment }
      })
    }
  })

  return null
}

// Analytics plugin
function AnalyticsPlugin() {
  useCommentEvent('comment:added', (comment) => {
    analytics.track('Comment Created', {
      sourceId: comment.sourceId,
      sourceType: comment.sourceType,
      hasParent: !!comment.parentId
    })
  })

  useCommentEvent('comment:reaction:added', ({ reaction }) => {
    analytics.track('Comment Reaction', { type: reaction.type })
  })

  return null
}
\`\`\`

## ⚙️ Configuration System

The CommentProvider accepts a comprehensive configuration object that allows you to customize editor features, appearance, and behavior without modifying components.

### Configuration Options

\`\`\`typescript
interface CommentConfig {
  variant?: CommentVariant // Design variant (card, bubble, timeline, etc.)
  placeholder?: string     // Default composer placeholder text
  features?: {
    lists?: boolean        // Enable/disable list creation (- and 1.)
    mentions?: boolean     // Enable/disable @mentions
    hashtags?: boolean     // Enable/disable #hashtags  
    emojis?: boolean       // Enable/disable emoji search (:emoji)
    autoLink?: boolean     // Enable/disable automatic link detection
  }
}
\`\`\`

### Basic Configuration

\`\`\`typescript
import { CommentProvider } from '@/contexts/comment-context'

const config = {
  variant: 'timeline',
  placeholder: 'Share your feedback...',
  features: {
    lists: true,
    mentions: true,
    hashtags: false,
    emojis: true,
    autoLink: true
  }
}

function App() {
  return (
    <CommentProvider config={config}>
      <CommentList {...props} />
    </CommentProvider>
  )
}
\`\`\`

### Feature-Specific Configurations

\`\`\`typescript
// Minimal configuration - only basic text editing
const minimalConfig = {
  variant: 'clean',
  placeholder: 'Add a note...',
  features: {
    lists: false,
    mentions: false,
    hashtags: false,
    emojis: false,
    autoLink: true // Keep link detection
  }
}

// Full-featured configuration - all plugins enabled
const fullConfig = {
  variant: 'social',
  placeholder: "What's on your mind? Try @mentions, #tags, :emojis, and lists!",
  features: {
    lists: true,
    mentions: true,
    hashtags: true,
    emojis: true,
    autoLink: true
  }
}

// Code review configuration - optimized for technical discussions
const codeReviewConfig = {
  variant: 'github',
  placeholder: 'Leave a review comment...',
  features: {
    lists: true,
    mentions: true,
    hashtags: false,
    emojis: false,
    autoLink: true
  }
}
\`\`\`

### Dynamic Configuration Updates

\`\`\`typescript
function ConfigurableCommentSystem() {
  const { config, updateConfig } = useComments()

  const toggleEmojis = () => {
    updateConfig({
      features: {
        ...config.features,
        emojis: !config.features.emojis
      }
    })
  }

  const changeVariant = (variant: CommentVariant) => {
    updateConfig({ variant })
  }

  return (
    <div>
      <button onClick={toggleEmojis}>
        {config.features.emojis ? 'Disable' : 'Enable'} Emojis
      </button>
      <select onChange={(e) => changeVariant(e.target.value as CommentVariant)}>
        <option value="card">Card</option>
        <option value="bubble">Bubble</option>
        <option value="timeline">Timeline</option>
      </select>
      <CommentList {...props} />
    </div>
  )
}
\`\`\`

## 🎯 Usage Examples

### Basic Comment List

\`\`\`tsx
import { CommentList } from '@/components/comments/comment-list'
import { CommentProvider } from '@/contexts/comment-context'

function MyApp() {
  return (
    <CommentProvider>
      <CommentList
        comments={comments}
        currentUser={user}
        sourceId="document-123"
        sourceType="document"
        variant="card"
        onAddComment={handleAdd}
        onReply={handleReply}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </CommentProvider>
  )
}
\`\`\`

### Rich Text Features

The Lexical editor automatically handles:

* **URLs**: `https://example.com` becomes a clickable link
* **Email addresses**: `user@example.com` becomes a mailto link
* **Lists**: Type `- ` or `1. ` to create lists
* **Emojis**: Type `:laugh` to search and insert emojis
* **Mentions**: Type `@` to mention users or `#` to tag items

### Custom Storage Adapter

\`\`\`tsx
import { CommentProvider } from '@/contexts/comment-context'
import { ServerActionAdapter } from '@/lib/adapters'

const customAdapter = new ServerActionAdapter({
  createComment: async (comment) => {
    // Your Prisma/Supabase logic here
    return await prisma.comment.create({ data: comment })
  },
  // ... other methods
})

function App() {
  return (
    <CommentProvider storageAdapter={customAdapter}>
      {/* Your app */}
    </CommentProvider>
  )
}
\`\`\`

### Lexical Composer Standalone

\`\`\`tsx
import { LexicalCommentComposer } from '@/components/lexical/lexical-comment-composer'

function MyComposer() {
  return (
    <LexicalCommentComposer
      variant="timeline"
      placeholder="Add to timeline..."
      onSubmit={(content, editorState) => {
        console.log('Content:', content)
        console.log('Editor State:', editorState)
      }}
    />
  )
}
\`\`\`

## 🔧 Installation & Setup

### Prerequisites

* Node.js 18+
* npm/yarn/pnpm

### Quick Start

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd okayd-comments

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### Environment Setup

No environment variables required for the default localStorage setup. For database integration, configure your storage adapter accordingly.

## 💾 Storage Adapters

### Local Storage (Default)

\`\`\`typescript
import { LocalStorageAdapter } from '@/lib/adapters'

const adapter = new LocalStorageAdapter()
\`\`\`

### Server Actions (Next.js)

\`\`\`typescript
import { ServerActionAdapter } from '@/lib/adapters'

const adapter = new ServerActionAdapter({
  createComment: createCommentAction,
  updateComment: updateCommentAction,
  deleteComment: deleteCommentAction,
  // ... other actions
})
\`\`\`

### Tanstack Query

\`\`\`typescript
import { useTanstackQueryAdapter } from '@/lib/adapters'

function MyComponent() {
  const adapter = useTanstackQueryAdapter({
    baseUrl: '/api/comments',
    queryClient: myQueryClient
  })
  
  return <CommentProvider storageAdapter={adapter}>...</CommentProvider>
}
\`\`\`

### API Integration

\`\`\`typescript
import { ApiAdapter } from '@/lib/adapters'

const adapter = new ApiAdapter({
  baseUrl: 'https://api.example.com',
  headers: { Authorization: 'Bearer token' }
})
\`\`\`

## 📡 Event System

The comment system includes a powerful event broadcasting system that allows developers to listen for comment actions and create custom plugins, notifications, analytics, or external integrations.

### Available Events

* **`comment:added`** - Fired when a new comment is created
* **`comment:updated`** - Fired when a comment is edited
* **`comment:deleted`** - Fired when a comment is removed
* **`comment:reaction:added`** - Fired when a reaction is added to a comment
* **`comment:reaction:removed`** - Fired when a reaction is removed
* **`comments:loaded`** - Fired when comments are initially loaded
* **`comments:error`** - Fired when an error occurs during comment operations

### Listening to Events

\`\`\`typescript
import { useCommentEvent } from '@/contexts/comment-context'

function NotificationPlugin() {
  useCommentEvent('comment:added', (comment) => {
    // Send notification
    console.log('New comment added:', comment.content)
    // Trigger email, push notification, etc.
  })

  useCommentEvent('comment:reaction:added', ({ comment, reaction, user }) => {
    // Analytics tracking
    analytics.track('Comment Reaction', {
      commentId: comment.id,
      reaction: reaction.type,
      userId: user.id
    })
  })

  return null // This is a headless plugin
}

function App() {
  return (
    <CommentProvider>
      <NotificationPlugin />
      <CommentList {...props} />
    </CommentProvider>
  )
}
\`\`\`

### Custom Event Integrations

\`\`\`typescript
// Email notification plugin
function EmailNotificationPlugin() {
  useCommentEvent('comment:added', async (comment) => {
    if (comment.parentId) {
      // Notify parent comment author of reply
      await sendEmail({
        to: comment.parent?.author.email,
        subject: 'New reply to your comment',
        template: 'comment-reply',
        data: { comment }
      })
    }
  })

  return null
}

// Analytics plugin
function AnalyticsPlugin() {
  useCommentEvent('comment:added', (comment) => {
    analytics.track('Comment Created', {
      sourceId: comment.sourceId,
      sourceType: comment.sourceType,
      hasParent: !!comment.parentId
    })
  })

  useCommentEvent('comment:reaction:added', ({ reaction }) => {
    analytics.track('Comment Reaction', { type: reaction.type })
  })

  return null
}
\`\`\`

## ⚙️ Configuration System

The CommentProvider accepts a comprehensive configuration object that allows you to customize editor features, appearance, and behavior without modifying components.

### Configuration Options

\`\`\`typescript
interface CommentConfig {
  variant?: CommentVariant // Design variant (card, bubble, timeline, etc.)
  placeholder?: string     // Default composer placeholder text
  features?: {
    lists?: boolean        // Enable/disable list creation (- and 1.)
    mentions?: boolean     // Enable/disable @mentions
    hashtags?: boolean     // Enable/disable #hashtags  
    emojis?: boolean       // Enable/disable emoji search (:emoji)
    autoLink?: boolean     // Enable/disable automatic link detection
  }
}
\`\`\`

### Basic Configuration

\`\`\`typescript
import { CommentProvider } from '@/contexts/comment-context'

const config = {
  variant: 'timeline',
  placeholder: 'Share your feedback...',
  features: {
    lists: true,
    mentions: true,
    hashtags: false,
    emojis: true,
    autoLink: true
  }
}

function App() {
  return (
    <CommentProvider config={config}>
      <CommentList {...props} />
    </CommentProvider>
  )
}
\`\`\`

### Feature-Specific Configurations

\`\`\`typescript
// Minimal configuration - only basic text editing
const minimalConfig = {
  variant: 'clean',
  placeholder: 'Add a note...',
  features: {
    lists: false,
    mentions: false,
    hashtags: false,
    emojis: false,
    autoLink: true // Keep link detection
  }
}

// Full-featured configuration - all plugins enabled
const fullConfig = {
  variant: 'social',
  placeholder: "What's on your mind? Try @mentions, #tags, :emojis, and lists!",
  features: {
    lists: true,
    mentions: true,
    hashtags: true,
    emojis: true,
    autoLink: true
  }
}

// Code review configuration - optimized for technical discussions
const codeReviewConfig = {
  variant: 'github',
  placeholder: 'Leave a review comment...',
  features: {
    lists: true,
    mentions: true,
    hashtags: false,
    emojis: false,
    autoLink: true
  }
}
\`\`\`

### Dynamic Configuration Updates

\`\`\`typescript
function ConfigurableCommentSystem() {
  const { config, updateConfig } = useComments()

  const toggleEmojis = () => {
    updateConfig({
      features: {
        ...config.features,
        emojis: !config.features.emojis
      }
    })
  }

  const changeVariant = (variant: CommentVariant) => {
    updateConfig({ variant })
  }

  return (
    <div>
      <button onClick={toggleEmojis}>
        {config.features.emojis ? 'Disable' : 'Enable'} Emojis
      </button>
      <select onChange={(e) => changeVariant(e.target.value as CommentVariant)}>
        <option value="card">Card</option>
        <option value="bubble">Bubble</option>
        <option value="timeline">Timeline</option>
      </select>
      <CommentList {...props} />
    </div>
  )
}
\`\`\`

## 🎯 Usage Examples

### Basic Comment List

\`\`\`tsx
import { CommentList } from '@/components/comments/comment-list'
import { CommentProvider } from '@/contexts/comment-context'

function MyApp() {
  return (
    <CommentProvider>
      <CommentList
        comments={comments}
        currentUser={user}
        sourceId="document-123"
        sourceType="document"
        variant="card"
        onAddComment={handleAdd}
        onReply={handleReply}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </CommentProvider>
  )
}
\`\`\`

### Rich Text Features

The Lexical editor automatically handles:

* **URLs**: `https://example.com` becomes a clickable link
* **Email addresses**: `user@example.com` becomes a mailto link
* **Lists**: Type `- ` or `1. ` to create lists
* **Emojis**: Type `:laugh` to search and insert emojis
* **Mentions**: Type `@` to mention users or `#` to tag items

### Custom Storage Adapter

\`\`\`tsx
import { CommentProvider } from '@/contexts/comment-context'
import { ServerActionAdapter } from '@/lib/adapters'

const customAdapter = new ServerActionAdapter({
  createComment: async (comment) => {
    // Your Prisma/Supabase logic here
    return await prisma.comment.create({ data: comment })
  },
  // ... other methods
})

function App() {
  return (
    <CommentProvider storageAdapter={customAdapter}>
      {/* Your app */}
    </CommentProvider>
  )
}
\`\`\`

### Lexical Composer Standalone

\`\`\`tsx
import { LexicalCommentComposer } from '@/components/lexical/lexical-comment-composer'

function MyComposer() {
  return (
    <LexicalCommentComposer
      variant="timeline"
      placeholder="Add to timeline..."
      onSubmit={(content, editorState) => {
        console.log('Content:', content)
        console.log('Editor State:', editorState)
      }}
    />
  )
}
\`\`\`

## 🔧 Installation & Setup

### Prerequisites

* Node.js 18+
* npm/yarn/pnpm

### Quick Start

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd okayd-comments

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### Environment Setup

No environment variables required for the default localStorage setup. For database integration, configure your storage adapter accordingly.

## 💾 Storage Adapters

### Local Storage (Default)

\`\`\`typescript
import { LocalStorageAdapter } from '@/lib/adapters'

const adapter = new LocalStorageAdapter()
\`\`\`

### Server Actions (Next.js)

\`\`\`typescript
import { ServerActionAdapter } from '@/lib/adapters'

const adapter = new ServerActionAdapter({
  createComment: createCommentAction,
  updateComment: updateCommentAction,
  deleteComment: deleteCommentAction,
  // ... other actions
})
\`\`\`

### Tanstack Query

\`\`\`typescript
import { useTanstackQueryAdapter } from '@/lib/adapters'

function MyComponent() {
  const adapter = useTanstackQueryAdapter({
    baseUrl: '/api/comments',
    queryClient: myQueryClient
  })
  
  return <CommentProvider storageAdapter={adapter}>...</CommentProvider>
}
\`\`\`

### API Integration

\`\`\`typescript
import { ApiAdapter } from '@/lib/adapters'

const adapter = new ApiAdapter({
  baseUrl: 'https://api.example.com',
  headers: { Authorization: 'Bearer token' }
})
\`\`\`

## 🎯 Usage Examples

### Basic Comment List

\`\`\`tsx
import { CommentList } from '@/components/comments/comment-list'
import { CommentProvider } from '@/contexts/comment-context'

function MyApp() {
  return (
    <CommentProvider>
      <CommentList
        comments={comments}
        currentUser={user}
        sourceId="document-123"
        sourceType="document"
        variant="card"
        onAddComment={handleAdd}
        onReply={handleReply}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </CommentProvider>
  )
}
\`\`\`

### Rich Text Features

The Lexical editor automatically handles:

* **URLs**: `https://example.com` becomes a clickable link
* **Email addresses**: `user@example.com` becomes a mailto link
* **Lists**: Type `- ` or `1. ` to create lists
* **Emojis**: Type `:laugh` to search and insert emojis
* **Mentions**: Type `@` to mention users or `#` to tag items

### Custom Storage Adapter

\`\`\`tsx
import { CommentProvider } from '@/contexts/comment-context'
import { ServerActionAdapter } from '@/lib/adapters'

const customAdapter = new ServerActionAdapter({
  createComment: async (comment) => {
    // Your Prisma/Supabase logic here
    return await prisma.comment.create({ data: comment })
  },
  // ... other methods
})

function App() {
  return (
    <CommentProvider storageAdapter={customAdapter}>
      {/* Your app */}
    </CommentProvider>
  )
}
\`\`\`

### Lexical Composer Standalone

\`\`\`tsx
import { LexicalCommentComposer } from '@/components/lexical/lexical-comment-composer'

function MyComposer() {
  return (
    <LexicalCommentComposer
      variant="timeline"
      placeholder="Add to timeline..."
      onSubmit={(content, editorState) => {
        console.log('Content:', content)
        console.log('Editor State:', editorState)
      }}
    />
  )
}
\`\`\`

## 🔧 Installation & Setup

### Prerequisites

* Node.js 18+
* npm/yarn/pnpm

### Quick Start

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd okayd-comments

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### Environment Setup

No environment variables required for the default localStorage setup. For database integration, configure your storage adapter accordingly.

## 💾 Storage Adapters

### Local Storage (Default)

\`\`\`typescript
import { LocalStorageAdapter } from '@/lib/adapters'

const adapter = new LocalStorageAdapter()
\`\`\`

### Server Actions (Next.js)

\`\`\`typescript
import { ServerActionAdapter } from '@/lib/adapters'

const adapter = new ServerActionAdapter({
  createComment: createCommentAction,
  updateComment: updateCommentAction,
  deleteComment: deleteCommentAction,
  // ... other actions
})
\`\`\`

### Tanstack Query

\`\`\`typescript
import { useTanstackQueryAdapter } from '@/lib/adapters'

function MyComponent() {
  const adapter = useTanstackQueryAdapter({
    baseUrl: '/api/comments',
    queryClient: myQueryClient
  })
  
  return <CommentProvider storageAdapter={adapter}>...</CommentProvider>
}
\`\`\`

### API Integration

\`\`\`typescript
import { ApiAdapter } from '@/lib/adapters'

const adapter = new ApiAdapter({
  baseUrl: 'https://api.example.com',
  headers: { Authorization: 'Bearer token' }
})
\`\`\`

## 🎨 Theming & Customization

### CSS Custom Properties

The system uses CSS custom properties for theming:

\`\`\`css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... more properties */
}
\`\`\`

### Variant-Specific Styling

Each variant has its own styling utilities in `components/lexical/utils/style-utils.ts`:

\`\`\`typescript
export function getContainerStyles(variant: CommentVariant): string {
  switch (variant) {
    case 'timeline':
      return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400'
    case 'card':
      return 'bg-white border border-gray-200 rounded-lg shadow-sm'
    // ... other variants
  }
}
\`\`\`

## 🧪 Testing & Development

### Demo Pages

* `/` - Main demo with live comment system
* `/composer` - Lexical composer examples
* `/threads` - Thread visualization demos

### Development Tools

* **Clear Data Button**: Reset localStorage during development
* **Variant Selector**: Switch between design variants in real-time
* **Debug Logging**: Console logging for development insights

## 🚀 Production Deployment

For production deployment with database integration, see the [Database Schema Guide](README-SCHEMA.md) for complete setup instructions.

### Environment Variables

\`\`\`env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
\`\`\`

## 🏢 About Okayd

Okayd builds modern tools for regulatory compliance and brand protection. Our flagship product, **Auditor**, helps CPG brands achieve regulatory compliance, examine label elements for accuracy, and use best practices to protect brand equity.

**Okayd Comments** was born from our need for a flexible, domain-agnostic commenting system that could work across different types of content - from audit findings to project discussions to document reviews.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

* **Meta Lexical** - Rich text editing framework
* **shadcn/ui** - UI component library
* **Tailwind CSS** - Utility-first CSS framework
* **Tanstack Query** - Data fetching and caching
* **Next.js** - React framework

---

Built with ❤️ by [Okayd](https://okayd.com) for modern web applications requiring sophisticated commenting systems.
