import type { Comment, CommentThread, User } from "@/lib/types/comments"
import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"

export class ServerActionAdapter implements CommentStorageAdapter {
  constructor(private config: StorageAdapterConfig) {}

  async getComments(): Promise<Comment[]> {
    throw new Error("ServerActionAdapter: Please implement getCommentsAction in your app/actions/comments.ts file")
  }

  async saveComments(comments: Comment[]): Promise<void> {
    throw new Error("ServerActionAdapter: Please implement saveCommentsAction in your app/actions/comments.ts file")
  }

  async addComment(comment: Comment): Promise<void> {
    throw new Error("ServerActionAdapter: Please implement addCommentAction in your app/actions/comments.ts file")
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<void> {
    throw new Error("ServerActionAdapter: Please implement updateCommentAction in your app/actions/comments.ts file")
  }

  async deleteComment(commentId: string): Promise<void> {
    throw new Error("ServerActionAdapter: Please implement deleteCommentAction in your app/actions/comments.ts file")
  }

  async addLexicalComment(
    content: string,
    editorState: string,
    author: User,
    mentions: any[] = [],
    tags: any[] = [],
    sourceId?: string,
    sourceType?: string,
    parentId?: string,
  ): Promise<Comment> {
    throw new Error(
      "ServerActionAdapter: Please implement addLexicalCommentAction in your app/actions/comments.ts file",
    )
  }

  async updateCommentWithEditorState(commentId: string, content: string, editorState: string): Promise<void> {
    throw new Error(
      "ServerActionAdapter: Please implement updateCommentWithEditorStateAction in your app/actions/comments.ts file",
    )
  }

  async getUsers(): Promise<User[]> {
    throw new Error("ServerActionAdapter: Please implement getUsersAction in your app/actions/users.ts file")
  }

  async saveUsers(users: User[]): Promise<void> {
    throw new Error("ServerActionAdapter: Please implement saveUsersAction in your app/actions/users.ts file")
  }

  async getCommentsBySource(sourceId: string, sourceType: string): Promise<Comment[]> {
    throw new Error(
      "ServerActionAdapter: Please implement getCommentsBySourceAction in your app/actions/comments.ts file",
    )
  }

  async getCommentThreads(sourceId?: string, sourceType?: string): Promise<CommentThread[]> {
    throw new Error(
      "ServerActionAdapter: Please implement getCommentThreadsAction in your app/actions/comments.ts file",
    )
  }

  async clearAllStorage(): Promise<void> {
    throw new Error("ServerActionAdapter: Please implement clearAllStorageAction in your app/actions/comments.ts file")
  }
}
