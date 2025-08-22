# Okayd Comments

An open source, production-ready React commenting system built with Next.js, TypeScript, and Lexical editor. Batteries not included - bring your own storage, authentication, and styling preferences. Perfect for modern web applications requiring sophisticated commenting functionality.

## 📚 Documentation

This repository contains several specialized README files for different aspects of the system:

- **[Context Providers Guide](lib/contexts/README.md)** - A guide to the core state management providers.
- **[Lexical Editor Documentation](lib/components/lexical/README.md)** - Complete guide to rich text editing, plugins, and customizations.
- **[Storage Adapters Documentation](lib/adapters/README.md)** - Comprehensive guide to all storage adapter implementations.
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

### Search & Filtering

- **Full-Text Search**: Search across comment content and metadata.
- **Advanced Filtering**: Filter by user, date, status, and custom criteria.
- **Real-Time Updates**: Live search with debounced input.

## 📁 Project Structure

```plaintext
├── app/                          # Next.js App Router pages
│   ├── _demo/                   # Demo components and data
│   ├── composer/                # Composer demo page
│   ├── threads/                 # Threads demo page
│   └── page.tsx                 # Main demo page
├── components/
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── components/
│   │   ├── comments/            # Comment components (variants, lists)
│   │   └── lexical/             # Lexical editor components and plugins
│   ├── contexts/                # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── adapters/                # Storage adapter implementations
│   ├── reducers/                # State management logic
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
└── public/                     # Static assets
```

## 🎯 Usage Example

```tsx
import { CommentList } from '@/lib/components/comments/comment-list';
import { CommentProvider } from '@/lib/contexts/comment-context';
import { MentionProvider } from '@/lib/contexts/mention-context';
import { LocalStorageAdapter } from '@/lib/adapters';

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

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Quick Start

````bash
# Clone the repository
git clone <repository-url>
cd okayd-comments

# Install dependencies
npm install

# Run development server
npm run dev
````

## 🚀 Production Deployment

For production deployment with database integration, see the [Database Schema Guide](README-SCHEMA.md) for complete setup instructions.

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

- **Meta Lexical** - Rich text editing framework
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Tanstack Query** - Data fetching and caching
- **Next.js** - React framework

---

Built with ❤️ by [Okayd](https://okayd.com) for modern web applications requiring sophisticated commenting systems.
