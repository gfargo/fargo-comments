import type React from "react"
import type { Metadata } from "next"
import { QueryProvider } from "@/components/providers/query-provider"
import { MentionProvider } from "@/contexts/mention-context"
import { CommentProvider } from "@/contexts/comment-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Okayd Comments",
  description: "",
  generator: "",
}

const defaultUser = {
  id: "default-user",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
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
          <CommentProvider initialUser={defaultUser}>
            <MentionProvider>{children}</MentionProvider>
          </CommentProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
