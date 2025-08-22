import type { Metadata } from "next"
import { CommentLayout } from "@/app/_demo/components/layout/comment-layout"
import ComposerPageContent from "../_demo/pages/composer-content"

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
      <ComposerPageContent />
    </CommentLayout>
  )
}