# Database Schema Guide

This document outlines the database requirements and recommended schema for deploying the Okayd Comment System in production with persistent storage.

## 🗄️ Database Requirements

### Supported Databases
- **PostgreSQL** (Recommended)
- **MySQL** 
- **SQLite** (Development only)
- **MongoDB** (with adapter modifications)

### Minimum Requirements
- Database version supporting JSON fields
- UUID support (recommended)
- Full-text search capabilities (optional but recommended)

## 📋 Prisma Schema

### Core Schema
\`\`\`prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// The User model is for relational reference. If you have an existing User
// table, you can adapt the Comment model to point to it. The key is that
// the comment system needs a way to associate a comment with an author ID.
model User {
  id       String @id @default(cuid())
  name     String
  email    String @unique
  role     String?
  avatar   String?
  
  // This reverse relation is optional and not required for the comment
  // system to function. It's a Prisma convenience for querying.
  comments Comment[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Comment {
  id           String   @id @default(cuid())
  content      String
  editorState  Json     // Lexical editor state
  
  // Generic source association
  sourceId     String
  sourceType   String
  
  // Threading
  parentId     String?
  parent       Comment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  replies      Comment[] @relation("CommentReplies")
  
  // --- Author Association: Choose ONE of the following two options ---

  // Option 1: Relational Link (Recommended for data integrity)
  // This creates a foreign key to your User table. It's the safest option
  // if your users and comments are in the same database.
  authorId     String
  author       User     @relation(fields: [authorId], references: [id])

  // Option 2: Decoupled ID (Maximum flexibility)
  // Use this if your users are in a separate service or database.
  // Your application will be responsible for fetching author details
  // using the `authorId` string. To use this, comment out the two lines above.
  // authorId     String
  
  // --- End of Author Association Options ---
  
  // Metadata
  isEdited     Boolean  @default(false)
  status       CommentStatus @default(ACTIVE)
  
  // Rich content - JSON structure examples below
  mentions     Json     @default("[]") // Array of flattened mention objects
  tags         Json     @default("[]") // Array of flattened tag objects  
  reactions    Json     @default("[]") // Array of reaction objects
  
  // Source reference (optional)
  sourceReference Json?
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Indexes for performance
  @@index ([sourceId, sourceType])
  @@index ([parentId])
  @@index ([authorId])
  @@index ([createdAt])
  
  @@map("comments")
}

enum CommentStatus {
  ACTIVE
  DELETED
  HIDDEN
  FLAGGED
}

// Optional: Example schema for mentionable entities (#tags).
// The comment system is agnostic to your entity models. You can define
// any models you need (e.g., Documents, Projects, Tasks) and provide
// them to the `MentionProvider` to make them taggable in comments.
model TaggableEntity {
  id          String @id @default(cuid())
  name        String @unique // This will be the value used for the #tag
  type        String // e.g., "document", "project", "task"
  description String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("taggable_entities")
}
\`\`\`

### Extended Schema (Optional Features)

\`\`\`prisma
// Additional models for advanced features

model CommentReaction {
  id        String @id @default(cuid())
  commentId String
  comment   Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  userId    String
  // Note: You might need a direct relation to User here if you implement this
  
  type      ReactionType
  
  createdAt DateTime @default(now())
  
  @@unique ([commentId, userId, type])
  @@map("comment_reactions")
}

enum ReactionType {
  LIKE
  DISLIKE
  HEART
  THUMBS_UP
  THUMBS_DOWN
}

model CommentAttachment {
  id        String @id @default(cuid())
  commentId String
  comment   Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  filename  String
  url       String
  mimeType  String
  size      Int
  
  createdAt DateTime @default(now())
  
  @@map("comment_attachments")
}

// For audit trail
model CommentHistory {
  id        String @id @default(cuid())
  commentId String
  comment   Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  content   String
  editorState Json
  
  editedBy  String
  // Note: You might need a direct relation to User here if you implement this
  
  createdAt DateTime @default(now())
  
  @@map("comment_history")
}
\`\`\`

## 🔧 Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install prisma @prisma/client
npm install -D prisma
\`\`\`

### 2. Initialize Prisma
\`\`\`bash
npx prisma init
\`\`\`

### 3. Configure Environment
\`\`\`env
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/comments_db"
\`\`\`

### 4. Apply Schema
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
\`\`\`

### 5. Create Prisma Adapter
\`\`\`typescript
// lib/comments/adapters/prisma-adapter.ts
import { PrismaClient } from '@prisma/client'
import { CommentStorageAdapter } from './comment-storage-adapter'
import type { Comment, User } from '@/types/comments'

export class PrismaAdapter implements CommentStorageAdapter {
  constructor(private prisma: PrismaClient) {}

  // Implement the required methods from CommentStorageAdapter
  // Example for getComments:
  async getComments(): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      // If using the relational approach, you can include the author directly.
      // If using the decoupled ID approach, you would remove this include.
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
    // Note: You'll need a function to transform Prisma's return type
    // to the application's Comment type, especially for JSON fields.
    return comments.map(this.transformComment);
  }

  // ...implement other methods like addComment, updateComment, etc.

  private transformComment(prismaComment: any): Comment {
    // This is a sample transformation. You'll need to adjust it
    // to match your application's data types (e.g., Date objects).
    // If using the decoupled ID approach, the `author` object would be
    // attached here after being fetched from its separate source.
    return {
      ...prismaComment,
      status: prismaComment.status.toLowerCase(),
      // Ensure nested objects and dates are correctly formatted
      author: prismaComment.author,
      createdAt: new Date(prismaComment.createdAt),
      updatedAt: new Date(prismaComment.updatedAt),
    };
  }
}
\`\`\`

## 🚀 Production Deployment

### Database Optimization
\`\`\`sql
-- Additional indexes for performance
CREATE INDEX CONCURRENTLY idx_comments_source_created 
ON comments (source_id, source_type, created_at DESC);

CREATE INDEX CONCURRENTLY idx_comments_parent_created 
ON comments (parent_id, created_at ASC) WHERE parent_id IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_comments_author_created 
ON comments (author_id, created_at DESC);

-- Full-text search (PostgreSQL)
CREATE INDEX CONCURRENTLY idx_comments_content_search 
ON comments USING gin(to_tsvector('english', content));
\`\`\`

### Environment Variables
\`\`\`env
# Production
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Connection pooling (recommended)
DATABASE_URL="postgresql://user:pass@pooler:5432/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db"
\`\`\`

### Migration Strategy
\`\`\`bash
# Production migrations
npx prisma migrate deploy

# Backup before major changes
pg_dump $DATABASE_URL > backup.sql
\`\`\`

## 🔍 Query Examples

### Common Queries
\`\`\`typescript
// Get comments with reply counts (Relational Approach)
const commentsWithCounts = await prisma.comment.findMany({
  where: { sourceId: 'doc-123', sourceType: 'document' },
  include: {
    author: true,
    _count: {
      select: { replies: true }
    }
  }
})

// Full-text search
const searchResults = await prisma.$queryRaw`
  SELECT * FROM comments 
  WHERE to_tsvector('english', content) @@ plainto_tsquery('english', ${query})
  ORDER BY ts_rank(to_tsvector('english', content), plainto_tsquery('english', ${query})) DESC
