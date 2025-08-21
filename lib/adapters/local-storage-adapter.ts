import type { Comment, CommentThread, User, LabelAudit } from "@/types/comments"
import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"
import { generateId } from "@/lib/comment-utils"
import { extractMentionsAndTags } from "@/lib/utils/lexical-utils"

export class LocalStorageAdapter implements CommentStorageAdapter {
  private readonly STORAGE_KEYS = {
    COMMENTS: "cpg_comments_v2",
    USERS: "cpg_users",
    AUDITS: "cpg_audits",
  } as const

  constructor(private config: StorageAdapterConfig = {}) {}

  async getComments(): Promise<Comment[]> {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEYS.COMMENTS)
    if (!stored) return []

    const comments = JSON.parse(stored)
    return comments.map((comment: any) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }))
  }

  async saveComments(comments: Comment[]): Promise<void> {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
  }

  async addComment(comment: Comment): Promise<void> {
    const comments = await this.getComments()
    comments.push({
      ...comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.saveComments(comments)
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<void> {
    const comments = await this.getComments()
    const index = comments.findIndex((c) => c.id === commentId)
    if (index !== -1) {
      comments[index] = {
        ...comments[index],
        ...updates,
        updatedAt: new Date(),
        isEdited: true,
      }
      await this.saveComments(comments)
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    const comments = await this.getComments()
    const filtered = comments.filter((c) => c.id !== commentId)
    await this.saveComments(filtered)
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
    const extracted = extractMentionsAndTags(editorState)
    const finalMentions = mentions.length > 0 ? mentions : extracted.mentions
    const finalTags = tags.length > 0 ? tags : extracted.tags

    const comment: Comment = {
      id: generateId(),
      content,
      editorState,
      authorId: author.id,
      author,
      sourceId,
      sourceType,
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      mentions: finalMentions.map((m) => m.value || m.name || m),
      tags: finalTags.map((t) => t.value || t.label || t),
      reactions: [],
      status: "active",
    }

    await this.addComment(comment)
    console.log("[v0] Comment added to storage:", comment)
    return comment
  }

  async updateCommentWithEditorState(
    commentId: string,
    content: string,
    editorState: string,
    mentions?: any[],
    tags?: any[],
  ): Promise<void> {
    const comments = await this.getComments()
    const index = comments.findIndex((c) => c.id === commentId)
    if (index !== -1) {
      const extracted = extractMentionsAndTags(editorState)
      const finalMentions = mentions || extracted.mentions
      const finalTags = tags || extracted.tags

      comments[index] = {
        ...comments[index],
        content,
        editorState,
        mentions: finalMentions.map((m) => m.value || m.name || m),
        tags: finalTags.map((t) => t.value || t.label || t),
        updatedAt: new Date(),
        isEdited: true,
      }
      await this.saveComments(comments)
    }
  }

  async getUsers(): Promise<User[]> {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEYS.USERS)
    return stored ? JSON.parse(stored) : this.getDefaultUsers()
  }

  async saveUsers(users: User[]): Promise<void> {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users))
  }

  async getAudits(): Promise<LabelAudit[]> {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEYS.AUDITS)
    return stored ? JSON.parse(stored) : this.getDefaultAudits()
  }

  async saveAudits(audits: LabelAudit[]): Promise<void> {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(audits))
  }

  async getCommentsBySource(sourceId: string, sourceType?: string): Promise<Comment[]> {
    const comments = await this.getComments()
    return comments.filter((c) => {
      if (sourceType) {
        return c.sourceId === sourceId && c.sourceType === sourceType
      }
      return c.sourceId === sourceId
    })
  }

  async getCommentThreads(sourceId?: string, sourceType?: string): Promise<CommentThread[]> {
    const comments = sourceId ? await this.getCommentsBySource(sourceId, sourceType) : await this.getComments()

    const rootComments = comments.filter((c) => !c.parentId)

    return rootComments.map((rootComment) => {
      const replies = comments.filter((c) => c.parentId === rootComment.id)
      return {
        id: rootComment.id,
        rootComment,
        replies,
        totalReplies: replies.length,
        lastActivity:
          replies.length > 0 ? new Date(Math.max(...replies.map((r) => r.createdAt.getTime()))) : rootComment.createdAt,
      }
    })
  }

  async clearAllStorage(): Promise<void> {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.STORAGE_KEYS.COMMENTS)
    localStorage.removeItem(this.STORAGE_KEYS.USERS)
    localStorage.removeItem(this.STORAGE_KEYS.AUDITS)
  }

  private getDefaultUsers(): User[] {
    const users = [
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@cpgaudit.com",
        role: "auditor" as const,
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        name: "Mike Rodriguez",
        email: "mike@cpgaudit.com",
        role: "reviewer" as const,
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "3",
        name: "Emily Johnson",
        email: "emily@brandcorp.com",
        role: "client" as const,
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date("2024-02-01"),
      },
    ]
    this.saveUsers(users)
    return users
  }

  private getDefaultAudits(): any[] {
    return []
  }
}
