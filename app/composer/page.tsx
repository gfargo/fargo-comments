import type { Metadata } from "next"
import { CommentLayout } from "@/app/_demo/components/layout/comment-layout"
import ComposerPageContent from "../_demo/pages/composer-content"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Comment Composer",
  description: "Test the Lexical-based comment composer with mentions and tags functionality.",
}

export default function ComposerPage() {
  return (
    <CommentLayout
      title="Comment Composer"
      description="Test the Lexical-based comment composer with mentions and tags functionality"
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
      <ComposerPageContent />
    </CommentLayout>
  )
}
