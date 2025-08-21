import type { Comment, CommentThread, User } from "@/lib/types/comments"

export interface CommentStorageAdapter {
  // Comment operations
  getComments(): Promise<Comment[]>
  saveComments(comments: Comment[]): Promise<void>
  addComment(comment: Comment): Promise<void>
  updateComment(commentId: string, updates: Partial<Comment>): Promise<void>
  deleteComment(commentId: string): Promise<void>

  addLexicalComment(
    content: string,
    editorState: string,
    author: User,
    mentions?: any[],
    tags?: any[],
    sourceId?: string,
    sourceType?: string,
    parentId?: string,
  ): Promise<Comment>

  updateCommentWithEditorState(
    commentId: string,
    content: string,
    editorState: string,
    mentions?: any[],
    tags?: any[],
  ): Promise<void>

  // User operations
  getUsers(): Promise<User[]>
  saveUsers(users: User[]): Promise<void>

  getCommentsBySource(sourceId: string, sourceType?: string): Promise<Comment[]>
  getCommentThreads(sourceId?: string, sourceType?: string): Promise<CommentThread[]>

  // Utility operations
  clearAllStorage(): Promise<void>
}

export interface StorageAdapterConfig {
  // For server-side adapters
  apiEndpoint?: string
  headers?: Record<string, string>

  // For database adapters
  connectionString?: string

  // For demo/development
  enableDemoData?: boolean

  // Custom configuration
  [key: string]: any
}
