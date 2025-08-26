"use client"
import type { Comment, User as UserType } from "@/lib/comments/types/comments"
import { LexicalReadOnlyRenderer } from "@/lib/comments/components/lexical/lexical-read-only-renderer"
import { LexicalCommentComposer } from "@/lib/comments/components/lexical/lexical-comment-composer"
import { CommentActionBar } from "../comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"

interface PlainVariantProps {
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

export function PlainVariant({
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
}: PlainVariantProps) {
  const isCurrentUser = comment.author.id === currentUser.id

  const handleEditSubmit = async (content: string, editorState: string) => {
    if (onEdit) {
      await onEdit(comment.id, content, editorState)
      setIsEditing(false)
    }
  }
  return (
    <div
      className={`p-4 border border-gray-200 rounded-lg bg-white ${isReply ? "ml-4 border-l-2 border-l-gray-300" : ""}`}
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{comment.author.name}</span>
            {isReply && <span className="text-gray-400">↳</span>}
          </div>
          {isEditing ? (
            <LexicalCommentComposer
              variant="plain"
              placeholder="Edit your comment..."
              onSubmit={handleEditSubmit}
              className="border border-gray-300 rounded-md"
              initialContent={comment.content}
              initialEditorState={comment.editorState}
            />
          ) : (
            <div className="text-sm text-gray-800">
              <LexicalReadOnlyRenderer content={comment.content} editorState={comment.editorState} />
            </div>
          )}
          
          <CommentActionBar
            comment={comment}
            currentUser={currentUser}
            variant="plain"
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
            variant="plain"
          />
        </div>
      </div>
    </div>
  )
}
