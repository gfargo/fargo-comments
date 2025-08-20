"use client"

import { useMemo } from "react"
import { useComments } from "@/contexts/comment-context"

export function useAuditComments(auditId: string) {
  const { state, audits, getCommentsByAuditItem } = useComments()

  const audit = useMemo(() => {
    return audits.find((a) => a.id === auditId)
  }, [audits, auditId])

  const auditItemsWithComments = useMemo(() => {
    if (!audit) return []

    return audit.auditItems.map((item) => {
      const comments = getCommentsByAuditItem(item.id)
      const unresolvedComments = comments.filter((comment) => !comment.reactions.some((r) => r.type === "resolved"))

      return {
        ...item,
        commentCount: comments.length,
        unresolvedCount: unresolvedComments.length,
        hasComments: comments.length > 0,
        hasUnresolved: unresolvedComments.length > 0,
      }
    })
  }, [audit, getCommentsByAuditItem, state.comments])

  const totalComments = useMemo(() => {
    return auditItemsWithComments.reduce((sum, item) => sum + item.commentCount, 0)
  }, [auditItemsWithComments])

  const totalUnresolved = useMemo(() => {
    return auditItemsWithComments.reduce((sum, item) => sum + item.unresolvedCount, 0)
  }, [auditItemsWithComments])

  return {
    audit,
    auditItemsWithComments,
    totalComments,
    totalUnresolved,
    loading: state.loading,
    error: state.error,
  }
}
