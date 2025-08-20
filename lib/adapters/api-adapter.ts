import type { Comment, CommentThread, User, LabelAudit } from "@/types/comments"
import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"

export class ApiAdapter implements CommentStorageAdapter {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config: StorageAdapterConfig) {
    this.baseUrl = config.apiEndpoint || "/api"
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.headers,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  async getComments(): Promise<Comment[]> {
    return this.request<Comment[]>("/comments")
  }

  async saveComments(comments: Comment[]): Promise<void> {
    await this.request("/comments/bulk", {
      method: "PUT",
      body: JSON.stringify(comments),
    })
  }

  async addComment(comment: Comment): Promise<void> {
    await this.request("/comments", {
      method: "POST",
      body: JSON.stringify(comment),
    })
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<void> {
    await this.request(`/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.request(`/comments/${commentId}`, {
      method: "DELETE",
    })
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
    return this.request<Comment>("/comments/lexical", {
      method: "POST",
      body: JSON.stringify({
        content,
        editorState,
        author,
        mentions,
        tags,
        auditItemId,
        parentId,
      }),
    })
  }

  async updateCommentWithEditorState(commentId: string, content: string, editorState: string): Promise<void> {
    await this.request(`/comments/${commentId}/lexical`, {
      method: "PATCH",
      body: JSON.stringify({ content, editorState }),
    })
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users")
  }

  async saveUsers(users: User[]): Promise<void> {
    await this.request("/users/bulk", {
      method: "PUT",
      body: JSON.stringify(users),
    })
  }

  async getAudits(): Promise<LabelAudit[]> {
    return this.request<LabelAudit[]>("/audits")
  }

  async saveAudits(audits: LabelAudit[]): Promise<void> {
    await this.request("/audits/bulk", {
      method: "PUT",
      body: JSON.stringify(audits),
    })
  }

  async getCommentsByAuditItem(auditItemId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/comments?auditItemId=${auditItemId}`)
  }

  async getCommentThreads(auditItemId?: string): Promise<CommentThread[]> {
    const query = auditItemId ? `?auditItemId=${auditItemId}` : ""
    return this.request<CommentThread[]>(`/comments/threads${query}`)
  }

  async clearAllStorage(): Promise<void> {
    await this.request("/storage/clear", { method: "DELETE" })
  }
}
