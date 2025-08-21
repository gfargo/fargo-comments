"use client"

import React from "react"

import type { Comment, CommentReaction, User } from "@/types/comments"

// Event types that can be emitted
export interface CommentEventMap {
  "comment:added": { comment: Comment; user: User }
  "comment:updated": { comment: Comment; updates: Partial<Comment>; user: User }
  "comment:deleted": { commentId: string; user: User }
  "reaction:added": { commentId: string; reaction: CommentReaction; user: User }
  "reaction:removed": { commentId: string; reactionId: string; user: User }
  "comments:loaded": { comments: Comment[] }
  error: { error: string; action?: string }
}

export type CommentEventType = keyof CommentEventMap
export type CommentEventHandler<T extends CommentEventType> = (data: CommentEventMap[T]) => void

// Simple event emitter for comment events
export class CommentEventEmitter {
  private listeners: Map<CommentEventType, Set<CommentEventHandler<any>>> = new Map()

  // Subscribe to an event
  on<T extends CommentEventType>(event: T, handler: CommentEventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler)
    }
  }

  // Emit an event
  emit<T extends CommentEventType>(event: T, data: CommentEventMap[T]): void {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in comment event handler for ${event}:`, error)
        }
      })
    }
  }

  // Remove all listeners for an event
  off(event: CommentEventType): void {
    this.listeners.delete(event)
  }

  // Remove all listeners
  removeAllListeners(): void {
    this.listeners.clear()
  }

  // Get listener count for debugging
  listenerCount(event: CommentEventType): number {
    return this.listeners.get(event)?.size || 0
  }
}

// Global event emitter instance
export const commentEvents = new CommentEventEmitter()

// Hook for subscribing to comment events in React components
export function useCommentEvents<T extends CommentEventType>(
  event: T,
  handler: CommentEventHandler<T>,
  deps: React.DependencyList = [],
): void {
  React.useEffect(() => {
    const unsubscribe = commentEvents.on(event, handler)
    return unsubscribe
  }, deps)
}
