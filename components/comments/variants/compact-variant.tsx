"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Edit, Trash2, BookText } from "lucide-react"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"
import { DeleteConfirmationDialog } from "@/components/comments/delete-confirmation-dialog"
import type { Comment, User as UserType } from "@/types/comments"

interface CompactVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete?: () => void
  onReply?: () => void
  onLike?: () => void
  replies?: Comment[]
}

export function CompactVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onLike,
  replies = [],
}: CompactVariantProps) {
  const [showReferences, setShowReferences] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleEditSubmit = async (content: string, editorState: string) => {
    if (onEdit) {
      await onEdit(comment.id, content, editorState)
      setIsEditing(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    onDelete?.()
    setShowDeleteDialog(false)
  }

  const isCurrentUser = comment.author.id === currentUser.id

  return (
    <div
      className={`p-3 border rounded-lg bg-white ${isReply ? "ml-6 border-l-2 border-l-green-200 bg-green-25" : ""}`}
    >
      <div className="flex gap-2">
        {isReply && <span className="text-xs text-green-600">↳</span>}
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            {comment.author.name.charAt(0)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
            <span className="text-xs text-gray-500">{comment.author.role}</span>
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

          {/* Source Reference */}
          {comment.sourceReference && showReferences && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <span className="text-blue-700 font-medium">Referenced: </span>
                  <span className="text-blue-800">{comment.sourceReference.label}</span>
                  {comment.sourceReference.description && (
                    <div className="text-blue-600 mt-1">{comment.sourceReference.description}</div>
                  )}
                  {comment.sourceReference.url && (
                    <a
                      href={comment.sourceReference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                    >
                      View Source →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <Heart className="w-3 h-3 mr-1" />
              Like
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onReply}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Reply
            </Button>

            {comment.sourceReference && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReferences(!showReferences)}
                className={`h-6 px-2 text-xs ${showReferences ? "text-purple-600 bg-purple-50" : "text-gray-500 hover:text-gray-700"}`}
              >
                <BookText className="w-3 h-3 mr-1" />
                References
              </Button>
            )}

            {isCurrentUser && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        commentAuthor={comment.author.name}
        hasReplies={replies.length > 0}
        replyCount={replies.length}
      />
    </div>
  )
}
