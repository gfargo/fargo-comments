"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, Edit, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Comment, User as UserType } from "@/types/comments"
import { formatTimeAgo } from "@/lib/comment-utils"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"

interface NotionVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete: () => void
  onReply: () => void
  onLike?: () => void
}

export function NotionVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onLike,
}: NotionVariantProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div
      className={`p-3 hover:bg-gray-25 transition-colors duration-150 rounded-lg ${isReply ? "ml-6 border-l-2 border-l-orange-300 pl-4 bg-orange-50/30" : ""}`}
    >
      <div className="flex gap-3">
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
          <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-medium">
            {getInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isReply && <span className="text-orange-600 text-sm font-medium">↳</span>}
            <span className="font-medium text-gray-900 text-sm">{comment.author.name}</span>
            <Badge variant="outline" className="text-xs px-1.5 py-0 bg-orange-50 border-orange-200 text-orange-700">
              {comment.author.role}
            </Badge>
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <LexicalCommentComposer
                variant="compact"
                placeholder="Edit your comment..."
                onSubmit={async (content: string, editorState: string) => {
                  if (onEdit) {
                    await onEdit(comment.id, content, editorState)
                    setIsEditing(false)
                  }
                }}
                className="border border-gray-300 rounded-md"
                initialContent={comment.content}
                initialEditorState={comment.editorState}
              />
            </div>
          ) : (
            <>
              <div className="border-l-3 border-l-gray-300 pl-3 py-1 bg-gray-50/50 rounded-r-md">
                <LexicalReadOnlyRenderer
                  editorState={comment.editorState}
                  content={comment.content}
                  className="text-sm text-gray-800 leading-relaxed"
                />
              </div>

              {comment.sourceReference && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-orange-700 mb-1">Referenced:</div>
                      <div className="text-sm font-medium text-orange-900">{comment.sourceReference.label}</div>
                      {comment.sourceReference.description && (
                        <div className="text-xs text-orange-700 mt-1">{comment.sourceReference.description}</div>
                      )}
                      {comment.sourceReference.url && (
                        <Link
                          href={comment.sourceReference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 mt-2 font-medium"
                        >
                          View Source <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                  onClick={onLike}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={onReply}
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </Button>
                {comment.author.id === currentUser.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
