"use client";

import { useCallback, useState, useTransition } from "react";
import { debug } from "@/lib/comments/utils/debug";
import { useComments } from "@/lib/comments/contexts/comment-context";
import { toast } from "sonner";
import type { Comment } from "@/lib/comments/types/comments";

export function useCommentActions() {
  const {
    addComment,
    updateComment,
    deleteComment,
    addReaction,
    removeReaction,
    currentUser,
    getRepliesForComment,
    state,
    config,
  } = useComments();

  // The `removeReaction` and `getRepliesForComment` props are passed for consistency with other variants,
  // but are not used in this component.
  if (removeReaction && getRepliesForComment) {
    // do nothing
  }

  const [isPending, startTransition] = useTransition();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [replyContext, setReplyContext] = useState<{
    commentId: string;
    authorName: string;
  } | null>(null);

  const findRootParent = useCallback(
    (commentId: string, comments: Comment[]): string => {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) {
        return commentId;
      }

      // If this comment has no parent, it's already the root
      if (!comment.parentId) {
        return commentId;
      }

      // Traverse up the parent chain to find the root
      let currentComment = comment;
      while (currentComment.parentId) {
        const parentComment = comments.find(
          (c) => c.id === currentComment.parentId
        );
        if (!parentComment) {
          break;
        }
        currentComment = parentComment;
      }

      return currentComment.id;
    },
    []
  );

  const handleAddComment = useCallback(
    async (
      content: string,
      editorState: string,
      sourceId?: string,
      sourceType?: string,
      parentId?: string
    ) => {
      startTransition(async () => {
        try {
          await addComment(content, editorState, sourceId, sourceType, parentId);
          if (!config.hideToast) {
            toast.success("Your comment has been posted successfully.");
          }
          setShowComposer(false);
        } catch (error) {
          // The `error` variable is a placeholder for the actual implementation.
          if (error) {
            // do nothing
          }
          if (!config.hideToast) {
            toast.error("Failed to add comment. Please try again.");
          }
        }
      });
    },
    [addComment, config.hideToast]
  );

  const handleUpdateComment = useCallback(
    async (commentId: string, content: string, editorState: string) => {
      startTransition(async () => {
        try {
          await updateComment(commentId, content, editorState);
          if (!config.hideToast) {
            toast.success("Your comment has been updated successfully.");
          }
        } catch (error) {
          // The `error` variable is a placeholder for the actual implementation.
          if (error) {
            // do nothing
          }
          if (!config.hideToast) {
            toast.error("Failed to update comment. Please try again.");
          }
        }
      });
    },
    [updateComment, config.hideToast]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      startTransition(async () => {
        try {
          await deleteComment(commentId);
          if (!config.hideToast) {
            toast.success("The comment has been deleted successfully.");
          }
        } catch (error) {
          // The `error` variable is a placeholder for the actual implementation.
          if (error) {
            // do nothing
          }
          if (!config.hideToast) {
            toast.error("Failed to delete comment. Please try again.");
          }
        }
      });
    },
    [deleteComment, config.hideToast]
  );

  const handleReaction = useCallback(
    async (commentId: string, reactionType: string) => {
      startTransition(async () => {
        try {
          await addReaction(commentId, reactionType);
        } catch (error) {
          // The `error` variable is a placeholder for the actual implementation.
          if (error) {
            // do nothing
          }
          if (!config.hideToast) {
            toast.error("Failed to add reaction. Please try again.");
          }
        }
      });
    },
    [addReaction, config.hideToast]
  );

  const handleStartReply = useCallback(
    (commentId: string) => {
      const comment = state.comments.find((c) => c.id === commentId);
      if (comment) {
        setReplyContext({
          commentId,
          authorName: comment.author.name,
        });
      }
      setReplyingTo(commentId);
    },
    [state.comments]
  );

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyContext(null);
  }, []);

  const handleReplySubmit = useCallback(
    async (
      content: string,
      editorState: string,
      replyToId: string,
      comments: Comment[]
    ) => {
      const rootParentId = findRootParent(replyToId, comments);
      const parentComment = comments.find((c) => c.id === rootParentId);

      // Inherit source information from parent comment
      const sourceId = parentComment?.sourceId;
      const sourceType = parentComment?.sourceType;

      debug.log(
        "Reply submission - parentId:",
        rootParentId,
        "sourceId:",
        sourceId,
        "sourceType:",
        sourceType
      );

      await handleAddComment(
        content,
        editorState,
        sourceId,
        sourceType,
        rootParentId
      );
      setReplyingTo(null);
      setReplyContext(null);
    },
    [handleAddComment, findRootParent]
  );

  const handleReply = useCallback(
    async (content: string, editorState: string, parentId: string) => {
      startTransition(async () => {
        try {
          const rootParentId = findRootParent(parentId, state.comments);
          const parentComment = state.comments.find(
            (c) => c.id === rootParentId
          );

          // Inherit source information from root parent comment
          const sourceId = parentComment?.sourceId;
          const sourceType = parentComment?.sourceType;

          debug.log(
            "Reply submission - parentId:",
            rootParentId,
            "sourceId:",
            sourceId,
            "sourceType:",
            sourceType
          );

          await addComment(
            content,
            editorState,
            sourceId,
            sourceType,
            rootParentId
          );
          if (!config.hideToast) {
            toast.success("Your reply has been posted successfully.");
          }
        } catch (error) {
          // The `error` variable is a placeholder for the actual implementation.
          if (error) {
            // do nothing
          }
          if (!config.hideToast) {
            toast.error("Failed to add reply. Please try again.");
          }
        }
      });
    },
    [addComment, state.comments, findRootParent, config.hideToast]
  );

  const handleToggleComposer = useCallback(() => {
    setShowComposer(!showComposer);
  }, [showComposer]);

  const handleCommentSubmit = useCallback(
    async (
      content: string,
      editorState: string,
      sourceId?: string,
      sourceType?: string
    ) => {
      await handleAddComment(content, editorState, sourceId, sourceType);
    },
    [handleAddComment]
  );

  const handleLike = useCallback(
    (commentId: string) => handleReaction(commentId, "like"),
    [handleReaction]
  );
  const handleShare = useCallback(
    (commentId: string) =>
      debug.log("Share clicked for comment:", commentId),
    []
  );
  const handleForward = useCallback(
    (commentId: string) =>
      debug.log("Forward clicked for comment:", commentId),
    []
  );
  const handleApprove = useCallback(
    (commentId: string) =>
      debug.log("Approve clicked for comment:", commentId),
    []
  );
  const handleReact = useCallback(
    (commentId: string, reaction: string) => handleReaction(commentId, reaction),
    [handleReaction]
  );

  return {
    // Core actions with loading states
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleReaction,

    // Reply management
    handleStartReply,
    handleCancelReply,
    handleReplySubmit,
    handleReply, // Added handleReply to exports
    replyingTo,
    replyContext,

    // Composer management
    handleToggleComposer,
    handleCommentSubmit,
    showComposer,

    // Variant-specific actions
    handleLike,
    handleShare,
    handleForward,
    handleApprove,
    handleReact,

    // Utilities
    findRootParent,
    currentUser,
    isPending,
  };
}
