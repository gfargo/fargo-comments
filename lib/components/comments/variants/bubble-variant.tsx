"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimeAgo } from "@/lib/utils"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"
import type { Comment, User as UserType } from "@/lib/types/comments"

interface BubbleVariantProps {
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

export function BubbleVariant({
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
}: BubbleVariantProps) {

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

  const isCurrentUser = comment.author.id === currentUser.id

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
                  <LexicalCommentComposer
                    variant="bubble"
                    placeholder="Edit your comment..."
                    onSubmit={handleEditSubmit}
                    className="border border-gray-300 rounded-md"
                    initialContent={comment.content}
                    initialEditorState={comment.editorState}
                  />
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

              <CommentActionBar
                comment={comment}
                currentUser={currentUser}
                variant="bubble"
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
                variant="bubble"
              />
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
    </>
  )
}
