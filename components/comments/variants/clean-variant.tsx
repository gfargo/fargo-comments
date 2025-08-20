"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Comment, User as UserType } from "@/types/comments"
import { formatTimeAgo } from "@/lib/comment-utils"
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"

interface CleanVariantProps {
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

export function CleanVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onLike,
}: CleanVariantProps) {
  return (
    <div className={`group py-4 ${isReply ? "ml-8 border-l border-l-gray-200 pl-6 bg-gray-50/20" : ""}`}>
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-1">
          {isReply && <span className="text-gray-400 text-sm">↳</span>}
          <span className="font-medium text-gray-900">{comment.author.name}</span>
          <span className="text-sm text-gray-300">•</span>
          <span className="text-sm text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
          {isReply && (
            <Badge variant="outline" className="text-xs text-gray-500 border-gray-200 bg-white">
              Reply
            </Badge>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <LexicalCommentComposer
            variant="default"
            placeholder="Edit your comment..."
            onSubmit={async (content: string, editorState: string) => {
              if (onEdit) {
                await onEdit(comment.id, content, editorState)
                setIsEditing(false)
              }
            }}
            className="border border-gray-200 rounded-lg"
            initialContent={comment.content}
            initialEditorState={comment.editorState}
          />
        </div>
      ) : (
        <>
          <LexicalReadOnlyRenderer
            editorState={comment.editorState}
            content={comment.content}
            className="text-sm text-gray-800 leading-relaxed mb-4"
          />

          {comment.sourceReference && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-600 mb-1">Referenced:</div>
                  <div className="text-sm font-medium text-gray-900">{comment.sourceReference.label}</div>
                  {comment.sourceReference.description && (
                    <div className="text-xs text-gray-600 mt-1">{comment.sourceReference.description}</div>
                  )}
                  {comment.sourceReference.url && (
                    <Link
                      href={comment.sourceReference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 mt-2 font-medium"
                    >
                      View Source <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-0"
              onClick={onLike}
            >
              Like
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-0"
              onClick={onReply}
            >
              Reply
            </Button>
            {comment.author.id === currentUser.id && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-0"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-0"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
