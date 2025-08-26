"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Comment, User as UserType } from "@/lib/types/comments"
import { formatTimeAgo } from "@/lib/utils"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"

interface NotionVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  isReplyingTo?: boolean
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete?: () => void
  onReply?: () => void
  onReplyCancel?: () => void
  onLike?: () => void
  replies?: Comment[]
}

export function NotionVariant({
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
}: NotionVariantProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isCurrentUser = comment.author.id === currentUser.id

  return (
    <>
      <div
        className={`group p-3 hover:bg-gray-25 transition-colors duration-150 rounded-lg ${isReply ? "ml-6 border-l-2 border-l-orange-300 pl-4 bg-orange-50/30" : ""}`}
      >
        <div className="flex gap-3">
          <Avatar className="h-7 w-7 flex-shrink-0">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-medium">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isReply && <span className="text-orange-600 text-sm font-medium">↳</span>}
              <span className="font-medium text-gray-900 text-sm">{comment.author.name}</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0 bg-orange-50 border-orange-200 text-orange-700">
                {comment.author.role}
              </Badge>
              <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>

            {isEditing ? (
              <LexicalCommentComposer
                variant="notion"
                placeholder="Edit your comment..."
                onSubmit={async (content: string, editorState: string) => {
                  if (onEdit) {
                    await onEdit(comment.id, content, editorState)
                    setIsEditing(false)
                  }
                }}
                className="border border-gray-300 rounded-md"
                initialContent={comment.content}
                initialEditorState={comment.editorState}
              />
            ) : (
              <div className="border-l-3 border-l-gray-300 pl-3 py-1 bg-gray-50/50 rounded-r-md">
                <LexicalReadOnlyRenderer
                  editorState={comment.editorState}
                  content={comment.content}
                  className="text-sm text-gray-800 leading-relaxed"
                />
              </div>
            )}

            <CommentActionBar
              comment={comment}
              currentUser={currentUser}
              variant="notion"
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
              variant="notion"
            />
          </div>
        </div>
      </div>
    </>
  )
}
