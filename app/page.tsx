import type { Metadata } from "next";
import { CommentProvider } from "@/lib/comments/contexts/comment-context";
import { CommentLayout } from "@/app/_demo/components/layout/comment-layout";
import { currentUser } from "@/app/_demo/config/comment-data";
import MainPageContent from "./_demo/pages/main-page-content";

import { MessageSquareDot } from "lucide-react";

export const metadata: Metadata = {
  title: "Fargo Comments",
  description:
    "An open-source React commenting system with rich text editing, multiple design variants, and flexible storage adapters.",
};

export default function CommentSystemDemo() {
  return (
    <CommentProvider currentUser={currentUser}>
      <CommentLayout
        title={
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">Fargo</span>
            <span className="flex">Comments</span>
            <MessageSquareDot
              className="h-5 w-5"
              style={{ color: "#006511" }}
            />
          </div>
        }
        description="Open source React commenting system with rich text editing, multiple design variants, and flexible storage adapters"
      >
        <MainPageContent />
      </CommentLayout>
    </CommentProvider>
  );
}
