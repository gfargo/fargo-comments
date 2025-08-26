// Core comment system types - generic and reusable
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "auditor" | "reviewer" | "admin" | "client";
  createdAt: Date;
}

export type ContentType = "resource" | "rule" | "section" | "question";

export interface SourceReference {
  id: string;
  url: string;
  elementId?: string; // DOM element ID or selector
  label: string;
  description?: string;
  type: ContentType | "document" | "regulation" | "external_link" | "image";
  metadata?: {
    pageTitle?: string;
    sectionName?: string;
    coordinates?: { x: number; y: number };
    timestamp?: Date;
  };
}

export interface MentionUser {
  id: string;
  type: "user";
  userId: string;
  user: User;
  startIndex: number;
  endIndex: number;
  displayText: string; // e.g., "@greg"
}

export interface MentionTag {
  id: string;
  type: ContentType;
  resourceId: string;
  label: string; // e.g., "Q1.5.3", "rule3.1.3"
  description?: string;
  url?: string;
  startIndex: number;
  endIndex: number;
  displayText: string; // e.g., "#Q1.5.3"
}

export interface Comment {
  id: string;
  content: string;
  editorState?: string; // Lexical editor state as JSON string
  authorId: string;
  author: User;
  sourceId?: string; // Generic source association
  sourceType?: string; // Type of source (audit, project, document, etc.)
  parentId?: string; // For nested replies
  sourceReference?: SourceReference; // Added source reference to comments
  mentions: MentionUser[]; // Parsed @mentions in comment
  tags: MentionTag[]; // Parsed #tags in comment
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  reactions: CommentReaction[];
  status: "active" | "deleted" | "hidden";
}

export interface CommentReaction {
  id: string;
  userId: string;
  type: "like" | "approve" | "concern" | "resolved";
  createdAt: Date;
}

export interface CommentThread {
  id: string;
  rootComment: Comment;
  replies: Comment[];
  totalReplies: number;
  lastActivity: Date;
}

// Comment system configuration
export interface CommentSystemConfig {
  allowAnonymous: boolean;
  requireApproval: boolean;
  maxNestingLevel: number;
  allowReactions: boolean;
  mentionsEnabled: boolean;
}

export type CommentVariant =
  | "card"
  | "bubble"
  | "timeline"
  | "compact"
  | "plain"
  | "social"
  | "professional"
  | "clean"
  | "thread"
  | "github"
  | "email"
  | "notion"
  | "mobile"
  | "inline"
