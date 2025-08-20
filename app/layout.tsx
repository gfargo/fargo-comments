import type React from "react"
import type { Metadata } from "next"
import { QueryProvider } from "@/components/providers/query-provider"
import { MentionProvider } from "@/contexts/mention-context"
import { CommentProvider } from "@/contexts/comment-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          <CommentProvider>
            <MentionProvider>{children}</MentionProvider>
          </CommentProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
