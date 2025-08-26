import { cache } from "react"
import type { Comment, CommentThread, User, MentionUser, MentionTag } from "@/lib/types/comments"
import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"

// Type definitions for server actions that need to be implemented by the consumer
export type ServerActionSet = {
  // Cached read operations
  getCommentsAction: () => Promise<Comment[]>
  getCommentsBySourceAction: (sourceId: string, sourceType?: string) => Promise<Comment[]>
  getCommentThreadsAction: (sourceId?: string, sourceType?: string) => Promise<CommentThread[]>
  
  // Non-cached write operations
  addCommentAction: (comment: Comment) => Promise<void>
  addLexicalCommentAction: (
    content: string,
    editorState: string,
    author: User,
    mentions?: MentionUser[],
    tags?: MentionTag[],
    sourceId?: string,
    sourceType?: string,
    parentId?: string,
  ) => Promise<Comment>
  updateCommentAction: (commentId: string, updates: Partial<Comment>) => Promise<void>
  updateCommentWithEditorStateAction: (
    commentId: string,
    content: string,
    editorState: string,
    mentions?: MentionUser[],
    tags?: MentionTag[],
  ) => Promise<void>
  deleteCommentAction: (commentId: string) => Promise<void>
  saveCommentsAction: (comments: Comment[]) => Promise<void>
  clearAllStorageAction: () => Promise<void>
}

export interface CachedServerActionAdapterConfig extends StorageAdapterConfig {
  serverActions: ServerActionSet
  // Optional: Custom cache TTL or invalidation strategy
  enableCaching?: boolean
}

export class CachedServerActionAdapter implements CommentStorageAdapter {
  // Cached versions of read operations using React cache()
  private cachedGetComments: () => Promise<Comment[]>
  private cachedGetCommentsBySource: (sourceId: string, sourceType?: string) => Promise<Comment[]>
  private cachedGetCommentThreads: (sourceId?: string, sourceType?: string) => Promise<CommentThread[]>

  constructor(private config: CachedServerActionAdapterConfig) {
    if (!config.serverActions) {
      throw new Error("CachedServerActionAdapter requires serverActions to be provided in config")
    }

    // Create cached versions of read operations
    // React cache() ensures these functions are deduplicated within a single request
    const enableCaching = config.enableCaching !== false // default to true
    
    if (enableCaching) {
      this.cachedGetComments = cache(config.serverActions.getCommentsAction)
      this.cachedGetCommentsBySource = cache(config.serverActions.getCommentsBySourceAction)
      this.cachedGetCommentThreads = cache(config.serverActions.getCommentThreadsAction)
    } else {
      // Direct pass-through if caching is disabled
      this.cachedGetComments = config.serverActions.getCommentsAction
      this.cachedGetCommentsBySource = config.serverActions.getCommentsBySourceAction
      this.cachedGetCommentThreads = config.serverActions.getCommentThreadsAction
    }
  }

  // Read operations - use cached versions
  async getComments(): Promise<Comment[]> {
    return this.cachedGetComments()
  }

  async getCommentsBySource(sourceId: string, sourceType?: string): Promise<Comment[]> {
    return this.cachedGetCommentsBySource(sourceId, sourceType)
  }

  async getCommentThreads(sourceId?: string, sourceType?: string): Promise<CommentThread[]> {
    return this.cachedGetCommentThreads(sourceId, sourceType)
  }

  // Write operations - direct calls (no caching needed)
  async saveComments(comments: Comment[]): Promise<void> {
    return this.config.serverActions.saveCommentsAction(comments)
  }

  async addComment(comment: Comment): Promise<void> {
    return this.config.serverActions.addCommentAction(comment)
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<void> {
    return this.config.serverActions.updateCommentAction(commentId, updates)
  }

  async deleteComment(commentId: string): Promise<void> {
    return this.config.serverActions.deleteCommentAction(commentId)
  }

  async addLexicalComment(
    content: string,
    editorState: string,
    author: User,
    mentions: MentionUser[] = [],
    tags: MentionTag[] = [],
    sourceId?: string,
    sourceType?: string,
    parentId?: string,
  ): Promise<Comment> {
    return this.config.serverActions.addLexicalCommentAction(
      content,
      editorState,
      author,
      mentions,
      tags,
      sourceId,
      sourceType,
      parentId,
    )
  }

  async updateCommentWithEditorState(
    commentId: string,
    content: string,
    editorState: string,
    mentions?: MentionUser[],
    tags?: MentionTag[],
  ): Promise<void> {
    return this.config.serverActions.updateCommentWithEditorStateAction(
      commentId,
      content,
      editorState,
      mentions,
      tags,
    )
  }

  async clearAllStorage(): Promise<void> {
    return this.config.serverActions.clearAllStorageAction()
  }
}