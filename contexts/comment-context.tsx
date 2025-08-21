"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react"
import type { Comment, CommentThread, User, CommentReaction } from "@/types/comments"
import type { CommentStorageAdapter } from "@/lib/adapters"
import { LocalStorageAdapter } from "@/lib/adapters"
import { generateId } from "@/lib/comment-utils"
import { commentReducer, initialCommentState, type CommentState } from "@/lib/reducers/comment-reducer"
import { CommentEventEmitter, type CommentEventMap, type CommentEventListener } from "@/lib/comment-events"
import { useCommentConfig, type CommentConfig } from "@/hooks/use-comment-config"
import { extractMentionsAndTags } from "@/lib/utils/lexical-utils"
import type {
  CommentHooks,
  CommentHookRegistry,
  CommentHookContext,
  AddCommentHookData,
  UpdateCommentHookData,
  CommentHookData,
} from "@/types/comment-hooks"

const commentEvents = new CommentEventEmitter()

// Helper hook for subscribing to events in React components
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

interface CommentContextType {
  state: CommentState
  currentUser: User | null
  config: CommentConfig
  events: CommentEventEmitter
  hooks: CommentHookRegistry

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

interface CommentProviderProps {
  children: React.ReactNode
  initialUser?: User
  storageAdapter?: CommentStorageAdapter
  initialComments?: Comment[]
  config?: CommentConfig
  hooks?: Partial<CommentHooks>
}

export function CommentProvider({
  children,
  initialUser,
  storageAdapter,
  initialComments,
  config,
  hooks: initialHooks,
}: CommentProviderProps) {
  const [state, dispatch] = useReducer(commentReducer, {
    ...initialCommentState,
    comments: initialComments || [],
  })
  const [currentUser, setCurrentUser] = React.useState<User | null>(initialUser || null)
  const { config: currentConfig, updateConfig } = useCommentConfig(config)

  const adapter = useMemo(() => storageAdapter || new LocalStorageAdapter(), [storageAdapter])

  const [registeredHooks, setRegisteredHooks] = React.useState<CommentHooks>(() => {
    const hooks: CommentHooks = {}
    if (initialHooks) {
      Object.entries(initialHooks).forEach(([key, callbacks]) => {
        if (callbacks) {
          hooks[key as keyof CommentHooks] = Array.isArray(callbacks) ? callbacks : [callbacks]
        }
      })
    }
    return hooks
  })

  const hookRegistry: CommentHookRegistry = useMemo(
    () => ({
      registerHook: (hookName, callback) => {
        setRegisteredHooks((prev) => ({
          ...prev,
          [hookName]: [...(prev[hookName] || []), callback],
        }))
        return () => {
          setRegisteredHooks((prev) => ({
            ...prev,
            [hookName]: (prev[hookName] || []).filter((cb) => cb !== callback),
          }))
        }
      },
      unregisterHook: (hookName, callback) => {
        setRegisteredHooks((prev) => ({
          ...prev,
          [hookName]: (prev[hookName] || []).filter((cb) => cb !== callback),
        }))
      },
      executeHooks: async (hookName, data, context) => {
        const hooks = registeredHooks[hookName] || []
        let result = data

        for (const hook of hooks) {
          try {
            const hookResult = await hook(result, context)
            if (hookResult && typeof hookResult === "object") {
              result = { ...result, ...hookResult }
            }
          } catch (error) {
            console.error(`[v0] Hook ${hookName} failed:`, error)
            commentEvents.emit("error", {
              error: `Hook ${hookName} failed: ${error}`,
              action: "hook",
            })
          }
        }

        return result
      },
    }),
    [registeredHooks],
  )

  const createHookContext = useCallback((): CommentHookContext => {
    return {
      currentUser,
      config: currentConfig,
      existingComments: state.comments,
    }
  }, [currentUser, currentConfig, state.comments])

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

        const { mentions, tags } = extractMentionsAndTags(editorState)
        console.log("[v0] Extracted mentions:", mentions, "tags:", tags)

        const hookData: AddCommentHookData = {
          content,
          editorState,
          mentions,
          tags,
          sourceId: finalSourceId,
          sourceType: finalSourceType,
          parentId: finalParentId,
          user: currentUser,
        }

        const processedData = await hookRegistry.executeHooks("beforeAddComment", hookData, createHookContext())

        const newComment = await adapter.addLexicalComment(
          processedData.content,
          processedData.editorState,
          processedData.user,
          processedData.mentions,
          processedData.tags,
          processedData.sourceId,
          processedData.sourceType,
          processedData.parentId,
        )

        console.log("[v0] New comment created:", newComment)

        const commentHookData: CommentHookData = { comment: newComment }
        const processedComment = await hookRegistry.executeHooks(
          "beforeSaveComment",
          commentHookData,
          createHookContext(),
        )

        const finalComment = { ...newComment, ...processedComment }

        dispatch({ type: "ADD_COMMENT", payload: finalComment })
        commentEvents.emit("comment:added", { comment: finalComment, user: currentUser })

        await hookRegistry.executeHooks("afterAddComment", { comment: finalComment }, createHookContext())
        await hookRegistry.executeHooks("afterSaveComment", { comment: finalComment }, createHookContext())

        console.log("[v0] Comment added to state")
      } catch (error) {
        console.error("[v0] Error adding comment:", error)
        const errorMessage = "Failed to add comment"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "add" })
      }
    },
    [currentUser, state.comments, adapter, hookRegistry, createHookContext],
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
        if (!existingComment) return

        const previousContent = existingComment.content || ""

        const { mentions, tags } = extractMentionsAndTags(editorState)
        console.log("[v0] Extracted mentions for update:", mentions, "tags:", tags)

        const hookData: UpdateCommentHookData = {
          commentId,
          content,
          editorState,
          mentions,
          tags,
          existingComment,
        }

        const processedData = await hookRegistry.executeHooks("beforeUpdateComment", hookData, createHookContext())

        const updates = {
          content: processedData.content,
          editorState: processedData.editorState,
          isEdited: true,
          mentions: processedData.mentions,
          tags: processedData.tags,
        }

        dispatch({ type: "UPDATE_COMMENT", payload: { id: commentId, updates } })

        await adapter.updateCommentWithEditorState(
          commentId,
          processedData.content,
          processedData.editorState,
          processedData.mentions,
          processedData.tags,
        )

        const updatedComment = { ...existingComment, ...updates }

        const commentHookData: CommentHookData = { comment: updatedComment }
        const processedComment = await hookRegistry.executeHooks(
          "beforeSaveComment",
          commentHookData,
          createHookContext(),
        )

        const finalComment = { ...updatedComment, ...processedComment }

        commentEvents.emit("comment:updated", {
          comment: finalComment,
          previousContent,
          user: currentUser,
        })

        await hookRegistry.executeHooks("afterUpdateComment", { comment: finalComment }, createHookContext())
        await hookRegistry.executeHooks("afterSaveComment", { comment: finalComment }, createHookContext())

        console.log("[v0] Comment updated in storage successfully")
      } catch (error) {
        console.error("[v0] Error updating comment:", error)
        const errorMessage = "Failed to update comment"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        commentEvents.emit("error", { error: errorMessage, action: "update" })
      }
    },
    [adapter, currentUser, state.comments, hookRegistry, createHookContext],
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
    hooks: hookRegistry, // Added hook registry to context
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