`

// Comment statistics
const stats = await prisma.comment.aggregate({
  where: { sourceId: 'doc-123', sourceType: 'document' },
  _count: { id: true },
  _min: { createdAt: true },
  _max: { createdAt: true }
})
\`\`\`

## 🛡️ Security Considerations

### Row Level Security (RLS)
\`\`\`sql
-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy examples
CREATE POLICY "Users can view active comments" ON comments
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Users can edit own comments" ON comments
  FOR UPDATE USING (author_id = auth.uid());
\`\`\`

### Data Validation
- Validate `sourceId` and `sourceType` combinations
- Sanitize rich text content
- Implement rate limiting for comment creation
- Validate parent-child relationships

## 📊 Monitoring & Analytics

### Useful Metrics
- Comments per source
- User engagement rates
- Response times
- Storage growth

### Recommended Tools
- **Prisma Pulse** - Real-time database events
- **Prisma Accelerate** - Connection pooling and caching
- **Database monitoring** - Query performance tracking

## 📋 JSON Field Structures

### Mentions Array Format
\`\`\`json
{
  "mentions": [
    {
      "id": "user-1",
      "value": "John Smith",
      "email": "john.smith@company.com"
    },
    {
      "id": "user-2", 
      "value": "Jane Doe",
      "email": "jane.doe@company.com",
      "role": "admin"
    }
  ]
}
\`\`\`

### Tags Array Format
\`\`\`json
{
  "tags": [
    {
      "id": "q-1-3-1",
      "value": "question1.3.1", 
      "description": "Net weight declaration requirements"
    },
    {
      "id": "r-3-1-3",
      "value": "rule3.1.3",
      "description": "FDA labeling compliance rule",
      "url": "/rules/3.1.3"
    }
  ]
}
\`\`\`

### Reactions Array Format
\`\`\`json
{
  "reactions": [
    {
      "type": "like",
      "userId": "user-1",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "type": "heart",
      "userId": "user-2", 
      "createdAt": "2024-01-15T11:15:00Z"
    }
  ]
}
\`\`\`

### Source Reference Format
\`\`\`json
{
  "sourceReference": {
    "type": "document",
    "id": "doc-123",
    "section": "3.1.2",
    "title": "Labeling Requirements",
    "url": "/documents/doc-123#section-3.1.2"
  }
}
\`\`\`

---

This schema provides a solid foundation for production deployment while maintaining flexibility for future enhancements.
