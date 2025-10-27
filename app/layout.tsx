import type React from "react"
import type { Metadata } from "next"
import { QueryProvider } from "@/app/_demo/providers/query-provider"
import { ThemeProvider } from "@/app/_demo/providers/theme-provider"
import { MentionProvider } from "@/lib/comments/contexts/mention-context"
import { CommentProvider } from "@/lib/comments/contexts/comment-context"
import { mentionTags, mentionUsers } from "./_demo/config/mention-items"
import { currentUser } from "./_demo/config/comment-data"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { GlobalErrorTracker } from "@/app/_demo/components/global-error-tracker"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Fargo Comments",
    template: "%s | Fargo Comments",
  },
  description:
    "An open-source React commenting system with rich text editing, multiple design variants, and flexible storage adapters.",,
  // generator: "Next.js",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <GlobalErrorTracker />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <CommentProvider currentUser={currentUser}>
              <MentionProvider initialTags={mentionTags} initialUsers={mentionUsers}>
                {children}
              </MentionProvider>
            </CommentProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
