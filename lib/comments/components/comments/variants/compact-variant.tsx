"use client"
import { LexicalCommentComposer } from "@/lib/comments/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/comments/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/comments/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"
import type { Comment, User as UserType } from "@/lib/comments/types/comments"

interface CompactVariantProps {
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

export function CompactVariant({
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
}: CompactVariantProps) {
  const handleEditSubmit = async (content: string, editorState: string) => {
    if (onEdit) {
      await onEdit(comment.id, content, editorState)
      setIsEditing(false)
    }
  }

  const isCurrentUser = comment.author.id === currentUser.id

  return (
    <div
      className={`p-3 border rounded-lg bg-white ${isReply ? "ml-6 border-l-2 border-l-green-200 bg-green-25" : ""}`}
    >
      <div className="flex gap-2">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            {comment.author.name.charAt(0)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
            <span className="text-xs text-gray-500">{comment.author.role}</span>
            {isReply && <span className="text-xs text-green-600">↳</span>}
            <span className="text-xs text-gray-400">2m ago</span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <LexicalCommentComposer
                variant="compact"
                placeholder="Edit your comment..."
                onSubmit={handleEditSubmit}
                className="min-h-[60px]"
                initialContent={comment.content}
                initialEditorState={comment.editorState}
              />
            </div>
          ) : (
            <div className="text-sm text-gray-800">
              <LexicalReadOnlyRenderer content={comment.content} editorState={comment.editorState} />
            </div>
          )}

          <CommentActionBar
            comment={comment}
            currentUser={currentUser}
            variant="compact"
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
            variant="compact"
          />
        </div>
      </div>
    </div>
  )
}
