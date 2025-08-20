"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Trash2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  commentAuthor: string
  hasReplies: boolean
  replyCount?: number
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  commentAuthor,
  hasReplies,
  replyCount = 0,
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (hasReplies) return // Shouldn't happen, but safety check

    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasReplies ? (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Cannot Delete Comment
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete Comment
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasReplies ? (
              <>
                <div>
                  This comment by <strong>{commentAuthor}</strong> cannot be deleted because it has{" "}
                  <strong>
                    {replyCount} {replyCount === 1 ? "reply" : "replies"}
                  </strong>
                  .
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  To delete this comment, you must first remove all replies to it.
                </div>
              </>
            ) : (
              <div>
                Are you sure you want to delete this comment by <strong>{commentAuthor}</strong>? This action cannot be
                undone.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {hasReplies ? (
            <Button onClick={onClose} className="w-full">
              Got it
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting} className="flex-1">
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
