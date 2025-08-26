"use client"

import React from "react"

import type { Comment, CommentReaction, User } from "@/lib/types/comments"

// Event types that can be emitted
export interface CommentEventMap {
  "comment:added": { comment: Comment; user: User }
  "comment:updated": { comment: Comment; previousContent: string; user: User }
  "comment:deleted": { commentId: string; user: User }
  "reaction:added": { commentId: string; reaction: CommentReaction; user: User }
  "reaction:removed": { commentId: string; reactionId: string; user: User }
  "comments:loaded": { comments: Comment[] }
  "comments:cleared": { user: User }
  error: { error: string; action?: string }
}

// Event listener type
export type CommentEventListener<T extends keyof CommentEventMap> = (
  data: CommentEventMap[T]
) => void

// Event emitter class for comment system
export class CommentEventEmitter {
  private listeners: Map<
    keyof CommentEventMap,
    Set<CommentEventListener<keyof CommentEventMap>>
  > = new Map()

  // Subscribe to an event
  on<T extends keyof CommentEventMap>(
    event: T,
    listener: CommentEventListener<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(listener as CommentEventListener<keyof CommentEventMap>)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener as CommentEventListener<keyof CommentEventMap>)
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
  off<T extends keyof CommentEventMap>(event: T): void {
    this.listeners.delete(event)
  }

  // Remove all listeners
  removeAllListeners(): void {
    this.listeners.clear()
  }

  // Get listener count for debugging
  getListenerCount<T extends keyof CommentEventMap>(event: T): number {
    return this.listeners.get(event)?.size || 0
  }
}

// Create a singleton instance for the comment system
export const commentEvents = new CommentEventEmitter()

// Helper hook for subscribing to events in React components
export function useCommentEvent<T extends keyof CommentEventMap>(
  event: T,
  listener: CommentEventListener<T>
): void {
  React.useEffect(() => {
    const unsubscribe = commentEvents.on(event, listener)
    return unsubscribe
  }, [event, listener])
}
