import type { Comment, CommentThread, User, LabelAudit } from "@/types/comments"
import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"

export class ServerActionAdapter implements CommentStorageAdapter {
  constructor(private config: StorageAdapterConfig) {}

  async getComments(): Promise<Comment[]> {
    // Example: Call Next.js server action
    const { getCommentsAction } = await import("@/app/actions/comments")
    return await getCommentsAction()
  }

  async saveComments(comments: Comment[]): Promise<void> {
    const { saveCommentsAction } = await import("@/app/actions/comments")
    await saveCommentsAction(comments)
  }

  async addComment(comment: Comment): Promise<void> {
    const { addCommentAction } = await import("@/app/actions/comments")
    await addCommentAction(comment)
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<void> {
    const { updateCommentAction } = await import("@/app/actions/comments")
    await updateCommentAction(commentId, updates)
  }

  async deleteComment(commentId: string): Promise<void> {
    const { deleteCommentAction } = await import("@/app/actions/comments")
    await deleteCommentAction(commentId)
  }

  async addLexicalComment(
    content: string,
    editorState: string,
    author: User,
    mentions: any[] = [],
    tags: any[] = [],
    auditItemId?: string,
    parentId?: string,
  ): Promise<Comment> {
    const { addLexicalCommentAction } = await import("@/app/actions/comments")
    return await addLexicalCommentAction(content, editorState, author, mentions, tags, auditItemId, parentId)
  }

  async updateCommentWithEditorState(commentId: string, content: string, editorState: string): Promise<void> {
    const { updateCommentWithEditorStateAction } = await import("@/app/actions/comments")
    await updateCommentWithEditorStateAction(commentId, content, editorState)
  }

  async getUsers(): Promise<User[]> {
    const { getUsersAction } = await import("@/app/actions/users")
    return await getUsersAction()
  }

  async saveUsers(users: User[]): Promise<void> {
    const { saveUsersAction } = await import("@/app/actions/users")
    await saveUsersAction(users)
  }

  async getAudits(): Promise<LabelAudit[]> {
    const { getAuditsAction } = await import("@/app/actions/audits")
    return await getAuditsAction()
  }

  async saveAudits(audits: LabelAudit[]): Promise<void> {
    const { saveAuditsAction } = await import("@/app/actions/audits")
    await saveAuditsAction(audits)
  }

  async getCommentsByAuditItem(auditItemId: string): Promise<Comment[]> {
    const { getCommentsByAuditItemAction } = await import("@/app/actions/comments")
    return await getCommentsByAuditItemAction(auditItemId)
  }

  async getCommentThreads(auditItemId?: string): Promise<CommentThread[]> {
    const { getCommentThreadsAction } = await import("@/app/actions/comments")
    return await getCommentThreadsAction(auditItemId)
  }

  async clearAllStorage(): Promise<void> {
    const { clearAllStorageAction } = await import("@/app/actions/comments")
    await clearAllStorageAction()
  }
}
