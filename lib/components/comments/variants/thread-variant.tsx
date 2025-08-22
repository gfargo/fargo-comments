"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, Edit, Trash2, ExternalLink } from "lucide-react"
import { formatTimeAgo } from '@/lib/utils'
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"
import type { Comment, User as UserType } from "@/lib/types/comments"

interface ThreadVariantProps {
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
  replies?: Comment[]
}

export function ThreadVariant({
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
  replies = [],
}: ThreadVariantProps) {
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
    <div
      className={`group hover:bg-gray-25 transition-colors duration-150 ${
        isReply ? "ml-12 border-l-3 border-l-blue-300 pl-6 bg-blue-50/30 rounded-r-lg" : ""
      }`}
    >
      {isReply && <div className="absolute -ml-6 mt-4 w-4 h-px bg-blue-300"></div>}
      <div className="flex gap-3 py-2">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
          <AvatarFallback className="bg-gray-100 text-gray-700 text-sm font-medium">
            {getInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            {isReply && <span className="text-xs text-blue-600 font-medium">↳</span>}
            <span className="font-semibold text-gray-900 text-sm">{comment.author.name}</span>
            <Badge variant="outline" className="text-xs px-1.5 py-0 bg-white border-gray-200">
              {comment.author.role}
            </Badge>
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            {isEditing && <Badge className="text-xs bg-blue-50 text-blue-700 border border-blue-200">editing</Badge>}
          </div>

          {isEditing ? (
            <LexicalCommentComposer
              variant="thread"
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
              className="text-sm text-gray-800 leading-relaxed"
            />
          )}

          <CommentActionBar
            comment={comment}
            currentUser={currentUser}
            variant="thread"
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
            variant="thread"
          />
        </div>
      </div>
    </div>
  )
}
