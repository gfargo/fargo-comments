"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, Edit, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Comment, User as UserType } from "@/lib/types/comments"
import { formatTimeAgo } from "@/lib/utils"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog"
import { useState } from "react"

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
  replies = [],
}: MobileVariantProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    onDelete?.()
    setShowDeleteDialog(false)
  }

  const hasReplies = replies.length > 0

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
            <div className="space-y-3">
              <LexicalCommentComposer
                variant="compact"
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
            </div>
          ) : (
            <>
              <LexicalReadOnlyRenderer
                editorState={comment.editorState}
                content={comment.content}
                className="text-base text-gray-800 leading-relaxed"
              />

              {comment.sourceReference && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-700 mb-1">Referenced:</div>
                      <div className="text-base font-medium text-blue-900">{comment.sourceReference.label}</div>
                      {comment.sourceReference.description && (
                        <div className="text-sm text-blue-700 mt-1">{comment.sourceReference.description}</div>
                      )}
                      {comment.sourceReference.url && (
                        <Link
                          href={comment.sourceReference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-3 font-medium"
                        >
                          View Source <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1 h-12 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  onClick={onLike}
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Like
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1 h-12 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                  onClick={onReply}
                >
                  <Reply className="h-5 w-5 mr-2" />
                  Reply
                </Button>
                {comment.author.id === currentUser.id && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-12 w-12 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-12 w-12 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        commentAuthor={comment.author.name}
        hasReplies={hasReplies}
        replyCount={replies.length}
      />
    </>
  )
}
