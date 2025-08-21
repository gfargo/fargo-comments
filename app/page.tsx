"use client"
import { CommentList } from "@/components/comments/comment-list"
import { CommentDrawer } from "@/components/comments/comment-drawer"
import { CommentLayout } from "@/components/layout/comment-layout"
import { CommentProvider, useComments } from "@/contexts/comment-context"
import { useCommentActions } from "@/hooks/use-comment-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Edit3, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockComments, currentUser } from "@/lib/constants/comment-data"

function LiveCommentDemo() {
  const { config, getCommentsBySource, getRepliesForComment } = useComments()
  console.log("livedemo config variant::: ", config.variant)
  const selectedVariant = config.variant || "compact"
  const { handleAddComment, handleUpdateComment, handleDeleteComment, handleReply } = useCommentActions()

  const sourceId = "test-source-id"
  const sourceType = "demo"
  const comments = getCommentsBySource(sourceId, sourceType)

  const handleLike = (commentId: string) => {
    console.log("[v0] Like button pressed for comment:", commentId)
  }

  const handleShare = (commentId: string) => {
    console.log("[v0] Share button pressed for comment:", commentId)
  }

  const handleForward = (commentId: string) => {
    console.log("[v0] Forward button pressed for comment:", commentId)
  }

  const handleApprove = (commentId: string) => {
    console.log("[v0] Approve button pressed for comment:", commentId)
  }

  const handleReact = (commentId: string, reaction: string) => {
    console.log("[v0] React button pressed for comment:", commentId, "with reaction:", reaction)
  }

  return (
    <CommentList
      comments={comments}
      currentUser={currentUser}
      sourceId={sourceId}
      sourceType={sourceType}
      title={`Live Comment Demo - ${selectedVariant.charAt(0).toUpperCase() + selectedVariant.slice(1)} Style`}
      showComposerByDefault
      variant={selectedVariant}
      enableSearch={true}
      enableSorting={true}
      showAddForm={true}
      onAddComment={(content, editorState, sourceId, sourceType) =>
        handleAddComment(content, editorState, sourceId, sourceType)
      }
      onReply={(content, editorState, parentId) => handleReply(content, editorState, parentId)}
      onEdit={handleUpdateComment}
      onDelete={handleDeleteComment}
      onLike={handleLike}
      onShare={handleShare}
      onForward={handleForward}
      onApprove={handleApprove}
      onReact={handleReact}
      getRepliesForComment={getRepliesForComment}
    />
  )
}

function MainPageContent() {
  const { config } = useComments()
  const selectedVariant = config.variant || "compact"

  return (
    <div className="space-y-6">
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/composer">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-green-600" />
                Comment Composer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test the Lexical-based comment composer with mentions and tags functionality.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Try Composer →
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/threads">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Thread Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                See how full conversation threads look in different design styles.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Threads →
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Global Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View all comments in a centralized slide-out drawer with search and filtering.
            </p>
            <CommentDrawer
              comments={mockComments}
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
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Advanced Rich Text Editing</h4>
              <p className="text-sm text-gray-600">
                Powered by Lexical with @mentions, #tags, auto-list creation, emoji search, and automatic URL/email
                detection. Centralized configuration ensures consistency across editing and read-only modes.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Flexible Storage Architecture</h4>
              <p className="text-sm text-gray-600">
                Pluggable storage adapters support localStorage, REST APIs, server actions, and Tanstack Query. Switch
                between storage backends without changing your components.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">12+ Design Variants</h4>
              <p className="text-sm text-gray-600">
                From card and bubble styles to timeline and GitHub variants - each with unique visual identity and user
                experience.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Generic Source Association</h4>
              <p className="text-sm text-gray-600">
                Comments can be associated with any entity type using sourceId/sourceType patterns. Perfect for audits,
                projects, documents, or custom domain objects.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Flat Thread Architecture</h4>
              <p className="text-sm text-gray-600">
                Smart reply system with improved flat threading that prevents deep nesting while maintaining visual
                hierarchy and proper reply associations.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Search & Storage Management</h4>
              <p className="text-sm text-gray-600">
                Full-text comment search with filtering, adapter-based storage persistence, and easy data management
                tools.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Seamless Inline Editing</h4>
              <p className="text-sm text-gray-600">
                Edit comments in-place with auto-clearing composers, save/cancel controls, and consistent UX across all
                variants.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Context-Aware UI</h4>
              <p className="text-sm text-gray-600">
                Adaptive composer styling, variant-specific button configurations, and intelligent placeholder
                positioning with centralized Lexical configuration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CommentSystemDemo() {
  return (
    <CommentProvider initialUser={currentUser}>
      <CommentLayout
        title={
          <div className="flex items-baseline gap-2">
            <Image src="/okayd-logo.png" alt="Okayd" width={107} height={32} className="h-8 w-auto" />
            <span className="flex">Comments</span>
          </div>
        }
        description="Open source React commenting system with rich text editing, multiple design variants, and flexible storage adapters"
      >

        <MainPageContent />
      </CommentLayout>
    </CommentProvider>
  )
}
