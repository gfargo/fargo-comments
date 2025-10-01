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
            <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Fargo</span>
            <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Comments</span>
            <MessageSquareDot className="h-8 w-8 text-primary" />
          </div>
        }
        description="Open source React commenting system with rich text editing, multiple design variants, and flexible storage adapters"
      >
        <MainPageContent />
      </CommentLayout>
    </CommentProvider>
  );
}
