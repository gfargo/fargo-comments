"use client"
import type { Comment, User as UserType } from "@/lib/types/comments"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"

interface PlainVariantProps {
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

export function PlainVariant({
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
}: PlainVariantProps) {
  return (
    <div
      className={`p-4 border border-gray-200 rounded-lg bg-white ${isReply ? "ml-4 border-l-2 border-l-gray-300" : ""}`}
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{comment.author.name}</span>
            {isReply && <span className="text-gray-400">↳</span>}
          </div>
          <div className="text-sm text-gray-800">
            <LexicalReadOnlyRenderer content={comment.content} editorState={comment.editorState} />
          </div>
        </div>
      </div>
    </div>
  )
}
