"use client"

import { useMemo } from "react"
import { useComments } from "@/lib/comments/contexts/comment-context"

export function useCommentsFromSource(sourceId: string, sourceType?: string) {
  const { state, getCommentsBySource } = useComments()

  const comments = useMemo(() => {
    return getCommentsBySource(sourceId, sourceType)
  }, [getCommentsBySource, sourceId, sourceType])

  const commentStats = useMemo(() => {
    const unresolvedComments = comments.filter((comment) => !comment.reactions.some((r) => r.type === "resolved"))

    return {
      totalComments: comments.length,
      unresolvedCount: unresolvedComments.length,
      hasComments: comments.length > 0,
      hasUnresolved: unresolvedComments.length > 0,
    }
  }, [comments])

  return {
    comments,
    ...commentStats,
    loading: state.loading,
    error: state.error,
  }
}
