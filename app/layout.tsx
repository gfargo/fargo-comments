import type React from "react";
import type { Metadata } from "next";
import { QueryProvider } from "@/app/_demo/providers/query-provider";
import { MentionProvider } from "@/lib/contexts/mention-context";
import { CommentProvider } from "@/lib/contexts/comment-context";
import { mentionTags, mentionUsers } from "./_demo/config/mention-items";
import { currentUser } from "./_demo/config/comment-data";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Okayd Comments",
    template: "%s | Okayd Comments",
  },
  description:
    "An open-source React commenting system with rich text editing, multiple design variants, and flexible storage adapters.",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          <CommentProvider initialUser={currentUser}>
            <MentionProvider
              initialTags={mentionTags}
              initialUsers={mentionUsers}
            >
              {children}
            </MentionProvider>
          </CommentProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
