"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Share, Edit, Trash2, ExternalLink } from "lucide-react"
import { formatTimeAgo } from '@/lib/utils'
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"
import type { Comment, User as UserType } from "@/lib/types/comments"

interface SocialVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  isReplyingTo?: boolean
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete: () => void
  onReply: () => void
  onReplyCancel?: () => void
  onLike: () => void
  onShare: () => void
  replies?: Comment[]
}

export function SocialVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  isReplyingTo = false,
  onEdit,
  onDelete,
  onReply,
  onReplyCancel,
  onLike,
  onShare,
  replies = [],
}: SocialVariantProps) {
  const styles = {
    container: "bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200",
    replyContainer: "ml-12 mt-3 bg-gray-50 border border-gray-100 rounded-lg",
    content: "space-y-3",
    avatar: "h-12 w-12 flex-shrink-0 ring-2 ring-white shadow-md",
    avatarFallback: "bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold",
    name: "font-bold text-gray-900 text-lg",
    badge: "text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full",
    timestamp: "text-sm text-gray-500 font-medium",
    replyIcon: "text-purple-500 font-bold",
    actions: "flex items-center gap-4 pt-3 border-t border-gray-100",
    actionButton: "text-gray-600 hover:text-purple-600 font-medium flex items-center gap-2",
    likeCount: "bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleEditSubmit = async (content: string, editorState: string) => {
    if (onEdit) {
      await onEdit(comment.id, content, editorState)
      setIsEditing(false)
    }
  }

  const isCurrentUser = comment.author.id === currentUser.id

  return (
    <div className={`${styles.container} ${isReply ? styles.replyContainer : ""}`}>
      <div className={styles.content}>
        <div className="flex gap-3">
          <Avatar className={styles.avatar}>
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback className={styles.avatarFallback}>{getInitials(comment.author.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isReply && <span className={styles.replyIcon}>↳</span>}
              <span className={styles.name}>{comment.author.name}</span>
              <Badge className={styles.badge}>{comment.author.role}</Badge>
              <span className={styles.timestamp}>{formatTimeAgo(comment.createdAt)}</span>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <LexicalCommentComposer
                  variant="social"
                  placeholder="Edit your comment..."
                  onSubmit={handleEditSubmit}
                  className="border border-gray-300 rounded-md"
                  initialContent={comment.content}
                  initialEditorState={comment.editorState}
                />
              </div>
            ) : (
              <>
                <LexicalReadOnlyRenderer
                  editorState={comment.editorState}
                  content={comment.content}
                  className="text-sm text-gray-800 leading-relaxed"
                />

              </>
            )}
          </div>
        </div>

        <CommentActionBar
          comment={comment}
          currentUser={currentUser}
          variant="social"
          isReply={isReply}
          isEditing={isEditing}
          isOwner={isCurrentUser}
          isReplyingTo={isReplyingTo}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onReplyCancel={onReplyCancel}
          onLike={onLike}
          onShare={onShare}
          onToggleEdit={() => setIsEditing(!isEditing)}
          replies={replies}
        />

        <CommentSourceReference
          sourceReference={comment.sourceReference}
          variant="social"
        />
      </div>
    </div>
  )
}
