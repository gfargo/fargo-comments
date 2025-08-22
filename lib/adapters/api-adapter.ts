import type { Comment, CommentThread, User } from "@/lib/types/comments"
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
    sourceId?: string,
    sourceType?: string,
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
        sourceId,
        sourceType,
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

  async getCommentsBySource(sourceId: string, sourceType?: string): Promise<Comment[]> {
    const query = `?sourceId=${sourceId}${sourceType ? `&sourceType=${sourceType}` : ''}`;
    return this.request<Comment[]>(`/comments${query}`);
  }

  async getCommentThreads(sourceId?: string, sourceType?: string): Promise<CommentThread[]> {
    const query = sourceId ? `?sourceId=${sourceId}${sourceType ? `&sourceType=${sourceType}` : ''}` : "";
    return this.request<CommentThread[]>(`/comments/threads${query}`)
  }

  async clearAllStorage(): Promise<void> {
    await this.request("/storage/clear", { method: "DELETE" })
  }
}