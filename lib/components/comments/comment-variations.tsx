"use client"
import { useState } from "react"
import type { Comment, User as UserType } from "@/lib/types/comments"
import { CardVariant } from "./variants/card-variant"
import { GitHubVariant } from "./variants/github-variant"
import { EmailVariant } from "./variants/email-variant"
import { BubbleVariant } from "./variants/bubble-variant"
import { TimelineVariant } from "./variants/timeline-variant"
import { SocialVariant } from "./variants/social-variant"
import { ThreadVariant } from "./variants/thread-variant"
import { ProfessionalVariant } from "./variants/professional-variant"
import { MobileVariant } from "./variants/mobile-variant"
import { NotionVariant } from "./variants/notion-variant"
import { CleanVariant } from "./variants/clean-variant"
import { CompactVariant } from "./variants/compact-variant"
import { PlainVariant } from "./variants/plain-variant"

export type CommentVariant =
  | "card"
  | "bubble"
  | "timeline"
  | "compact"
  | "plain"
  | "social"
  | "professional"
  | "clean"
  | "thread"
  | "github"
  | "email"
  | "notion"
  | "mobile"

export interface CommentVariationProps {
  comment: Comment
  currentUser: UserType
  variant: CommentVariant
  showInlineEdit?: boolean
  replies?: Comment[]
  isReplyingTo?: boolean
  onEdit?: (commentId: string, content: string, editorState: string) => void
  onDelete?: (commentId: string) => void
  onReply?: (commentId: string) => void
  onReplyCancel?: () => void
  // Custom action callbacks
  onLike?: (commentId: string) => void
  onShare?: (commentId: string) => void
  onForward?: (commentId: string) => void
  onApprove?: (commentId: string) => void
  onReact?: (commentId: string, reaction: string) => void
}

export function CommentVariation({
  comment,
  currentUser,
  variant,
  showInlineEdit,
  replies = [],
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
}: CommentVariationProps) {
  const [isEditing, setIsEditing] = useState(showInlineEdit || false)

  const handleDelete = () => onDelete?.(comment.id)
  const handleReply = () => onReply?.(comment.id)
  const handleLike = () => onLike?.(comment.id)
  const handleShare = () => onShare?.(comment.id)
  const handleForward = () => onForward?.(comment.id)
  const handleApprove = () => onApprove?.(comment.id)
  const handleReact = (reaction: string) => onReact?.(comment.id, reaction)

  const isReply = !!comment.parentId

  if (variant === "card") {
    return (
      <CardVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
        replies={replies}
      />
    )
  }

  if (variant === "github") {
    return (
      <GitHubVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onReact={handleReact}
      />
    )
  }

  if (variant === "email") {
    return (
      <EmailVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onForward={handleForward}
      />
    )
  }

  if (variant === "bubble") {
    return (
      <BubbleVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
      />
    )
  }

  if (variant === "timeline") {
    return (
      <TimelineVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
      />
    )
  }

  if (variant === "social") {
    return (
      <SocialVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
        onShare={handleShare}
      />
    )
  }

  if (variant === "thread") {
    return (
      <ThreadVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
      />
    )
  }

  if (variant === "professional") {
    return (
      <ProfessionalVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onApprove={handleApprove}
      />
    )
  }

  if (variant === "mobile") {
    return (
      <MobileVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
      />
    )
  }

  if (variant === "notion") {
    return (
      <NotionVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
      />
    )
  }

  if (variant === "clean") {
    return (
      <CleanVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
      />
    )
  }

  if (variant === "compact") {
    return (
      <CompactVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
        replies={replies}
      />
    )
  }

  if (variant === "plain") {
    return (
      <PlainVariant
        comment={comment}
        currentUser={currentUser}
        isReply={isReply}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReplyingTo={isReplyingTo}
        onEdit={onEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReplyCancel={onReplyCancel}
        onLike={handleLike}
      />
    )
  }

  return null
}
