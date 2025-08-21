"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit3, User, Hash, FileText, BookOpen, Tag } from "lucide-react"
import { LexicalCommentComposer } from "@/lib/components/lexical/lexical-comment-composer"
import { CommentVariation } from "@/lib/components/comments/comment-variations"
import { currentUser } from "@/app/_demo/config/comment-data"
import { useComments } from "@/lib/contexts/comment-context"

export default function ComposerPageContent() {
  const { config, addComment } = useComments()
  const selectedVariant = config.variant || "compact"
  const [recentComments, setRecentComments] = useState<any[]>([])

  const handleAddComment = async (content: string, mentions: any[], tags: any[]) => {
    console.log("[v0] New comment:", { content, mentions, tags })

    const newComment = await addComment(
      content,
      undefined, // editorState - will be generated from content
      "composer-demo", // sourceId
      "demo", // sourceType
      undefined, // parentId
      mentions,
      tags,
    )

    // Add to recent comments for display
    if (newComment) {
      setRecentComments((prev) => [newComment, ...prev.slice(0, 4)])
    }
  }

  return (
    <div className="space-y-6">
      {/* Composer Examples */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Comment Composer Examples
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test the Lexical-based comment composer with mention and tag functionality. Comments are saved to local
            storage.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Composer */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Primary Composer ({selectedVariant})</h4>
            <LexicalCommentComposer
              onSubmit={handleAddComment}
              placeholder="Add a detailed comment with mentions and tags..."
              variant={selectedVariant}
            />
          </div>

          {/* Compact Composer */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Reply Composer (compact)</h4>
            <LexicalCommentComposer
              onSubmit={handleAddComment}
              placeholder="Quick comment with mentions and tags..."
              variant={selectedVariant === "mobile" ? "mobile" : "compact"}
            />
          </div>

          {/* Inline Composer */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Inline Composer (inline)</h4>
            <LexicalCommentComposer onSubmit={handleAddComment} placeholder="Inline comment..." variant="inline" />
          </div>
        </CardContent>
      </Card>

      {/* Mention & Tag Reference */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Available Mentions & Tags
          </CardTitle>
          <p className="text-sm text-gray-600">
            Reference guide for available mentions and tags you can use in the composer above.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Users for Mentions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Users (@ mentions)
              </h4>
              <div className="space-y-2">
                {[
                  { name: "John Smith", email: "john.smith@company.com" },
                  { name: "Sarah Johnson", email: "sarah.johnson@company.com" },
                  { name: "Mike Chen", email: "mike.chen@company.com" },
                  { name: "Emily Davis", email: "emily.davis@company.com" },
                  { name: "Alex Rodriguez", email: "alex.rodriguez@company.com" },
                ].map((user) => (
                  <div key={user.name} className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      @{user.name.toLowerCase().replace(" ", "")}
                    </Badge>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources for Tags */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                Resources (# tags)
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-medium">Questions</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["question1.3.1", "question2.1.4", "question3.2.1"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-3 w-3 text-purple-600" />
                    <span className="text-sm font-medium">Rules</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["rule3.1.3", "rule2.4.1", "rule1.2.5"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-3 w-3 text-orange-600" />
                    <span className="text-sm font-medium">Sections & Labels</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["section2.4", "front-label", "nutrition-panel"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Usage:</strong> Type @ to mention users or # to reference resources. The composer will show
              suggestions as you type, and you can navigate with arrow keys or click to select.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
            <p className="text-sm text-gray-600">
              Comments you've created using the composer above, displayed in the current {selectedVariant} style.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <CommentVariation
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  variant={selectedVariant}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
