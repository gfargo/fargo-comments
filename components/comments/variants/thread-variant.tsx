"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, Edit, Trash2, ExternalLink } from "lucide-react"
import { formatTimeAgo } from "@/lib/comment-utils"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"
import type { Comment, User as UserType } from "@/types/comments"
import Link from "next/link"

interface ThreadVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete: () => void
  onReply: () => void
  onLike: () => void
}

export function ThreadVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onLike,
}: ThreadVariantProps) {
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
    <div
      className={`group hover:bg-gray-25 transition-colors duration-150 ${
        isReply ? "ml-12 border-l-3 border-l-blue-300 pl-6 bg-blue-50/30 rounded-r-lg" : ""
      }`}
    >
      {isReply && <div className="absolute -ml-6 mt-4 w-4 h-px bg-blue-300"></div>}
      <div className="flex gap-3 py-2">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
          <AvatarFallback className="bg-gray-100 text-gray-700 text-sm font-medium">
            {getInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            {isReply && <span className="text-xs text-blue-600 font-medium">↳</span>}
            <span className="font-semibold text-gray-900 text-sm">{comment.author.name}</span>
            <Badge variant="outline" className="text-xs px-1.5 py-0 bg-white border-gray-200">
              {comment.author.role}
            </Badge>
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            {isEditing && <Badge className="text-xs bg-blue-50 text-blue-700 border border-blue-200">editing</Badge>}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <LexicalCommentComposer
                variant="compact"
                placeholder="Edit your comment..."
                onSubmit={handleEditSubmit}
                className="border border-gray-300 rounded-md"
                initialContent={comment.content}
                initialEditorState={comment.editorState}
              />
            </div>
          ) : (
            <>
              <div className="mb-2">
                <LexicalReadOnlyRenderer
                  editorState={comment.editorState}
                  content={comment.content}
                  className="text-sm text-gray-800 leading-relaxed"
                />
              </div>

              {comment.sourceReference && (
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-xs">Referenced:</span>
                    <span className="text-xs">{comment.sourceReference.label}</span>
                    {comment.sourceReference.description && (
                      <span className="text-blue-600 text-xs">- {comment.sourceReference.description}</span>
                    )}
                    {comment.sourceReference.url && (
                      <Link
                        href={comment.sourceReference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                      >
                        View Source
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={onLike}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Like
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50"
                  onClick={onReply}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                {comment.author.id === currentUser.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
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
