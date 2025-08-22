"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  BookText,
  X,
  ThumbsUp,
  Share2Icon,
  ForwardIcon,
  CheckCircle2Icon,
  MessageCircleXIcon,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/lib/components/comments/delete-confirmation-dialog";
import type { Comment, User as UserType } from "@/lib/types/comments";
import type { CommentVariant } from "@/lib/components/comments/comment-variations";

interface CommentActionBarProps {
  comment: Comment;
  currentUser: UserType;
  variant: CommentVariant;
  isReply: boolean;
  isEditing: boolean;
  isOwner: boolean;
  isReplyingTo?: boolean;
  onEdit?: (commentId: string, content: string, editorState: string) => void;
  onDelete?: () => void;
  onReply?: () => void;
  onReplyCancel?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onForward?: () => void;
  onApprove?: () => void;
  onReact?: (reaction: string) => void;
  onToggleEdit?: () => void;
  replies?: Comment[];
}

export function CommentActionBar({
  comment,
  currentUser,
  variant,
  isReply,
  isEditing,
  isOwner,
  isReplyingTo = false,
  onEdit,
  onDelete,
  onReply,
  onReplyCancel,
  onLike,
  onShare,
  onForward,
  onApprove,
  onReact,
  onToggleEdit,
  replies = [],
}: CommentActionBarProps) {
  const [showReferences, setShowReferences] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    setShowDeleteDialog(false);
  };

  const getActionBarStyles = () => {
    switch (variant) {
      case "compact":
        return "flex items-center gap-3 mt-2";
      case "card":
        return "flex items-center gap-4 mt-3 pt-3 border-t border-gray-100";
      case "bubble":
        return "flex items-center gap-2 mt-2";
      case "timeline":
        return "flex items-center gap-4 mt-4 pt-3 border-t border-blue-100";
      case "social":
        return "flex items-center justify-start gap-4 mt-4 pt-3 border-t border-gray-100";
      case "professional":
        return "flex items-center gap-4 mt-3 pt-3 border-t border-gray-200";
      case "clean":
        return "flex items-center gap-3 mt-2";
      case "github":
        return "flex items-center gap-2 mt-2";
      case "email":
        return "flex items-center gap-3 mt-3 pt-2 border-t border-gray-100";
      case "notion":
        return "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity";
      case "mobile":
        return "flex items-center gap-4 mt-4";
      case "thread":
        return "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150";
      case "plain":
        return "flex items-center gap-3 mt-2";
      default:
        return "flex items-center gap-3 mt-2";
    }
  };

  const getButtonStyles = (action?: string) => {
    const baseStyles = getBaseButtonStyles();
    const actionStyles = getActionSpecificStyles(action);
    return `${baseStyles} ${actionStyles}`;
  };

  const getBaseButtonStyles = () => {
    switch (variant) {
      case "compact":
        return "h-6 px-2 text-xs";
      case "card":
        return "h-8 px-3 text-sm";
      case "bubble":
        return "h-7 px-2 text-xs";
      case "timeline":
        return "h-8 px-2 text-sm";
      case "social":
        return "h-8 px-3 text-sm";
      case "professional":
        return "h-8 px-4 text-sm";
      case "clean":
        return "h-7 px-2 text-sm";
      case "github":
        return "h-6 px-2 text-xs";
      case "email":
        return "h-7 px-3 text-sm";
      case "notion":
        return "h-6 px-2 text-xs";
      case "mobile":
        return "h-10 px-4 text-base";
      case "thread":
        return "h-6 px-2 text-xs";
      case "plain":
        return "h-6 px-2 text-sm";
      default:
        return "h-6 px-2 text-xs";
    }
  };

  const getActionSpecificStyles = (action?: string) => {
    switch (variant) {
      case "professional":
        switch (action) {
          case "approve":
            return "text-slate-600 hover:text-blue-600 hover:bg-blue-50";
          case "delete":
            return "text-slate-600 hover:text-red-600 hover:bg-red-50";
          default:
            return "text-slate-600 hover:text-slate-800 hover:bg-slate-100";
        }
      case "thread":
        switch (action) {
          case "like":
            return "text-gray-500 hover:text-blue-600 hover:bg-blue-50";
          case "reply":
            return "text-gray-500 hover:text-green-600 hover:bg-green-50";
          case "delete":
            return "text-gray-500 hover:text-red-600 hover:bg-red-50";
          default:
            return "text-gray-500 hover:text-blue-600 hover:bg-blue-50";
        }
      case "social":
        switch (action) {
          case "like":
            return "text-gray-600 hover:text-pink-600 hover:bg-pink-50";
          case "reply":
            return "text-gray-600 hover:text-blue-600 hover:bg-blue-50";
          case "share":
            return "text-gray-600 hover:text-green-600 hover:bg-green-50";
          case "delete":
            return "text-gray-600 hover:text-red-600 hover:bg-red-50";
          default:
            return "text-gray-600 hover:text-gray-800";
        }
      case "notion":
        switch (action) {
          case "like":
            return "text-gray-500 hover:text-orange-600 hover:bg-orange-50";
          case "delete":
            return "text-gray-500 hover:text-red-600 hover:bg-red-50";
          default:
            return "text-gray-500 hover:text-gray-700 hover:bg-gray-100";
        }
      case "compact":
        return "text-gray-500 hover:text-gray-700";
      case "card":
        return "text-gray-600 hover:text-gray-800";
      case "bubble":
        return "text-blue-600 hover:text-blue-800";
      case "timeline":
        return "text-blue-600 hover:text-blue-800";
      case "clean":
        return "text-gray-500 hover:text-gray-700";
      case "github":
        return "text-gray-600 hover:text-gray-800";
      case "email":
        return "text-gray-600 hover:text-gray-800";
      case "mobile":
        return "text-gray-600 hover:text-gray-800";
      case "plain":
        return "text-gray-500 hover:text-gray-700";
      default:
        return "text-gray-500 hover:text-gray-700";
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case "mobile":
        return "w-4 h-4";
      case "social":
        return "w-4 h-4";
      case "professional":
        return "w-4 h-4";
      case "thread":
        return "w-3 h-3";
      case "notion":
        return "w-3 h-3";
      default:
        return "w-3 h-3";
    }
  };

  const getIconMargin = (showText: boolean) => {
    if (!showText) return "mr-0";

    switch (variant) {
      case "professional":
      case "social":
        return "mr-2";
      case "thread":
        return "mr-1";
      default:
        return "mr-1";
    }
  };

  const showTextLabels = () => {
    switch (variant) {
      case "compact":
      case "card":
      case "mobile":
      case "social":
      case "email":
      case "professional":
      case "github":
        return true;
      case "bubble":
      case "timeline":
      case "clean":
      case "notion":
      case "thread":
      case "plain":
        return false;
      default:
        return true;
    }
  };

  const iconSize = getIconSize();
  const showText = showTextLabels();
  const iconMargin = getIconMargin(showText);

  // Hide actions when editing (except toggle edit button)
  if (isEditing) {
    return (
      <div className={getActionBarStyles()}>
        {isOwner && onToggleEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEdit}
            className={getButtonStyles()}
          >
            <X className={`${iconSize} ${iconMargin}`} />
            Close
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={getActionBarStyles()}>
        {onReact && variant === "github" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReact("👍")}
            className={getButtonStyles("react")}
          >
            <ThumbsUp className={`${iconSize} ${iconMargin}`} />
            {showText ? "👍 React" : "👍"}
          </Button>
        )}

        {onLike && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={getButtonStyles("like")}
          >
            <Heart className={`${iconSize} ${iconMargin}`} />
            {showText ? "Like" : ""}
          </Button>
        )}

        {(onReply || onReplyCancel) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={isReplyingTo ? onReplyCancel : onReply}
            className={getButtonStyles("reply")}
          >
            {isReplyingTo ? (
              <MessageCircleXIcon className={`${iconSize} ${iconMargin}`} />
            ) : (
              <MessageCircle className={`${iconSize} ${iconMargin}`} />
            )}
            {showText ? (isReplyingTo ? "Cancel" : "Reply") : ""}
          </Button>
        )}

        {comment.sourceReference && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReferences(!showReferences)}
            className={`${getButtonStyles("reference")} ${
              showReferences ? "text-purple-600 bg-purple-50" : ""
            }`}
          >
            <BookText className={`${iconSize} ${iconMargin}`} />
            {showText ? "References" : ""}
          </Button>
        )}

        {onShare && variant === "social" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className={getButtonStyles("share")}
          >
            <Share2Icon className={`${iconSize} ${iconMargin}`} />
            {showText ? "Share" : ""}
          </Button>
        )}

        {onForward && variant === "email" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onForward}
            className={getButtonStyles()}
          >
            <ForwardIcon className={`${iconSize} ${iconMargin}`} />
            {showText ? "Forward" : ""}
          </Button>
        )}

        {onApprove && variant === "professional" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onApprove}
            className={getButtonStyles("approve")}
          >
            <CheckCircle2Icon className={`${iconSize} ${iconMargin}`} />
            {showText ? "Approve" : ""}
          </Button>
        )}

        {isOwner && (
          <>
            {onToggleEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleEdit}
                className={getButtonStyles("edit")}
              >
                <Edit className={`${iconSize} ${iconMargin}`} />
                {showText ? "Edit" : ""}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className={getButtonStyles("delete")}
            >
              <Trash2 className={`${iconSize} ${iconMargin}`} />
              {showText ? "Delete" : ""}
            </Button>
          </>
        )}
      </div>

      {/* Source Reference Display */}
      {comment.sourceReference && showReferences && (
        <div
          className={
            variant === "github"
              ? "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              : variant === "professional"
              ? "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              : variant === "thread"
              ? "mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
              : variant === "social"
              ? "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              : variant === "notion"
              ? "mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md"
              : "mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs"
          }
        >
          <div className="flex items-start gap-2">
            <div
              className={
                variant === "github"
                  ? "w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                  : variant === "thread"
                  ? "w-1.5 h-1.5 bg-blue-500 rounded-full"
                  : variant === "social"
                  ? "w-2 h-2 bg-blue-500 rounded-full"
                  : variant === "notion"
                  ? "w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"
                  : "w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"
              }
            ></div>
            <div className="flex-1">
              {variant === "notion" ? (
                <>
                  <div className="text-xs font-medium text-orange-700 mb-1">
                    Referenced:
                  </div>
                  <div className="text-sm font-medium text-orange-900">
                    {comment.sourceReference.label}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-blue-700 font-medium">
                    Referenced:{" "}
                  </span>
                  <span className="text-blue-800">
                    {comment.sourceReference.label}
                  </span>
                </>
              )}
              {comment.sourceReference.description && (
                <div className="text-blue-600 mt-1">
                  {comment.sourceReference.description}
                </div>
              )}
              {comment.sourceReference.url && (
                <a
                  href={comment.sourceReference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                >
                  View Source �
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        commentAuthor={comment.author.name}
        hasReplies={replies.length > 0}
        replyCount={replies.length}
      />
    </>
  );
}
