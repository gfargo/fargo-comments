"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react"
import type { Comment, CommentThread, User, CommentReaction } from "@/types/comments"
import type { CommentStorageAdapter } from "@/lib/adapters"
import { LocalStorageAdapter } from "@/lib/adapters"
import { generateId } from "@/lib/comment-utils"

// Action types for comment reducer
type CommentAction =
  | { type: "LOAD_COMMENTS"; payload: Comment[] }
  | { type: "ADD_COMMENT"; payload: Comment }
  | { type: "UPDATE_COMMENT"; payload: { id: string; updates: Partial<Comment> } }
  | { type: "DELETE_COMMENT"; payload: string }
  | { type: "ADD_REACTION"; payload: { commentId: string; reaction: CommentReaction } }
  | { type: "REMOVE_REACTION"; payload: { commentId: string; reactionId: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

// Comment state interface
interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

// Configuration interfaces for editor features
interface EditorFeatures {
  lists?: boolean
  checkLists?: boolean
  autoLink?: boolean
  mentions?: boolean
  emoji?: boolean
  autoList?: boolean
}

interface CommentConfig {
  theme?: "light" | "dark" | "auto"
  editorFeatures?: EditorFeatures
  placeholder?: string
  variant?: "default" | "compact" | "inline"
}

// Context interface
interface CommentContextType {
  state: CommentState
  currentUser: User | null
  config: CommentConfig

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

// Initial state
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
}

// Default configuration
const defaultConfig: CommentConfig = {
  theme: "auto",
  editorFeatures: {
    lists: true,
    checkLists: true,
    autoLink: true,
    mentions: true,
    emoji: true,
    autoList: true,
  },
  placeholder: "Add a comment...",
  variant: "compact",
}

// Comment reducer
function commentReducer(state: CommentState, action: CommentAction): CommentState {
  switch (action.type) {
    case "LOAD_COMMENTS":
      return {
        ...state,
        comments: action.payload,
        loading: false,
        error: null,
      }

    case "ADD_COMMENT":
      return {
        ...state,
        comments: [...state.comments, action.payload],
        error: null,
      }

    case "UPDATE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.id
            ? { ...comment, ...action.payload.updates, isEdited: true, updatedAt: new Date() }
            : comment,
        ),
        error: null,
      }

    case "DELETE_COMMENT":
      return {
        ...state,
        comments: state.comments.filter((comment) => comment.id !== action.payload),
        error: null,
      }

    case "ADD_REACTION":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.commentId
            ? {
                ...comment,
                reactions: [...comment.reactions, action.payload.reaction],
              }
            : comment,
        ),
        error: null,
      }

    case "REMOVE_REACTION":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.commentId
            ? {
                ...comment,
                reactions: comment.reactions.filter((r) => r.id !== action.payload.reactionId),
              }
            : comment,
        ),
        error: null,
      }

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    default:
      return state
  }
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
    ...initialState,
    comments: initialComments || [],
  })
  const [currentUser, setCurrentUser] = React.useState<User | null>(initialUser || null)
  const [currentConfig, setCurrentConfig] = React.useState<CommentConfig>({
    ...defaultConfig,
    ...config,
    editorFeatures: {
      ...defaultConfig.editorFeatures,
      ...config?.editorFeatures,
    },
  })

  const adapter = useMemo(() => storageAdapter || new LocalStorageAdapter(), [storageAdapter])

  useEffect(() => {
    if (initialComments) {
      console.log("[v0] Using provided initial data, skipping loadData")
      return
    }

    const loadData = async () => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const comments = await adapter.getComments()
        const users = await adapter.getUsers()

        if (!initialComments) {
          dispatch({ type: "LOAD_COMMENTS", payload: comments })
        }

        if (!initialUser && !currentUser && users.length > 0) {
          setCurrentUser(users[0])
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load comments" })
      }
    }

    loadData()
  }, [adapter, initialComments])

  const addComment = useCallback(
    async (content: string, editorState: string, sourceId?: string, sourceType?: string, parentId?: string) => {
      if (!currentUser) {
        dispatch({ type: "SET_ERROR", payload: "User must be logged in to comment" })
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

        console.log("[v0] Comment added to state")
      } catch (error) {
        console.error("[v0] Error adding comment:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to add comment" })
      }
    },
    [currentUser, state.comments, adapter],
  )

  const updateComment = useCallback(
    async (commentId: string, content: string, editorState: string) => {
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

        const updates = { content, editorState, isEdited: true }

        dispatch({ type: "UPDATE_COMMENT", payload: { id: commentId, updates } })

        await adapter.updateCommentWithEditorState(commentId, content, editorState)

        console.log("[v0] Comment updated in storage successfully")
      } catch (error) {
        console.error("[v0] Error updating comment:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to update comment" })
      }
    },
    [adapter],
  )

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        dispatch({ type: "DELETE_COMMENT", payload: commentId })

        await adapter.deleteComment(commentId)
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to delete comment" })
      }
    },
    [adapter],
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
        dispatch({ type: "SET_ERROR", payload: "Failed to add reaction" })
      }
    },
    [currentUser, state.comments, adapter],
  )

  const removeReaction = useCallback(
    async (commentId: string, reactionId: string) => {
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
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to remove reaction" })
      }
    },
    [state.comments, adapter],
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
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to refresh data" })
    }
  }, [adapter])

  const clearAllStorage = useCallback(async () => {
    try {
      await adapter.clearAllStorage()
      dispatch({ type: "LOAD_COMMENTS", payload: [] })
      console.log("[v0] Storage cleared successfully")
    } catch (error) {
      console.error("[v0] Error clearing storage:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to clear storage" })
    }
  }, [adapter])

  const updateConfig = useCallback((newConfig: Partial<CommentConfig>) => {
    setCurrentConfig((prev) => ({
      ...prev,
      ...newConfig,
      editorFeatures: {
        ...prev.editorFeatures,
        ...newConfig.editorFeatures,
      },
    }))
  }, [])

  const contextValue: CommentContextType = {
    state,
    currentUser,
    config: currentConfig,
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
