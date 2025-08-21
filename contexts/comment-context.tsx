"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react"
import type { Comment, CommentThread, User, CommentReaction } from "@/types/comments"
import type { CommentStorageAdapter } from "@/lib/adapters"
import { LocalStorageAdapter } from "@/lib/adapters"
import { generateId } from "@/lib/comment-utils"
import { commentReducer, initialCommentState, type CommentState } from "@/lib/reducers/comment-reducer"
import { commentEvents, type CommentEventEmitter } from "@/utils/comment-events"
import { useCommentConfig, type CommentConfig } from "@/hooks/use-comment-config"

// Context interface
interface CommentContextType {
  state: CommentState
  currentUser: User | null
  config: CommentConfig
  events: CommentEventEmitter

  addComment: (
    content: string,
    editorState: string,
    sourceId?: string,
    sourceType?: string,
    parentId?: string,
  ) => Promise<void>
  updateComment: (commentId: string, content: string, editorState: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  addReaction: (commentId: string, reactionType: string) => Promise<void>
  removeReaction: (commentId: string, reactionId: string) => Promise<void>

  // Data retrieval
  getCommentThreads: (sourceId?: string, sourceType?: string) => Promise<CommentThread[]>
  getCommentsBySource: (sourceId: string, sourceType?: string) => Comment[]
  getRepliesForComment: (parentId: string) => Comment[]

  // User management
  setCurrentUser: (user: User) => void
  refreshData: () => Promise<void>

  // Configuration management
  updateConfig: (newConfig: Partial<CommentConfig>) => void

  clearAllStorage: () => Promise<void>
}

// Create context
const CommentContext = createContext<CommentContextType | undefined>(undefined)

// Provider component
interface CommentProviderProps {
  children: React.ReactNode
  initialUser?: User
  storageAdapter?: CommentStorageAdapter
  initialComments?: Comment[]
  config?: CommentConfig
}

export function CommentProvider({
  children,
  initialUser,
  storageAdapter,
  initialComments,
  config,
}: CommentProviderProps) {
  const [state, dispatch] = useReducer(commentReducer, {
    ...initialCommentState,
    comments: initialComments || [],
  })
  const [currentUser, setCurrentUser] = React.useState<User | null>(initialUser || null)
  const { config: currentConfig, updateConfig } = useCommentConfig(config)

  const adapter = useMemo(() => storageAdapter || new LocalStorageAdapter(), [storageAdapter])

  useEffect(() => {
    if (initialComments) {
      console.log("[v0] Using provided initial data, skipping loadData")
      commentEvents.emit("comments:loaded", { comments: initialComments })
      return
    }

    const loadData = async () => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const comments = await adapter.getComments()
        const users = await adapter.getUsers()

        if (!initialComments) {
          dispatch({ type: "LOAD_COMMENTS", payload: comments })
          commentEvents.emit("comments:loaded", { comments })
        }

        if (!initialUser && !currentUser && users.length > 0) {
          setCurrentUser(users[0])
        }
      } catch (error) {
        const errorMessage = "Failed to load comments"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "load" })
      }
    }

    loadData()
  }, [adapter, initialComments])

  const addComment = useCallback(
    async (content: string, editorState: string, sourceId?: string, sourceType?: string, parentId?: string) => {
      if (!currentUser) {
        const errorMessage = "User must be logged in to comment"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "add" })
        return
      }

      try {
        console.log("[v0] Context addComment called with:", { content, sourceId, sourceType, parentId })

        let finalSourceId = sourceId
        let finalSourceType = sourceType
        let finalParentId = parentId

        if (parentId && !sourceId) {
          const parentComment = state.comments.find((c) => c.id === parentId)
          if (parentComment) {
            finalSourceId = parentComment.sourceId
            finalSourceType = parentComment.sourceType
            finalParentId = parentComment.parentId || parentId
            console.log("[v0] Reply inheriting sourceId/sourceType from parent:", finalSourceId, finalSourceType)
            console.log("[v0] Flat threading - using parent:", finalParentId)
          }
        }

        const newComment = await adapter.addLexicalComment(
          content,
          editorState,
          currentUser,
          [],
          [],
          finalSourceId,
          finalSourceType,
          finalParentId,
        )

        console.log("[v0] New comment created:", newComment)

        dispatch({ type: "ADD_COMMENT", payload: newComment })
        commentEvents.emit("comment:added", { comment: newComment, user: currentUser })

        console.log("[v0] Comment added to state")
      } catch (error) {
        console.error("[v0] Error adding comment:", error)
        const errorMessage = "Failed to add comment"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "add" })
      }
    },
    [currentUser, state.comments, adapter],
  )

  const updateComment = useCallback(
    async (commentId: string, content: string, editorState: string) => {
      if (!currentUser) return

      try {
        console.log("[v0] updateComment called with:", {
          commentId,
          content,
          editorState: editorState ? "present" : "undefined",
        })

        if (!editorState) {
          console.error("[v0] ERROR: editorState is undefined in updateComment!")
          return
        }

        const existingComment = state.comments.find((c) => c.id === commentId)
        const previousContent = existingComment?.content || ""

        const updates = { content, editorState, isEdited: true }

        dispatch({ type: "UPDATE_COMMENT", payload: { id: commentId, updates } })

        await adapter.updateCommentWithEditorState(commentId, content, editorState)

        if (existingComment) {
          commentEvents.emit("comment:updated", {
            comment: { ...existingComment, ...updates },
            previousContent,
            user: currentUser,
          })
        }

        console.log("[v0] Comment updated in storage successfully")
      } catch (error) {
        console.error("[v0] Error updating comment:", error)
        const errorMessage = "Failed to update comment"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "update" })
      }
    },
    [adapter, currentUser, state.comments],
  )

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!currentUser) return

      try {
        dispatch({ type: "DELETE_COMMENT", payload: commentId })

        await adapter.deleteComment(commentId)

        commentEvents.emit("comment:deleted", { commentId, user: currentUser })
      } catch (error) {
        const errorMessage = "Failed to delete comment"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "delete" })
      }
    },
    [adapter, currentUser],
  )

  const addReaction = useCallback(
    async (commentId: string, reactionType: string) => {
      if (!currentUser) return

      try {
        const comment = state.comments.find((c) => c.id === commentId)
        const existingReaction = comment?.reactions.find((r) => r.userId === currentUser.id && r.type === reactionType)

        if (existingReaction) {
          dispatch({
            type: "REMOVE_REACTION",
            payload: { commentId, reactionId: existingReaction.id },
          })
          commentEvents.emit("reaction:removed", { commentId, reactionId: existingReaction.id, user: currentUser })
        } else {
          const newReaction: CommentReaction = {
            id: generateId(),
            userId: currentUser.id,
            type: reactionType as any,
            createdAt: new Date(),
          }

          dispatch({
            type: "ADD_REACTION",
            payload: { commentId, reaction: newReaction },
          })
          commentEvents.emit("reaction:added", { commentId, reaction: newReaction, user: currentUser })
        }

        const updatedComments = state.comments.map((c) => {
          if (c.id === commentId) {
            const reactions = existingReaction
              ? c.reactions.filter((r) => r.id !== existingReaction.id)
              : [
                  ...c.reactions,
                  {
                    id: generateId(),
                    userId: currentUser.id,
                    type: reactionType as any,
                    createdAt: new Date(),
                  },
                ]
            return { ...c, reactions }
          }
          return c
        })

        await adapter.saveComments(updatedComments)
      } catch (error) {
        const errorMessage = "Failed to add reaction"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "reaction" })
      }
    },
    [currentUser, state.comments, adapter],
  )

  const removeReaction = useCallback(
    async (commentId: string, reactionId: string) => {
      if (!currentUser) return

      try {
        dispatch({ type: "REMOVE_REACTION", payload: { commentId, reactionId } })

        const updatedComments = state.comments.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              reactions: c.reactions.filter((r) => r.id !== reactionId),
            }
          }
          return c
        })

        await adapter.saveComments(updatedComments)

        commentEvents.emit("reaction:removed", { commentId, reactionId, user: currentUser })
      } catch (error) {
        const errorMessage = "Failed to remove reaction"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "reaction" })
      }
    },
    [state.comments, adapter, currentUser],
  )

  const getCommentThreads = useCallback(
    async (sourceId?: string, sourceType?: string): Promise<CommentThread[]> => {
      return await adapter.getCommentThreads(sourceId, sourceType)
    },
    [adapter],
  )

  const getCommentsBySource = useCallback(
    (sourceId: string, sourceType?: string): Comment[] => {
      const topLevelComments = state.comments.filter(
        (comment) =>
          comment.sourceId === sourceId && (!sourceType || comment.sourceType === sourceType) && !comment.parentId,
      )
      console.log(
        "[v0] getCommentsBySource found",
        topLevelComments.length,
        "top-level comments for sourceId:",
        sourceId,
        "sourceType:",
        sourceType,
      )
      return topLevelComments
    },
    [state.comments],
  )

  const getRepliesForComment = useCallback(
    (parentId: string): Comment[] => {
      const replies = state.comments.filter((comment) => comment.parentId === parentId)
      console.log("[v0] getRepliesForComment found", replies.length, "replies for parentId:", parentId)
      return replies
    },
    [state.comments],
  )

  const refreshData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const comments = await adapter.getComments()

      dispatch({ type: "LOAD_COMMENTS", payload: comments })
      commentEvents.emit("comments:loaded", { comments })
    } catch (error) {
      const errorMessage = "Failed to refresh data"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      commentEvents.emit("error", { error: errorMessage, action: "refresh" })
    }
  }, [adapter])

  const clearAllStorage = useCallback(async () => {
    if (!currentUser) return

    try {
      await adapter.clearAllStorage()
      dispatch({ type: "LOAD_COMMENTS", payload: [] })
      commentEvents.emit("comments:cleared", { user: currentUser })
      console.log("[v0] Storage cleared successfully")
    } catch (error) {
      console.error("[v0] Error clearing storage:", error)
      const errorMessage = "Failed to clear storage"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      commentEvents.emit("error", { error: errorMessage, action: "clear" })
    }
  }, [adapter, currentUser])

  const contextValue: CommentContextType = {
    state,
    currentUser,
    config: currentConfig,
    events: commentEvents,
    addComment,
    updateComment,
    deleteComment,
    addReaction,
    removeReaction,
    getCommentThreads,
    getCommentsBySource,
    getRepliesForComment,
    setCurrentUser,
    refreshData,
    updateConfig,
    clearAllStorage,
  }

  return <CommentContext.Provider value={contextValue}>{children}</CommentContext.Provider>
}

// Hook to use comment context
export function useComments() {
  const context = useContext(CommentContext)
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider")
  }
  return context
}

export { useCommentEvent } from "@/utils/comment-events"
