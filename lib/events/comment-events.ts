"use client"

import React from "react"
import type { Comment, CommentReaction, User } from "@/types/comments"

// Event types that can be emitted
export interface CommentEventMap {
  "comment:added": { comment: Comment; user: User }
  "comment:updated": { comment: Comment; previousContent: string; user: User }
  "comment:deleted": { commentId: string; user: User }
  "reaction:added": { commentId: string; reaction: CommentReaction; user: User }
  "reaction:removed": { commentId: string; reactionId: string; user: User }
  "comments:loaded": { comments: Comment[] }
  "error:occurred": { error: string; action: string }
}

// Event listener type
export type CommentEventListener<T extends keyof CommentEventMap> = (data: CommentEventMap[T]) => void

// Simple event emitter for comment events
export class CommentEventEmitter {
  private listeners: Map<keyof CommentEventMap, Set<CommentEventListener<any>>> = new Map()

  // Subscribe to an event
  on<T extends keyof CommentEventMap>(event: T, listener: CommentEventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener)
    }
  }

  // Emit an event
  emit<T extends keyof CommentEventMap>(event: T, data: CommentEventMap[T]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Error in comment event listener for ${event}:`, error)
        }
      })
    }
  }

  // Remove all listeners for an event
  off(event: keyof CommentEventMap): void {
    this.listeners.delete(event)
  }

  // Remove all listeners
  removeAllListeners(): void {
    this.listeners.clear()
  }

  // Get listener count for debugging
  getListenerCount(event: keyof CommentEventMap): number {
    return this.listeners.get(event)?.size || 0
  }
}

// Global event emitter instance
export const commentEvents = new CommentEventEmitter()

// Convenience hook for subscribing to events in React components
export function useCommentEvent<T extends keyof CommentEventMap>(
  event: T,
  listener: CommentEventListener<T>,
  deps: React.DependencyList = [],
): void {
  React.useEffect(() => {
    const unsubscribe = commentEvents.on(event, listener)
    return unsubscribe
  }, deps)
}
