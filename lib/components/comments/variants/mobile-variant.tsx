"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Comment, User as UserType } from "@/lib/types/comments"
import { formatTimeAgo } from "@/lib/utils"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "../comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"

interface MobileVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete?: () => void
  onReply?: () => void
  onLike?: () => void
  isReplyingTo?: boolean
  onReplyCancel?: () => void
  replies?: Comment[]
}

export function MobileVariant({
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
}: MobileVariantProps) {
  const isCurrentUser = comment.author.id === currentUser.id

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      <div
        className={`border border-gray-200 rounded-xl bg-white shadow-sm ${isReply ? "ml-4 border-l-4 border-l-blue-400 bg-blue-50/20" : ""}`}
      >
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-t-xl border-b border-gray-200">
          <Avatar className="h-12 w-12 ring-2 ring-blue-100">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isReply && <span className="text-blue-600 font-medium text-sm">↳</span>}
              <span className="font-semibold text-gray-900 truncate">{comment.author.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-1 bg-white">
                {comment.author.role}
              </Badge>
              <span className="text-sm text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          {isEditing ? (
            <LexicalCommentComposer
              variant="mobile"
              placeholder="Edit your comment..."
              onSubmit={async (content: string, editorState: string) => {
                if (onEdit) {
                  await onEdit(comment.id, content, editorState)
                  setIsEditing(false)
                }
              }}
              className="border border-gray-300 rounded-lg"
              initialContent={comment.content}
              initialEditorState={comment.editorState}
            />
          ) : (
            <LexicalReadOnlyRenderer
              editorState={comment.editorState}
              content={comment.content}
              className="text-base text-gray-800 leading-relaxed"
            />
          )}

          <CommentActionBar
            comment={comment}
            currentUser={currentUser}
            variant="mobile"
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
            variant="mobile"
          />
        </div>
      </div>
    </>
  )
}
