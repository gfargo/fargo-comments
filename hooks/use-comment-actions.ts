"use client"

import { useCallback, useState, useTransition } from "react"
import { useComments } from "@/contexts/comment-context"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/types/comments"

export function useCommentActions() {
  const {
    addComment,
    updateComment,
    deleteComment,
    addReaction,
    removeReaction,
    currentUser,
    getRepliesForComment,
    state,
  } = useComments()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showComposer, setShowComposer] = useState(false)
  const [replyContext, setReplyContext] = useState<{ commentId: string; authorName: string } | null>(null)

  const findRootParent = useCallback((commentId: string, comments: Comment[]): string => {
    const comment = comments.find((c) => c.id === commentId)
    if (!comment) {
      return commentId
    }

    // If this comment has no parent, it's already the root
    if (!comment.parentId) {
      return commentId
    }

    // Traverse up the parent chain to find the root
    let currentComment = comment
    while (currentComment.parentId) {
      const parentComment = comments.find((c) => c.id === currentComment.parentId)
      if (!parentComment) {
        break
      }
      currentComment = parentComment
    }

    return currentComment.id
  }, [])

  const handleAddComment = useCallback(
    async (content: string, editorState: string, sourceId?: string, sourceType?: string, parentId?: string) => {
      startTransition(async () => {
        try {
          await addComment(content, editorState, sourceId, sourceType, parentId)
          toast({
            title: "Comment added",
            description: "Your comment has been posted successfully.",
          })
          setShowComposer(false)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to add comment. Please try again.",
            variant: "destructive",
          })
        }
      })
    },
    [addComment, toast],
  )

  const handleUpdateComment = useCallback(
    async (commentId: string, content: string, editorState: string) => {
      startTransition(async () => {
        try {
          await updateComment(commentId, content, editorState)
          toast({
            title: "Comment updated",
            description: "Your comment has been updated successfully.",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update comment. Please try again.",
            variant: "destructive",
          })
        }
      })
    },
    [updateComment, toast],
  )

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      startTransition(async () => {
        try {
          await deleteComment(commentId)
          toast({
            title: "Comment deleted",
            description: "The comment has been deleted successfully.",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete comment. Please try again.",
            variant: "destructive",
          })
        }
      })
    },
    [deleteComment, toast],
  )

  const handleReaction = useCallback(
    async (commentId: string, reactionType: string) => {
      startTransition(async () => {
        try {
          await addReaction(commentId, reactionType)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to add reaction. Please try again.",
            variant: "destructive",
          })
        }
      })
    },
    [addReaction, toast],
  )

  const handleStartReply = useCallback(
    (commentId: string) => {
      const comment = state.comments.find((c) => c.id === commentId)
      if (comment) {
        setReplyContext({
          commentId,
          authorName: comment.author.name,
        })
      }
      setReplyingTo(commentId)
    },
    [state.comments],
  )

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null)
    setReplyContext(null)
  }, [])

  const handleReplySubmit = useCallback(
    async (content: string, editorState: string, replyToId: string, comments: Comment[]) => {
      const rootParentId = findRootParent(replyToId, comments)
      const parentComment = comments.find((c) => c.id === rootParentId)

      // Inherit source information from parent comment
      const sourceId = parentComment?.sourceId
      const sourceType = parentComment?.sourceType

      console.log("[v0] Reply submission - parentId:", rootParentId, "sourceId:", sourceId, "sourceType:", sourceType)

      await handleAddComment(content, editorState, sourceId, sourceType, rootParentId)
      setReplyingTo(null)
      setReplyContext(null)
    },
    [handleAddComment, findRootParent],
  )

  const handleReply = useCallback(
    async (content: string, editorState: string, parentId: string) => {
      startTransition(async () => {
        try {
          const rootParentId = findRootParent(parentId, state.comments)
          const parentComment = state.comments.find((c) => c.id === rootParentId)

          // Inherit source information from root parent comment
          const sourceId = parentComment?.sourceId
          const sourceType = parentComment?.sourceType

          console.log(
            "[v0] Reply submission - parentId:",
            rootParentId,
            "sourceId:",
            sourceId,
            "sourceType:",
            sourceType,
          )

          await addComment(content, editorState, sourceId, sourceType, rootParentId)
          toast({
            title: "Reply added",
            description: "Your reply has been posted successfully.",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to add reply. Please try again.",
            variant: "destructive",
          })
        }
      })
    },
    [addComment, toast, state.comments, findRootParent],
  )

  const handleToggleComposer = useCallback(() => {
    setShowComposer(!showComposer)
  }, [showComposer])

  const handleCommentSubmit = useCallback(
    async (content: string, editorState: string, sourceId?: string, sourceType?: string) => {
      await handleAddComment(content, editorState, sourceId, sourceType)
    },
    [handleAddComment],
  )

  const handleLike = useCallback((commentId: string) => handleReaction(commentId, "like"), [handleReaction])
  const handleShare = useCallback((commentId: string) => console.log("[v0] Share clicked for comment:", commentId), [])
  const handleForward = useCallback(
    (commentId: string) => console.log("[v0] Forward clicked for comment:", commentId),
    [],
  )
  const handleApprove = useCallback(
    (commentId: string) => console.log("[v0] Approve clicked for comment:", commentId),
    [],
  )
  const handleReact = useCallback(
    (commentId: string, reaction: string) => handleReaction(commentId, reaction),
    [handleReaction],
  )

  return {
    // Core actions with loading states
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleReaction,

    // Reply management
    handleStartReply,
    handleCancelReply,
    handleReplySubmit,
    handleReply, // Added handleReply to exports
    replyingTo,
    replyContext,

    // Composer management
    handleToggleComposer,
    handleCommentSubmit,
    showComposer,

    // Variant-specific actions
    handleLike,
    handleShare,
    handleForward,
    handleApprove,
    handleReact,

    // Utilities
    findRootParent,
    currentUser,
    isPending,
  }
}
