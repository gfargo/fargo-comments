import type { Metadata } from "next";
import { CommentProvider } from "@/lib/contexts/comment-context";
import { CommentLayout } from "@/app/_demo/components/layout/comment-layout";
import { currentUser } from "@/app/_demo/config/comment-data";
import MainPageContent from "./_demo/pages/main-page-content";
import Image from "next/image";
import { MessageSquareDot } from "lucide-react";

export const metadata: Metadata = {
  title: "Okayd Comments",
  description:
    "An open-source React commenting system with rich text editing, multiple design variants, and flexible storage adapters.",
};

export default function CommentSystemDemo() {
  return (
    <CommentProvider initialUser={currentUser}>
      <CommentLayout
        title={
          <div className="flex items-baseline gap-2">
            <Image
              src="/okayd-logo.png"
              alt="Okayd"
              width={107}
              height={32}
              className="h-8 w-auto"
            />
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
