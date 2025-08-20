"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ExternalLink } from "lucide-react"
import type { Comment, User as UserType } from "@/types/comments"
import { formatTimeAgo } from "@/lib/comment-utils"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"

interface EmailVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete?: () => void
  onReply?: () => void
  onForward?: () => void
}

export function EmailVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onForward,
}: EmailVariantProps) {
  const styles = {
    container: "border border-gray-300 rounded-none bg-white shadow-sm mb-1",
    replyContainer: "ml-8 border-l-4 border-blue-400 bg-blue-50/20",
    content: "divide-y divide-gray-200",
    header: "bg-gray-100 px-4 py-3 border-b border-gray-300",
    body: "px-4 py-4",
    avatar: "h-8 w-8 flex-shrink-0 rounded-none",
    avatarFallback: "bg-blue-600 text-white text-sm font-bold",
    name: "font-bold text-gray-900",
    badge: "text-xs px-2 py-1 bg-white border border-gray-400 rounded-none",
    timestamp: "text-sm text-gray-700 font-medium",
    subject: "font-semibold text-gray-900 mb-2",
    replyIcon: "text-blue-600 font-bold",
    actions: "flex items-center gap-4 mt-4 pt-3 border-t border-gray-300",
    actionButton: "text-gray-700 hover:text-blue-600 font-medium text-sm underline",
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

  return (
    <div className={`${styles.container} ${isReply ? styles.replyContainer : ""}`}>
      <div className="border-b border-gray-200 p-3 bg-gray-50 rounded-t-lg">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 w-12">From:</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                <AvatarFallback className="text-xs">{getInitials(comment.author.name)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-gray-500">&lt;{comment.author.email}&gt;</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 w-12">Date:</span>
            <span className="text-gray-700">{formatTimeAgo(comment.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 w-12">Subject:</span>
            <span className="text-gray-700">{isReply ? "Re: " : ""}Comment on Audit Item</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <LexicalCommentComposer
              variant="default"
              placeholder="Edit your comment..."
              onSubmit={handleEditSubmit}
              className="border border-gray-300 rounded-md"
              initialContent={comment.content}
              initialEditorState={comment.editorState}
            />
          </div>
        ) : (
          <>
            {renderCommentContent()}
            {comment.sourceReference && renderSourceReference()}
            <div className={styles.actions}>
              <Button variant="ghost" size="sm" className={styles.actionButton} onClick={onReply}>
                Reply
              </Button>
              <Button variant="ghost" size="sm" className={styles.actionButton} onClick={onForward}>
                Forward
              </Button>
              {comment.author.id === currentUser.id && (
                <>
                  <Button variant="ghost" size="sm" className={styles.actionButton} onClick={() => setIsEditing(true)}>
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className={styles.actionButton} onClick={onDelete}>
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
