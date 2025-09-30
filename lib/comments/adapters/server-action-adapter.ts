import type { Comment, CommentThread, User, MentionUser, MentionTag } from "@/lib/comments/types/comments"
import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"

export class ServerActionAdapter implements CommentStorageAdapter {
  constructor(private config: StorageAdapterConfig) {
    // The config is passed to the constructor but not used in this adapter.
    // This is a placeholder for future use.
    if (this.config) {
      // do nothing
    }
  }

  async getComments(): Promise<Comment[]> {
    throw new Error("ServerActionAdapter: Please implement getCommentsAction in your app/actions/comments.ts file")
  }

  async saveComments(comments: Comment[]): Promise<void> {
    // The `comments` parameter is a placeholder for the actual implementation.
    if (comments) {
      // do nothing
    }
    throw new Error("ServerActionAdapter: Please implement saveCommentsAction in your app/actions/comments.ts file")
  }

  async addComment(comment: Comment): Promise<void> {
    // The `comment` parameter is a placeholder for the actual implementation.
    if (comment) {
      // do nothing
    }
    throw new Error("ServerActionAdapter: Please implement addCommentAction in your app/actions/comments.ts file")
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<void> {
    // The `commentId` and `updates` parameters are placeholders for the actual implementation.
    if (commentId && updates) {
      // do nothing
    }
    throw new Error("ServerActionAdapter: Please implement updateCommentAction in your app/actions/comments.ts file")
  }

  async deleteComment(commentId: string): Promise<void> {
    // The `commentId` parameter is a placeholder for the actual implementation.
    if (commentId) {
      // do nothing
    }
    throw new Error("ServerActionAdapter: Please implement deleteCommentAction in your app/actions/comments.ts file")
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
    // The parameters are placeholders for the actual implementation.
    if (content && editorState && author && mentions && tags && sourceId && sourceType && parentId) {
      // do nothing
    }
    throw new Error(
      "ServerActionAdapter: Please implement addLexicalCommentAction in your app/actions/comments.ts file",
    )
  }

  async updateCommentWithEditorState(
    commentId: string,
    content: string,
    editorState: string,
  ): Promise<void> {
    // The parameters are placeholders for the actual implementation.
    if (commentId && content && editorState) {
      // do nothing
    }
    throw new Error(
      "ServerActionAdapter: Please implement updateCommentWithEditorStateAction in your app/actions/comments.ts file",
    )
  }

  async getcommentsSource(sourceId: string, sourceType: string): Promise<Comment[]> {
    // The `sourceId` and `sourceType` parameters are placeholders for the actual implementation.
    if (sourceId && sourceType) {
      // do nothing
    }
    throw new Error(
      "ServerActionAdapter: Please implement getcommentsSourceAction in your app/actions/comments.ts file",
    )
  }

  async getCommentThreads(sourceId?: string, sourceType?: string): Promise<CommentThread[]> {
    // The `sourceId` and `sourceType` parameters are placeholders for the actual implementation.
    if (sourceId && sourceType) {
      // do nothing
    }
    throw new Error(
      "ServerActionAdapter: Please implement getCommentThreadsAction in your app/actions/comments.ts file",
    )
  }

  async clearAllStorage(): Promise<void> {
    throw new Error("ServerActionAdapter: Please implement clearAllStorageAction in your app/actions/comments.ts file")
  }
}
