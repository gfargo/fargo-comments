"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatTimeAgo } from '@/lib/comments/utils/formatTimeAgo'
import { LexicalCommentComposer } from "@/lib/comments/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/comments/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "../comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"
import type { Comment, User as UserType } from "@/lib/comments/types/comments"

interface TimelineVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete: () => void
  onReply: () => void
  onLike: () => void
  isReplyingTo?: boolean
  onReplyCancel?: () => void
  replies?: Comment[]
}

export function TimelineVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onLike,
  isReplyingTo = false,
  onReplyCancel,
  replies = [],
}: TimelineVariantProps) {
  const styles = {
    container: "relative pl-12 pb-6 last:pb-0",
    mainTimeline: "absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200",
    replyTimeline: "absolute left-6 top-8 bottom-0 w-0.5 bg-gradient-to-b from-green-200 via-green-300 to-green-200",
    content:
      "relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ml-6",
    replyContent:
      "relative bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ml-12",
    timelineNode: "absolute left-4 top-6 w-4 h-4 rounded-full border-3 border-white shadow-md z-10",
    parentNode: "bg-gradient-to-br from-blue-500 to-blue-600",
    replyNode: "bg-gradient-to-br from-green-500 to-green-600",
    connector: "absolute left-7 top-8 w-6 h-0.5 bg-gradient-to-r from-green-300 to-transparent",
    name: "font-semibold text-gray-900",
    badge: "text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200",
    timestamp: "text-sm text-gray-500 font-medium",
    actions: "flex items-center gap-3 mt-4 pt-4 border-t border-gray-100",
    actionButton: "text-gray-500 hover:text-blue-600 transition-colors duration-150",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isCurrentUser = comment.author.id === currentUser.id

  const handleEditSubmit = async (content: string, editorState: string) => {
    if (onEdit) {
      await onEdit(comment.id, content, editorState)
      setIsEditing(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={isReply ? styles.replyTimeline : styles.mainTimeline}></div>

      <div className={`${styles.timelineNode} ${isReply ? styles.replyNode : styles.parentNode}`}></div>

      {isReply && <div className={styles.connector}></div>}

      <div className={isReply ? styles.replyContent : styles.content}>
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 text-sm font-semibold">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {isReply && <span className="text-green-600 font-bold text-lg">↳</span>}
              <span className={styles.name}>{comment.author.name}</span>
              <Badge variant="outline" className={styles.badge}>
                {comment.author.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={styles.timestamp}>{formatTimeAgo(comment.createdAt)}</span>
              {isReply && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  Reply
                </span>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <LexicalCommentComposer
            variant="timeline"
            placeholder="Edit your comment..."
            onSubmit={handleEditSubmit}
            className="border border-gray-300 rounded-md"
            initialContent={comment.content}
            initialEditorState={comment.editorState}
          />
        ) : (
          <LexicalReadOnlyRenderer
            editorState={comment.editorState}
            content={comment.content}
            className="text-gray-800 leading-relaxed mb-4"
          />
        )}

        <CommentActionBar
          comment={comment}
          currentUser={currentUser}
          variant="timeline"
          isReply={isReply}
          isEditing={isEditing}
          isOwner={isCurrentUser}
          isReplyingTo={isReplyingTo}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onReplyCancel={onReplyCancel}
          onLike={onLike}
          onToggleEdit={() => setIsEditing(!isEditing)}
          replies={replies}
        />

        <CommentSourceReference
          sourceReference={comment.sourceReference}
          variant="timeline"
        />
      </div>
    </div>
  )
}
