"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { CommentList } from "./comment-list"
import { useComments } from "@/lib/comments/contexts/comment-context"
import { useCommentActions } from "@/lib/comments/hooks/use-comment-actions"
import { CommentVariant } from '@/lib/comments/types/comments'

interface CommentDrawerProps {
  sourceId?: string
  sourceType?: string
  variant?: CommentVariant
  enableSearch?: boolean
  enableSorting?: boolean
  enableComposer?: boolean
  enableFiltering?: boolean
  title?: string
  triggerLabel?: string
  width?: string
}

export function CommentDrawer({
  sourceId,
  sourceType,
  variant = "card",
  enableSearch = true,
  enableSorting = true,
  enableComposer = true,
  title = "Comments",
  triggerLabel = "All Comments",
  width = "700px",
}: CommentDrawerProps) {
  const { state, currentUser, getCommentsBySource, getRepliesForComment } = useComments()
  const {
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLike,
    handleShare,
    handleForward,
    handleApprove,
    handleReact,
  } = useCommentActions()

  const comments = sourceId ? getCommentsBySource(sourceId, sourceType) : state.comments

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent w-full">
          <MessageSquare className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0" style={{ width, maxWidth: "none" }}>
        <div className="flex flex-col h-screen max-h-screen pt-4">
          <SheetHeader className="p-6 border-b flex-shrink-0 sr-only">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {title}
              <Badge variant="outline" className="ml-2 text-xs">
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Style
              </Badge>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6">
              <CommentList
                comments={comments}
                currentUser={currentUser!}
                sourceId={sourceId}
                sourceType={sourceType}
                variant={variant}
                enableSearch={enableSearch}
                enableSorting={enableSorting}
                showAddForm={enableComposer}
                onAddComment={(content, editorState) => handleAddComment(content, editorState, sourceId, sourceType)}
                onEdit={handleUpdateComment}
                onDelete={handleDeleteComment}
                onLike={handleLike}
                onShare={handleShare}
                onForward={handleForward}
                onApprove={handleApprove}
                onReact={handleReact}
                getRepliesForComment={getRepliesForComment}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
