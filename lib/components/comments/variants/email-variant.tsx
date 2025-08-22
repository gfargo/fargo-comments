"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment, User as UserType } from "@/lib/types/comments"
import { formatTimeAgo } from "@/lib/utils"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"

interface EmailVariantProps {
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
  onForward?: () => void
  replies?: Comment[]
}

export function EmailVariant({
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
  onForward,
  replies = [],
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

  const isCurrentUser = comment.author.id === currentUser.id

  return (
    <>
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
              <span className="text-gray-700">{isReply ? "Re: " : ""}Comment on Item</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          {isEditing ? (
            <LexicalCommentComposer
              variant="email"
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
            variant="email"
            isReply={isReply}
            isEditing={isEditing}
            isOwner={isCurrentUser}
            isReplyingTo={isReplyingTo}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            onReplyCancel={onReplyCancel}
            onForward={onForward}
            onToggleEdit={() => setIsEditing(!isEditing)}
            replies={replies}
          />

          <CommentSourceReference
            sourceReference={comment.sourceReference}
            variant="email"
          />
        </div>
      </div>
    </>
  )
}
