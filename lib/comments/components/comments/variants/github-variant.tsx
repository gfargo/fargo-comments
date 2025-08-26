"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CircleX } from "lucide-react"
import type { Comment, User as UserType } from "@/lib/comments/types/comments"
import { formatTimeAgo } from '@/lib/comments/utils/formatTimeAgo'
import { LexicalCommentComposer } from "@/lib/comments/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/comments/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/comments/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"

interface GitHubVariantProps {
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
  onReact?: (reaction: string) => void
  replies?: Comment[]
}

export function GitHubVariant({
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
  onReact,
  replies = [],
}: GitHubVariantProps) {

  const styles = {
    container: "border border-gray-300 rounded-md bg-white",
    replyContainer: "ml-8 mt-2 border-l-4 border-gray-300 bg-gray-50",
    actionButton: "text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1",
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
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
              <AvatarFallback className="text-xs bg-gray-200">{getInitials(comment.author.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
            <span className="text-xs text-gray-500">commented {formatTimeAgo(comment.createdAt)}</span>
            {isReply && (
              <Badge variant="outline" className="text-xs">
                Reply
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                  Editing
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.actionButton + " rounded-full h-6 w-6 cursor-pointer p-2"}
                  onClick={() => setIsEditing(false)}
                >
                  <CircleX className="h-4 w-4" />
                </Button>
              </>
            ) : null}
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 hidden">
              Approved
            </Badge>
          </div>
        </div>
        <div className="p-4">
          {isEditing ? (
            <LexicalCommentComposer
              variant="github"
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
            variant="github"
            isReply={isReply}
            isEditing={isEditing}
            isOwner={isCurrentUser}
            isReplyingTo={isReplyingTo}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            onReplyCancel={onReplyCancel}
            onReact={onReact}
            onToggleEdit={() => setIsEditing(!isEditing)}
            replies={replies}
          />

          <CommentSourceReference
            sourceReference={comment.sourceReference}
            variant="github"
          />
        </div>
      </div>
    </>
  )
}
