import type { Metadata } from "next"
import { CommentLayout } from "@/app/_demo/components/layout/comment-layout"
import ThreadsPageContent from "../_demo/pages/threads-content"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Thread Examples",
  description: "See how full conversation threads look in different design styles.",
}

export default function ThreadsPage() {
  return (
    <CommentLayout
      title="Thread Examples"
      description="See how full conversation threads look in different design styles"
    >
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <ThreadsPageContent />
    </CommentLayout>
  )
}
