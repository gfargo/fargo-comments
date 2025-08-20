import type React from "react"
import type { Metadata } from "next"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MentionProvider } from "@/contexts/mention-context"
import { CommentProvider } from "@/contexts/comment-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <CommentProvider>
            <MentionProvider>{children}</MentionProvider>
          </CommentProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
