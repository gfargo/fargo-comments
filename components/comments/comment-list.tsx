"use client"

import { useMemo } from "react"
import { CommentVariation } from "@/components/comments/comment-variations"
import { CommentSearch } from "@/components/comments/comment-search"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Plus, SortAsc, X } from "lucide-react"
import { useCommentActions } from "@/hooks/use-comment-actions"
import type { Comment, User } from "@/types/comments"
import { useState } from "react"

interface CommentListProps {
  comments: Comment[]
  currentUser: User
  sourceId?: string
  sourceType?: string
  title?: string
  variant?: string
  enableSearch?: boolean
  enableSorting?: boolean
  showAddForm?: boolean
  showComposerByDefault?: boolean
  onAddComment?: (content: string, editorState: string, sourceId?: string, sourceType?: string) => void
  onReply?: (content: string, editorState: string, parentId: string) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete?: (commentId: string) => void
  onLike?: (commentId: string) => void
  onShare?: (commentId: string) => void
  onForward?: (commentId: string) => void
  onApprove?: (commentId: string) => void
  onReact?: (commentId: string, reaction: string) => void
  getRepliesForComment?: (commentId: string) => Comment[]
}

type SortOption = "newest" | "oldest" | "most-replies" | "author"

export function CommentList({
  comments,
  currentUser,
  sourceId,
  sourceType,
  title = "Comments",
  variant = "card",
  enableSearch = false,
  enableSorting = false,
  showAddForm = true,
  showComposerByDefault = false,
  onAddComment,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onShare,
  onForward,
  onApprove,
  onReact,
  getRepliesForComment,
}: CommentListProps) {
  const {
    handleCommentSubmit,
    handleReplySubmit,
    handleStartReply,
    handleCancelReply,
    handleToggleComposer,
    replyingTo,
    replyContext,
    showComposer: hookShowComposer,
    isPending,
    handleLike: hookHandleLike,
    handleShare: hookHandleShare,
    handleForward: hookHandleForward,
    handleApprove: hookHandleApprove,
    handleReact: hookHandleReact,
  } = useCommentActions()

  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filteredComments, setFilteredComments] = useState<Comment[]>(comments)
  const [composerKey, setComposerKey] = useState(0)
  const [replyComposerKeys, setReplyComposerKeys] = useState<Record<string, number>>({})

  const handleAddCommentWithReset = async (content: string, editorState: string) => {
    try {
      await finalHandlers.onAddComment(content, editorState, sourceId, sourceType)
      setComposerKey((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const handleReplyWithReset = async (content: string, editorState: string, parentId: string) => {
    try {
      await finalHandlers.onReply(content, editorState, parentId)
      setReplyComposerKeys((prev) => ({
        ...prev,
        [parentId]: (prev[parentId] || 0) + 1,
      }))
      handleCancelReply()
    } catch (error) {
      console.error("Failed to add reply:", error)
    }
  }

  const finalHandlers = {
    onAddComment:
      onAddComment ||
      ((content: string, editorState: string) => handleCommentSubmit(content, editorState, sourceId, sourceType)),
    onReply:
      onReply ||
      ((content: string, editorState: string, parentId: string) =>
        handleReplySubmit(content, editorState, parentId, comments)),
    onEdit: onEdit,
    onDelete: onDelete,
    onLike: onLike || hookHandleLike,
    onShare: onShare || hookHandleShare,
    onForward: onForward || hookHandleForward,
    onApprove: onApprove || hookHandleApprove,
    onReact: onReact || hookHandleReact,
  }

  const users = useMemo(() => {
    const userMap = new Map()
    if (comments && Array.isArray(comments)) {
      comments.forEach((comment) => {
        if (!userMap.has(comment.authorId)) {
          userMap.set(comment.authorId, comment.author)
        }
      })
    }
    return Array.from(userMap.values())
  }, [comments])

  const threadedComments = useMemo(() => {
    const commentsToSort = enableSearch ? filteredComments || [] : comments || []
    const topLevelComments = commentsToSort.filter((comment) => !comment.parentId)

    const sortedTopLevel = [...topLevelComments].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "most-replies":
          const aReplies = getRepliesForComment?.(a.id)?.length || 0
          const bReplies = getRepliesForComment?.(b.id)?.length || 0
          return bReplies - aReplies
        case "author":
          return a.author.name.localeCompare(b.author.name)
        case "newest":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    const flatThreads: Comment[] = []
    sortedTopLevel.forEach((parent) => {
      flatThreads.push(parent)
      // Only get replies for top-level comments (flat threading)
      const replies = getRepliesForComment?.(parent.id) || []
      const sortedReplies = [...replies].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      flatThreads.push(...sortedReplies)
    })

    return flatThreads
  }, [enableSearch ? filteredComments : comments, sortBy, getRepliesForComment])

  const totalComments = comments?.length || 0
  const displayedComments = enableSearch ? filteredComments?.length || 0 : totalComments

  const shouldShowComposer = showComposerByDefault || hookShowComposer

  const getComposerPlaceholder = (isReply = false) => {
    if (isReply && replyContext) {
      return `@${replyContext.authorName} `
    }
    return "Share your thoughts... Try @mentions and #tags!"
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!enableSearch && (
            <Badge variant="secondary" className="text-sm">
              {displayedComments} {displayedComments === 1 ? "comment" : "comments"}
              {displayedComments !== totalComments && ` of ${totalComments}`}
            </Badge>
          )}
          {isPending && (
            <Badge variant="outline" className="text-xs">
              Updating...
            </Badge>
          )}
          {enableSearch && displayedComments !== totalComments && (
            <span className="text-sm text-gray-600">Filtered results</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {enableSorting && (
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-36 h-9">
                <SortAsc className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-replies">Most Replies</SelectItem>
                <SelectItem value="author">By Author</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showAddForm && !showComposerByDefault && (
            <Button onClick={handleToggleComposer} size="sm" disabled={isPending} className="h-9">
              {hookShowComposer ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Comment
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {enableSearch && (
        <CommentSearch comments={comments} users={users} onFilteredCommentsChange={setFilteredComments} />
      )}

      {/* Comment Composer */}
      {showAddForm && shouldShowComposer && (
        <div className="">
          <LexicalCommentComposer
            key={composerKey}
            onSubmit={handleAddCommentWithReset}
            placeholder={getComposerPlaceholder()}
            variant={variant as any}
          />
          {!showComposerByDefault && (
            <div className="mt-3">
              <Button variant="ghost" size="sm" onClick={handleToggleComposer} className="text-xs text-gray-500">
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Flat Thread Comment List */}
      <div className="space-y-4">
        {threadedComments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base">
              {enableSearch && displayedComments === 0
                ? "No comments match your search."
                : "No comments yet. Be the first to add one!"}
            </p>
          </div>
        ) : (
          threadedComments.map((comment) => {
            const isReply = !!comment.parentId
            const commentReplies = !isReply ? getRepliesForComment?.(comment.id) || [] : []

            return (
              <div key={comment.id}>
                <CommentVariation
                  comment={comment}
                  currentUser={currentUser}
                  variant={variant}
                  showInlineEdit={false}
                  replies={commentReplies}
                  onEdit={finalHandlers.onEdit}
                  onDelete={finalHandlers.onDelete}
                  onReply={handleStartReply}
                  onLike={finalHandlers.onLike}
                  onShare={finalHandlers.onShare}
                  onForward={finalHandlers.onForward}
                  onApprove={finalHandlers.onApprove}
                  onReact={finalHandlers.onReact}
                />

                {replyingTo === comment.id && (
                  <div className="mt-3 ml-8 pl-4 p-3">
                    <div className="text-sm text-gray-600 mb-2">
                      Replying to {replyContext?.authorName || comment.author.name}
                    </div>
                    <LexicalCommentComposer
                      key={replyComposerKeys[comment.id] || 0}
                      onSubmit={(content, editorState) => handleReplyWithReset(content, editorState, comment.id)}
                      placeholder={getComposerPlaceholder(true)}
                      variant={variant}
                    />
                    <div className="mt-2">
                      <Button variant="ghost" size="sm" onClick={handleCancelReply} className="text-xs text-gray-500">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
