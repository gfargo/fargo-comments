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

interface ProfessionalVariantProps {
  comment: Comment
  currentUser: UserType
  isReply: boolean
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete: () => void
  onReply: () => void
  onApprove?: () => void
}

export function ProfessionalVariant({
  comment,
  currentUser,
  isReply,
  isEditing,
  setIsEditing,
  onEdit,
  onDelete,
  onReply,
  onApprove,
}: ProfessionalVariantProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
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
              className="border border-slate-300 rounded-lg"
              initialContent={comment.content}
              initialEditorState={comment.editorState}
            />
          </div>
        ) : (
          <>
            <LexicalReadOnlyRenderer
              editorState={comment.editorState}
              content={comment.content}
              className="text-sm text-slate-800 leading-relaxed"
            />

            {comment.sourceReference && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-blue-700 mb-1">Referenced:</div>
                    <div className="text-sm font-medium text-blue-900">{comment.sourceReference.label}</div>
                    {comment.sourceReference.description && (
                      <div className="text-xs text-blue-700 mt-1">{comment.sourceReference.description}</div>
                    )}
                    {comment.sourceReference.url && (
                      <Link
                        href={comment.sourceReference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
                      >
                        View Source <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                onClick={onApprove}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                onClick={onReply}
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              {comment.author.id === currentUser.id && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
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
