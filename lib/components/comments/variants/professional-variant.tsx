"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, Edit, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Comment, User as UserType } from "@/lib/types/comments"
import { formatTimeAgo } from "@/lib/utils"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer"
import { CommentActionBar } from "@/lib/components/comments/comment-action-bar"
import { CommentSourceReference } from "../comment-source-reference"

interface ProfessionalVariantProps {
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
  onApprove?: () => void
  replies?: Comment[]
}

export function ProfessionalVariant({
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
  onApprove,
  replies = [],
}: ProfessionalVariantProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isCurrentUser = comment.author.id === currentUser.id

  return (
    <>
      <div
        className={`border border-slate-200 rounded-lg bg-white shadow-sm ${isReply ? "ml-8 border-l-4 border-l-slate-400 bg-slate-50/30" : ""}`}
      >
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 rounded-t-lg">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-slate-200">
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
              <AvatarFallback className="bg-slate-200 text-slate-700 text-sm font-medium">
                {getInitials(comment.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{comment.author.name}</span>
                <Badge variant="outline" className="text-xs bg-white border-slate-300 text-slate-600">
                  {comment.author.role}
                </Badge>
                {isReply && <span className="text-xs text-slate-500">• Reply</span>}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{formatTimeAgo(comment.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border border-blue-200">
              Review
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Approved
            </Badge>
          </div>
        </div>

        <div className="p-4">
          {isEditing ? (
            <LexicalCommentComposer
              variant="professional"
              placeholder="Edit your comment..."
              onSubmit={async (content: string, editorState: string) => {
                if (onEdit) {
                  await onEdit(comment.id, content, editorState)
                  setIsEditing(false)
                }
              }}
              className="border border-slate-300 rounded-lg"
              initialContent={comment.content}
              initialEditorState={comment.editorState}
            />
          ) : (
            <LexicalReadOnlyRenderer
              editorState={comment.editorState}
              content={comment.content}
              className="text-sm text-slate-800 leading-relaxed"
            />
          )}

          <CommentActionBar
            comment={comment}
            currentUser={currentUser}
            variant="professional"
            isReply={isReply}
            isEditing={isEditing}
            isOwner={isCurrentUser}
            isReplyingTo={isReplyingTo}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            onReplyCancel={onReplyCancel}
            onApprove={onApprove}
            onToggleEdit={() => setIsEditing(!isEditing)}
            replies={replies}
          />

          <CommentSourceReference
            sourceReference={comment.sourceReference}
            variant="professional"
          />
        </div>
      </div>
    </>
  )
}
