"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, Edit, Trash2, ExternalLink, CircleX } from "lucide-react"
import type { Comment, User as UserType } from "@/types/comments"
import { formatTimeAgo } from "@/lib/comment-utils"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"

interface GitHubVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete?: () => void
  onReply?: () => void
  onReact?: (reaction: string) => void
}

export function GitHubVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onReact,
}: GitHubVariantProps) {
  const styles = {
    container: "border border-gray-300 rounded-md bg-white",
    replyContainer: "ml-8 mt-2 border-l-4 border-gray-300 bg-gray-50",
    content: "relative",
    header: "bg-gray-50 border-b border-gray-300 px-4 py-2 rounded-t-md",
    body: "p-4",
    avatar: "h-8 w-8 flex-shrink-0 rounded-full",
    avatarFallback: "bg-gray-600 text-white text-sm font-medium",
    name: "font-semibold text-gray-900",
    badge: "text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded border",
    timestamp: "text-sm text-gray-600",
    replyIcon: "text-gray-600",
    actions: "flex items-center gap-3 mt-3 pt-3 border-t border-gray-200",
    actionButton: "text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1",
    codeBlock: "bg-gray-100 border border-gray-200 rounded p-2 font-mono text-sm",
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
            <Button variant="ghost" size="sm" className={styles.actionButton + ' rounded-full h-9 w-9 cursor-pointer'} onClick={() => setIsEditing(false)}>
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
            {renderSourceReference()}
            <div className={styles.actions}>
              <Button variant="ghost" size="sm" className={styles.actionButton} onClick={() => onReact?.("👍")}>
                <ThumbsUp className="h-3 w-3" />👍 React
              </Button>
              <Button variant="ghost" size="sm" className={styles.actionButton} onClick={onReply}>
                <Reply className="h-3 w-3" />
                Reply
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
