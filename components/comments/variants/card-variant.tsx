"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Reply, Edit, Trash2, ExternalLink, BookText } from "lucide-react"
import type { Comment, User as UserType } from "@/types/comments"
import { formatTimeAgo } from "@/lib/comment-utils"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog"
import { useState } from "react"

interface CardVariantProps {
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

export function CardVariant({
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
}: CardVariantProps) {
  const [showReferences, setShowReferences] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  const renderCommentContent = () => {
    return (
      <LexicalReadOnlyRenderer
        editorState={comment.editorState}
        content={comment.content}
        className="text-sm text-gray-800 leading-relaxed"
      />
    )
  }

  const renderSourceReference = () => {
    if (!comment.sourceReference) return null

    return (
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Referenced:</span> {comment.sourceReference.label}
            </div>
            {comment.sourceReference.description && (
              <div className="text-sm text-blue-700 mt-1">{comment.sourceReference.description}</div>
            )}
            {comment.sourceReference.url && (
              <Link
                href={comment.sourceReference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                View Source
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    )
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
    <Card
      className={`shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isReply ? "ml-8 border-l-4 border-l-green-400 bg-green-50/50" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isReply && <span className="text-sm text-green-600 font-medium">↳</span>}
              <span className="font-semibold text-gray-900">{comment.author.name}</span>
              <Badge variant="outline" className="text-xs px-2 py-0 bg-white border-gray-300 rounded-full">
                {comment.author.role}
              </Badge>
              <span className="text-sm text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
              {isEditing && (
                <Badge variant="secondary" className="text-xs">
                  Editing
                </Badge>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <LexicalCommentComposer
                  variant="compact"
                  placeholder="Edit your comment..."
                  onSubmit={handleEditSubmit}
                  className="border border-gray-200 rounded-lg"
                  initialContent={comment.content}
                  initialEditorState={comment.editorState}
                />
              </div>
            ) : (
              <>
                <div className="mb-3">{renderCommentContent()}</div>
                {showReferences && renderSourceReference()}
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600" onClick={onLike}>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600" onClick={onReply}>
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  {comment.sourceReference && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-gray-600 hover:text-purple-600 ${showReferences ? "text-purple-600" : ""}`}
                      onClick={() => setShowReferences(!showReferences)}
                    >
                      <BookText className="h-4 w-4 mr-1" />
                      References
                    </Button>
                  )}
                  {comment.author.id === currentUser.id && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600"
                        onClick={handleDeleteClick}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </>
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
      </CardContent>
    </Card>
  )
}
