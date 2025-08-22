"use client";
import { Badge } from "@/components/ui/badge";
import type { Comment, User as UserType } from "@/lib/types/comments";
import { formatTimeAgo } from "@/lib/utils";
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer";
import { LexicalReadOnlyRenderer } from "@/lib/components/lexical/lexical-read-only-renderer";
import { CommentActionBar } from "../comment-action-bar";
import { CommentSourceReference } from "../comment-source-reference";

interface CleanVariantProps {
  comment: Comment;
  currentUser: UserType;
  isReply: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onEdit?: (commentId: string, content: string, editorState: string) => void;
  onDelete?: () => void;
  onReply?: () => void;
  onLike?: () => void;
  isReplyingTo?: boolean;
  onReplyCancel?: () => void;
  replies?: Comment[];
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
  isReplyingTo = false,
  onReplyCancel,
  replies = [],
}: CleanVariantProps) {
  const isCurrentUser = comment.author.id === currentUser.id;

  return (
    <div
      className={`group py-4 ${
        isReply ? "ml-8 border-l border-l-gray-200 pl-6 bg-gray-50/20" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-1">
          {isReply && <span className="text-gray-400 text-sm">↳</span>}
          <span className="font-medium text-gray-900">
            {comment.author.name}
          </span>
          <span className="text-sm text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {isReply && (
            <Badge
              variant="outline"
              className="text-xs text-gray-500 border-gray-200 bg-white"
            >
              Reply
            </Badge>
          )}
        </div>
      </div>

      {isEditing ? (
        <LexicalCommentComposer
          variant="clean"
          placeholder="Edit your comment..."
          onSubmit={async (content: string, editorState: string) => {
            if (onEdit) {
              await onEdit(comment.id, content, editorState);
              setIsEditing(false);
            }
          }}
          className="border border-gray-200 rounded-lg"
          initialContent={comment.content}
          initialEditorState={comment.editorState}
        />
      ) : (
        <LexicalReadOnlyRenderer
          editorState={comment.editorState}
          content={comment.content}
          className="text-sm text-gray-800 leading-relaxed mb-2"
        />
      )}

      <CommentActionBar
        comment={comment}
        currentUser={currentUser}
        variant="clean"
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
        variant="clean"
      />
    </div>
  );
}
