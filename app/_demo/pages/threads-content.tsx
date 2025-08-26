"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Clock, CheckCircle2, AlertCircle, Flag } from "lucide-react"
import { CommentVariation } from "@/lib/components/comments/comment-variations"
import { sampleThreadComments, currentUser } from "@/app/_demo/config/comment-data"
import { useComments } from "@/lib/contexts/comment-context"

export default function ThreadsPageContent() {
  const { config } = useComments()
  const selectedVariant = config.variant || "card"
  const [selectedThread, setSelectedThread] = useState<string>("audit-workflow")

  const threadExamples = [
    {
      id: "audit-workflow",
      title: "Audit Workflow Example",
      description: "Complete audit discussion from issue identification to resolution",
      participants: 6,
      comments: sampleThreadComments,
      status: "resolved" as const,
      priority: "high" as const,
    },
    {
      id: "quick-discussion",
      title: "Quick Discussion",
      description: "Short back-and-forth conversation between team members",
      participants: 3,
      comments: sampleThreadComments.slice(0, 3),
      status: "active" as const,
      priority: "medium" as const,
    },
    {
      id: "complex-thread",
      title: "Complex Multi-Branch Thread",
      description: "Deep conversation with multiple reply branches and participants",
      participants: 8,
      comments: sampleThreadComments,
      status: "active" as const,
      priority: "low" as const,
    },
  ]

  const selectedThreadData = threadExamples.find((t) => t.id === selectedThread)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-amber-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />
      case "active":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Thread Selection */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Thread Examples
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select a thread example to see how conversations look in the current {selectedVariant} style.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {threadExamples.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedThread === thread.id
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{thread.title}</h4>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-xs ${getStatusColor(thread.status)}`}>
                      {getStatusIcon(thread.status)}
                      <span className="ml-1">{thread.status}</span>
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{thread.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {thread.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {thread.comments.length}
                    </span>
                  </div>
                  <Flag className={`h-3 w-3 ${getPriorityColor(thread.priority)}`} />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Thread Display */}
      {selectedThreadData && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedThreadData.status)}
                  {selectedThreadData.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{selectedThreadData.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getStatusColor(selectedThreadData.status)}`}>
                  {selectedThreadData.status}
                </Badge>
                <Flag className={`h-4 w-4 ${getPriorityColor(selectedThreadData.priority)}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedThreadData.comments.map((comment) => (
                <CommentVariation
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  variant={selectedVariant}
                  showThread={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thread Features */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Thread Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Visual Hierarchy</h4>
              <p className="text-sm text-gray-600">
                Clear parent-child relationships with proper indentation and visual connections between replies and
                their parent comments.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Status Tracking</h4>
              <p className="text-sm text-gray-600">
                Comments can have different statuses (open, in-progress, resolved) with visual indicators and color
                coding.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Priority Levels</h4>
              <p className="text-sm text-gray-600">
                High, medium, and low priority indicators help teams focus on the most important discussions first.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Multi-Participant</h4>
              <p className="text-sm text-gray-600">
                Support for multiple team members with role-based styling and clear authorship identification.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Thread Flow Example</h4>
            <p className="text-sm text-purple-800">
              The &quot;Audit Workflow Example&quot; above demonstrates a complete workflow from issue identification to
              resolution, showing how different team members collaborate using the comment system. Notice how replies
              are visually connected to parent comments and how status changes are reflected throughout the
              conversation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
