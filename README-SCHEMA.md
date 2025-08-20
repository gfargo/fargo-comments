# Database Schema Guide

This document outlines the database requirements and recommended schema for deploying the CPG Comment System in production with persistent storage.

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

model User {
  id       String @id @default(cuid())
  name     String
  email    String @unique
  role     String?
  avatar   String?
  
  // Relationships
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
  parent       Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies      Comment[] @relation("CommentReplies")
  
  // Author
  authorId     String
  author       User     @relation(fields: [authorId], references: [id])
  
  // Metadata
  isEdited     Boolean  @default(false)
  status       CommentStatus @default(ACTIVE)
  
  // Rich content
  mentions     Json     @default("[]") // Array of mentioned users/tags
  tags         Json     @default("[]") // Array of tags
  reactions    Json     @default("[]") // Array of reactions
  
  // Source reference (optional)
  sourceReference Json?
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Indexes for performance
  @@index([sourceId, sourceType])
  @@index([parentId])
  @@index([authorId])
  @@index([createdAt])
  
  @@map("comments")
}

enum CommentStatus {
  ACTIVE
  DELETED
  HIDDEN
  FLAGGED
}

// Optional: For mention functionality
model Tag {
  id          String @id @default(cuid())
  name        String @unique
  type        TagType
  description String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("tags")
}

enum TagType {
  RESOURCE
  RULE
  SECTION
  QUESTION
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
  user      User    @relation(fields: [userId], references: [id])
  
  type      ReactionType
  
  createdAt DateTime @default(now())
  
  @@unique([commentId, userId, type])
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
  editor    User   @relation(fields: [editedBy], references: [id])
  
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
// lib/adapters/prisma-adapter.ts
import { PrismaClient } from '@prisma/client'
import { CommentStorageAdapter } from './comment-storage-adapter'
import type { Comment, User } from '@/types/comments'

export class PrismaAdapter implements CommentStorageAdapter {
  constructor(private prisma: PrismaClient) {}

  async getComments(): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      include: {
        author: true,
        replies: {
          include: { author: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return comments.map(this.transformComment)
  }

  async addComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
    const created = await this.prisma.comment.create({
      data: {
        content: comment.content,
        editorState: comment.editorState,
        sourceId: comment.sourceId,
        sourceType: comment.sourceType,
        parentId: comment.parentId,
        authorId: comment.authorId,
        mentions: comment.mentions || [],
        tags: comment.tags || [],
        reactions: comment.reactions || [],
        sourceReference: comment.sourceReference
      },
      include: { author: true }
    })
    
    return this.transformComment(created)
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
    const updated = await this.prisma.comment.update({
      where: { id },
      data: {
        content: updates.content,
        editorState: updates.editorState,
        isEdited: true,
        mentions: updates.mentions,
        tags: updates.tags,
        reactions: updates.reactions
      },
      include: { author: true }
    })
    
    return this.transformComment(updated)
  }

  async deleteComment(id: string): Promise<void> {
    await this.prisma.comment.update({
      where: { id },
      data: { status: 'DELETED' }
    })
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async getCommentsBySource(sourceId: string, sourceType: string): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        sourceId,
        sourceType,
        status: 'ACTIVE'
      },
      include: { author: true },
      orderBy: { createdAt: 'asc' }
    })
    
    return comments.map(this.transformComment)
  }

  async clearAllStorage(): Promise<void> {
    await this.prisma.comment.deleteMany()
    // Add other cleanup as needed
  }

  private transformComment(prismaComment: any): Comment {
    return {
      id: prismaComment.id,
      content: prismaComment.content,
      editorState: prismaComment.editorState,
      sourceId: prismaComment.sourceId,
      sourceType: prismaComment.sourceType,
      parentId: prismaComment.parentId,
      authorId: prismaComment.authorId,
      author: prismaComment.author,
      isEdited: prismaComment.isEdited,
      status: prismaComment.status.toLowerCase(),
      mentions: prismaComment.mentions,
      tags: prismaComment.tags,
      reactions: prismaComment.reactions,
      sourceReference: prismaComment.sourceReference,
      createdAt: prismaComment.createdAt.toISOString(),
      updatedAt: prismaComment.updatedAt.toISOString()
    }
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
// Get comments with reply counts
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

---

This schema provides a solid foundation for production deployment while maintaining flexibility for future enhancements.
