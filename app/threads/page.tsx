import type { Metadata } from "next"
import { CommentLayout } from "@/app/_demo/components/layout/comment-layout"
import ThreadsPageContent from "../_demo/pages/threads-content"

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
      <ThreadsPageContent />
    </CommentLayout>
  )
}