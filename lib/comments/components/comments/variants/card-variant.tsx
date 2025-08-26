"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Comment, User as UserType } from "@/lib/comments/types/comments";
import { formatTimeAgo } from '@/lib/comments/utils/formatTimeAgo';
import { LexicalCommentComposer } from "@/lib/comments/components/lexical/lexical-comment-composer";
import { LexicalReadOnlyRenderer } from "@/lib/comments/components/lexical/lexical-read-only-renderer";
import { CommentActionBar } from "@/lib/comments/components/comments/comment-action-bar";
import { CommentSourceReference } from "../comment-source-reference";

interface CardVariantProps {
  comment: Comment;
  currentUser: UserType;
  isReply: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isReplyingTo?: boolean;
  onEdit?: (commentId: string, content: string, editorState: string) => void;
  onDelete?: () => void;
  onReply?: () => void;
  onReplyCancel?: () => void;
  onLike?: () => void;
  replies?: Comment[];
}

export function CardVariant({
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
  onLike,
  replies = [],
}: CardVariantProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEditSubmit = async (content: string, editorState: string) => {
    if (onEdit) {
      await onEdit(comment.id, content, editorState);
      setIsEditing(false);
    }
  };

  const isCurrentUser = comment.author.id === currentUser.id;

  return (
    <Card
      className={`shadow-sm py-4 hover:shadow-md transition-shadow duration-200 ${
        isReply ? "ml-8 border-l-4 border-l-green-400 bg-green-50/50" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage
              src={comment.author.avatar || "/placeholder.svg"}
              alt={comment.author.name}
            />
            <AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isReply && (
                <span className="text-sm text-green-600 font-medium">↳</span>
              )}
              <span className="font-semibold text-gray-900">
                {comment.author.name}
              </span>
              <Badge
                variant="outline"
                className="text-xs px-2 py-0 bg-white border-gray-300 rounded-full"
              >
                {comment.author.role}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {isEditing && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                >
                  Editing
                </Badge>
              )}
            </div>

            {isEditing ? (
              <LexicalCommentComposer
                variant="card"
                placeholder="Edit your comment..."
                onSubmit={handleEditSubmit}
                className="border border-gray-200 rounded-lg"
                initialContent={comment.content}
                initialEditorState={comment.editorState}
              />
            ) : (
              <div className="mb-3">
                <LexicalReadOnlyRenderer
                  editorState={comment.editorState}
                  content={comment.content}
                  className="text-sm text-gray-800 leading-relaxed"
                />
              </div>
            )}

            <CommentActionBar
              comment={comment}
              currentUser={currentUser}
              variant="card"
              isReply={isReply}
              isEditing={isEditing}
              isOwner={isCurrentUser}
              isReplyingTo={isReplyingTo}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              onReplyCancel={onReplyCancel}
              onLike={onLike}
              onToggleEdit={() => setIsEditing(!isEditing)}
              replies={replies}
            />

            <CommentSourceReference
              sourceReference={comment.sourceReference}
              variant="card"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
