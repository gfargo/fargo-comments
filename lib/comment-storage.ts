// Local storage utilities for comment persistence (without database)

import type { Comment, CommentThread, User } from "@/types/comments"
import { generateId } from "@/lib/comment-utils"

const STORAGE_KEYS = {
  COMMENTS: "cpg_comments_v2", // Fresh start with new key
  USERS: "cpg_users",
} as const

export class CommentStorage {
  // Comments
  static getComments(): Comment[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS)
    if (!stored) return []

    const comments = JSON.parse(stored)
    return comments.map((comment: any) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }))
  }

  static saveComments(comments: Comment[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
  }

  static addComment(comment: Comment): void {
    const comments = this.getComments()
    comments.push({
      ...comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    this.saveComments(comments)
  }

  static updateComment(commentId: string, updates: Partial<Comment>): void {
    const comments = this.getComments()
    const index = comments.findIndex((c) => c.id === commentId)
    if (index !== -1) {
      comments[index] = {
        ...comments[index],
        ...updates,
        updatedAt: new Date(),
        isEdited: true,
      }
      this.saveComments(comments)
    }
  }

  static deleteComment(commentId: string): void {
    const comments = this.getComments()
    const filtered = comments.filter((c) => c.id !== commentId)
    this.saveComments(filtered)
  }

  static addLexicalComment(
    content: string,
    editorState: string,
    author: User,
    mentions: any[] = [],
    tags: any[] = [],
    sourceId?: string,
    sourceType?: string,
    parentId?: string,
  ): Comment {
    const comment: Comment = {
      id: generateId(),
      content,
      editorState, // Store the Lexical editor state JSON
      authorId: author.id,
      author,
      sourceId,
      sourceType,
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      mentions: mentions.map((m) => m.value || m.name || m),
      tags: tags.map((t) => t.value || t.label || t),
      reactions: [],
      status: "active",
    }

    this.addComment(comment)
    console.log("[v0] Comment added to storage:", comment)
    return comment
  }

  static updateCommentWithEditorState(commentId: string, content: string, editorState: string): void {
    const comments = this.getComments()
    const index = comments.findIndex((c) => c.id === commentId)
    if (index !== -1) {
      comments[index] = {
        ...comments[index],
        content,
        editorState, // Update the editor state
        updatedAt: new Date(),
        isEdited: true,
      }
      this.saveComments(comments)
    }
  }

  // Users
  static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    return stored ? JSON.parse(stored) : this.getDefaultUsers()
  }

  static saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }

  static getCommentsBySource(sourceId: string, sourceType?: string): Comment[] {
    const comments = this.getComments()
    return comments.filter((c) => {
      if (sourceType) {
        return c.sourceId === sourceId && c.sourceType === sourceType
      }
      return c.sourceId === sourceId
    })
  }

  static getCommentThreads(sourceId?: string, sourceType?: string): CommentThread[] {
    const comments = sourceId ? this.getCommentsBySource(sourceId, sourceType) : this.getComments()

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

  // Default data for demo purposes
  private static getDefaultUsers(): User[] {
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

  static clearAllStorage(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.COMMENTS)
    localStorage.removeItem(STORAGE_KEYS.USERS)
  }
}
