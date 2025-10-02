"use client";
import { CommentList } from "@/lib/comments/components/comments/comment-list";
import { CommentDrawer } from "@/lib/comments/components/comments/comment-drawer";
import { useComments } from "@/lib/comments/contexts/comment-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Edit3 } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@/app/_demo/config/comment-data";
import { useCommentActions } from "@/lib/comments/hooks/use-comment-actions";
import { InstallationCard } from "@/app/_demo/components/installation-card";
import { SystemFeaturesCard } from "@/app/_demo/components/system-features-card";
import { CommentVariant } from "@/lib/comments/types/comments";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { AnalyticsEvents } from "@/lib/analytics";

function LiveCommentDemo() {
  const { config, getcommentsSource, getRepliesForComment } = useComments();
  const selectedVariant = config.variant || "card";
  const { trackEvent } = useAnalytics();
  const {
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleReply,
  } = useCommentActions();

  const sourceId = "test-source-id";
  const sourceType = "demo";
  const comments = getcommentsSource(sourceId, sourceType);

  const handleLike = (commentId: string) => {
    console.log("[FARGO] Like button pressed for comment:", commentId);
    trackEvent(AnalyticsEvents.COMMENT_ACTION, {
      demo_type: 'live-demo',
      action: 'like',
      variant: selectedVariant,
    });
  };

  const handleShare = (commentId: string) => {
    console.log("[FARGO] Share button pressed for comment:", commentId);
    trackEvent(AnalyticsEvents.COMMENT_ACTION, {
      demo_type: 'live-demo',
      action: 'share',
      variant: selectedVariant,
    });
  };

  const handleForward = (commentId: string) => {
    console.log("[FARGO] Forward button pressed for comment:", commentId);
    trackEvent(AnalyticsEvents.COMMENT_ACTION, {
      demo_type: 'live-demo',
      action: 'forward',
      variant: selectedVariant,
    });
  };

  const handleApprove = (commentId: string) => {
    console.log("[FARGO] Approve button pressed for comment:", commentId);
    trackEvent(AnalyticsEvents.COMMENT_ACTION, {
      demo_type: 'live-demo',
      action: 'approve',
      variant: selectedVariant,
    });
  };

  const handleReact = (commentId: string, reaction: string) => {
    console.log(
      "[FARGO] React button pressed for comment:",
      commentId,
      "with reaction:",
      reaction
    );
    trackEvent(AnalyticsEvents.COMMENT_ACTION, {
      demo_type: 'live-demo',
      action: 'react',
      variant: selectedVariant,
      feature: reaction,
    });
  };

  return (
    <CommentList
      comments={comments}
      currentUser={currentUser}
      sourceId={sourceId}
      sourceType={sourceType}
      title={`Live Comment Demo - ${
        selectedVariant.charAt(0).toUpperCase() + selectedVariant.slice(1)
      } Style`}
      showComposerByDefault
      variant={selectedVariant}
      enableSearch={true}
      enableSorting={true}
      showAddForm={true}
      onAddComment={(content, editorState, sourceId, sourceType) => {
        trackEvent(AnalyticsEvents.COMMENT_ACTION, {
          demo_type: 'live-demo',
          action: 'add',
          variant: selectedVariant,
        });
        return handleAddComment(content, editorState, sourceId, sourceType);
      }}
      onReply={(content, editorState, parentId) => {
        trackEvent(AnalyticsEvents.COMMENT_ACTION, {
          demo_type: 'live-demo',
          action: 'reply',
          variant: selectedVariant,
        });
        return handleReply(content, editorState, parentId);
      }}
      onEdit={(commentId, content, editorState) => {
        trackEvent(AnalyticsEvents.COMMENT_ACTION, {
          demo_type: 'live-demo',
          action: 'edit',
          variant: selectedVariant,
        });
        return handleUpdateComment(commentId, content, editorState);
      }}
      onDelete={(commentId) => {
        trackEvent(AnalyticsEvents.COMMENT_ACTION, {
          demo_type: 'live-demo',
          action: 'delete',
          variant: selectedVariant,
        });
        return handleDeleteComment(commentId);
      }}
      onLike={handleLike}
      onShare={handleShare}
      onForward={handleForward}
      onApprove={handleApprove}
      onReact={handleReact}
      getRepliesForComment={getRepliesForComment}
    />
  );
}

export default function MainPageContent() {
  const { config } = useComments();
  const selectedVariant = (config.variant || "card") as CommentVariant;
  const { trackEvent } = useAnalytics();

  return (
    <div className="space-y-6">
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/composer"
          className="flex"
          onClick={() => trackEvent(AnalyticsEvents.DEMO_PAGE_VISITED, {
            demo_type: 'composer',
            action: 'navigate',
          })}
        >
          <Card className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Comment Composer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Test the Lexical-based comment composer with mentions and tags
                functionality.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-primary/20 text-primary hover:bg-primary/30 border-primary/20"
              >
                Try Composer →
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/threads"
          className="flex"
          onClick={() => trackEvent(AnalyticsEvents.DEMO_PAGE_VISITED, {
            demo_type: 'threads',
            action: 'navigate',
          })}
        >
          <Card className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Thread Examples</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                See how full conversation threads look in different design
                styles.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-primary/20 text-primary hover:bg-primary/30 border-primary/20"
              >
                View Threads →
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Global Comments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View all comments in a centralized slide-out drawer with search
              and filtering.
            </p>
            <CommentDrawer
              currentUser={currentUser}
              onAddComment={() => {}}
              onReply={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              onReact={() => {}}
              variant={selectedVariant}
            />
          </CardContent>
        </Card>
      </div>

      <LiveCommentDemo />

      {/* Features Overview */}
      <SystemFeaturesCard />

      {/* Installation Instructions */}
      <InstallationCard />
    </div>
  );
}
