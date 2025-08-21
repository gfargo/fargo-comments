"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Reply, Edit, Trash2, ExternalLink } from "lucide-react"
import { formatTimeAgo } from "@/lib/utils"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import type { Comment, User as UserType } from "@/lib/types/comments"
import Link from "next/link"
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog"
import { useState } from "react"

interface BubbleVariantProps {
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

export function BubbleVariant({
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
}: BubbleVariantProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const styles = {
    container: "max-w-md",
    replyContainer: "ml-12 mt-2",
    content: "bg-blue-500 text-white rounded-2xl rounded-bl-sm px-4 py-3 inline-block",
    replyContent: "bg-gray-100 text-gray-900 rounded-2xl rounded-br-sm px-4 py-3 inline-block",
    avatar: "h-8 w-8 flex-shrink-0",
    avatarFallback: "bg-blue-100 text-blue-700 text-sm font-medium",
    name: "font-medium text-white mb-1",
    replyName: "font-medium text-gray-900 mb-1",
    timestamp: "text-xs text-blue-100 mt-1",
    replyTimestamp: "text-xs text-gray-500 mt-1",
    actions: "flex items-center gap-2 mt-2 justify-end",
    actionButton: "text-blue-500 hover:text-blue-700 text-xs",
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
      <div className={`flex ${isReply ? "justify-start" : "justify-end"} mb-4`}>
        <div className={`${styles.container} ${isReply ? styles.replyContainer : ""}`}>
          <div className="flex gap-2 items-end">
            {isReply && (
              <Avatar className={styles.avatar}>
                <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                <AvatarFallback className={styles.avatarFallback}>{getInitials(comment.author.name)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <div className={isReply ? styles.replyContent : styles.content}>
                <div className={isReply ? styles.replyName : styles.name}>{comment.author.name}</div>
                {isEditing ? (
                  <div className="space-y-2">
                    <LexicalCommentComposer
                      variant="inline"
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
                    <div className={isReply ? styles.replyTimestamp : styles.timestamp}>
                      {formatTimeAgo(comment.createdAt)}
                    </div>
                  </>
                )}
              </div>

              {comment.sourceReference && !isEditing && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                  <div className="flex items-center gap-1 text-blue-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Referenced:</span>
                    <span>{comment.sourceReference.label}</span>
                    {comment.sourceReference.description && (
                      <span className="text-blue-600">- {comment.sourceReference.description}</span>
                    )}
                    {comment.sourceReference.url && (
                      <Link
                        href={comment.sourceReference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        View Source
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <Button variant="ghost" size="sm" className={styles.actionButton} onClick={onLike}>
                  <Heart className="h-3 w-3 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className={styles.actionButton} onClick={onReply}>
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                {comment.author.id === currentUser.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.actionButton}
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className={styles.actionButton} onClick={handleDeleteClick}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
            {!isReply && (
              <Avatar className={styles.avatar}>
                <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                <AvatarFallback className={styles.avatarFallback}>{getInitials(comment.author.name)}</AvatarFallback>
              </Avatar>
            )}
          </div>
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
