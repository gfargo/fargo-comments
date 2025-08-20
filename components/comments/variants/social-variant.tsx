"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Share, Edit, Trash2, ExternalLink } from "lucide-react"
import { formatTimeAgo } from "@/lib/comment-utils"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"
import type { Comment, User as UserType } from "@/types/comments"
import Link from "next/link"

interface SocialVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete: () => void
  onReply: () => void
  onLike: () => void
  onShare: () => void
}

export function SocialVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onLike,
  onShare,
}: SocialVariantProps) {
  const styles = {
    container: "bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200",
    replyContainer: "ml-12 mt-3 bg-gray-50 border border-gray-100 rounded-lg",
    content: "space-y-3",
    avatar: "h-12 w-12 flex-shrink-0 ring-2 ring-white shadow-md",
    avatarFallback: "bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold",
    name: "font-bold text-gray-900 text-lg",
    badge: "text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full",
    timestamp: "text-sm text-gray-500 font-medium",
    replyIcon: "text-purple-500 font-bold",
    actions: "flex items-center gap-4 pt-3 border-t border-gray-100",
    actionButton: "text-gray-600 hover:text-purple-600 font-medium flex items-center gap-2",
    likeCount: "bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium",
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

  return (
    <div className={`${styles.container} ${isReply ? styles.replyContainer : ""}`}>
      <div className={styles.content}>
        <div className="flex gap-3">
          <Avatar className={styles.avatar}>
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback className={styles.avatarFallback}>{getInitials(comment.author.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isReply && <span className={styles.replyIcon}>↳</span>}
              <span className={styles.name}>{comment.author.name}</span>
              <Badge className={styles.badge}>{comment.author.role}</Badge>
              <span className={styles.timestamp}>{formatTimeAgo(comment.createdAt)}</span>
            </div>
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

                {comment.sourceReference && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-sm">Referenced:</span>
                      <span className="text-sm">{comment.sourceReference.label}</span>
                      {comment.sourceReference.description && (
                        <span className="text-blue-600 text-sm">- {comment.sourceReference.description}</span>
                      )}
                      {comment.sourceReference.url && (
                        <Link
                          href={comment.sourceReference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                        >
                          View Source
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-pink-600 hover:bg-pink-50"
            onClick={onLike}
          >
            <Heart className="h-4 w-4 mr-1" />
            <span className="font-medium">12</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={onReply}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-green-600 hover:bg-green-50"
            onClick={onShare}
          >
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          {comment.author.id === currentUser.id && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
