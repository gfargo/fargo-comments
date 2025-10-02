"use client";

import { LexicalCommentComposer } from "@/lib/comments/components/lexical/lexical-comment-composer";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { AnalyticsEvents } from "@/lib/analytics";
import { CommentVariant } from "@/lib/comments/types/comments";
import { forwardRef } from "react";

interface AnalyticsCommentComposerProps {
  variant?: CommentVariant;
  onSubmit: (content: string, editorState: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
  className?: string;
  demoType?: string;
}

/**
 * Wrapper around LexicalCommentComposer that adds analytics tracking
 * for composer usage in demo pages
 */
export const AnalyticsCommentComposer = forwardRef<
  HTMLDivElement,
  AnalyticsCommentComposerProps
>(
  (
    {
      variant,
      onSubmit,
      onCancel,
      placeholder,
      initialValue,
      autoFocus,
      className,
      demoType = "demo",
      ...props
    },
    ref
  ) => {
    const { trackEvent } = useAnalytics();

    const handleSubmit = (content: string, editorState: string) => {
      // Track composer usage
      trackEvent(AnalyticsEvents.COMPOSER_USED, {
        demo_type: demoType,
        action: "submit",
        variant: variant || "default",
      });

      onSubmit(content, editorState);
    };

    const handleCancel = () => {
      trackEvent(AnalyticsEvents.COMPOSER_USED, {
        demo_type: demoType,
        action: "cancel",
        variant: variant || "default",
      });

      onCancel?.();
    };

    return (
      <LexicalCommentComposer
        ref={ref}
        variant={variant}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        placeholder={placeholder}
        initialValue={initialValue}
        autoFocus={autoFocus}
        className={className}
        {...props}
      />
    );
  }
);

AnalyticsCommentComposer.displayName = "AnalyticsCommentComposer";
