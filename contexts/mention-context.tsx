"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getMentionUsers, getMentionTags } from "@/lib/actions/mention-actions"

interface MentionUser {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: string
}

interface MentionTag {
  id: string
  label: string
  description?: string
  type: "resource" | "rule" | "section" | "question"
  url?: string
}

interface MentionItems {
  "@": MentionUser[]
  "#": MentionTag[]
}

interface MentionContextType {
  mentionItems: MentionItems
  loading: boolean
  error: string | null
  refreshMentions: () => Promise<void>
}

const MentionContext = createContext<MentionContextType | undefined>(undefined)

interface MentionProviderProps {
  children: React.ReactNode
  initialUsers?: MentionUser[]
  initialTags?: MentionTag[]
}

export function MentionProvider({ children, initialUsers, initialTags }: MentionProviderProps) {
  const [mentionItems, setMentionItems] = useState<MentionItems>({
    "@": initialUsers || [],
    "#": initialTags || [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMentionItems = useCallback(async () => {
    if (initialUsers && initialTags) {
      console.log("[v0] Using provided initial mention data, skipping loadMentionItems")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [users, tags] = await Promise.all([
        initialUsers ? Promise.resolve(initialUsers) : getMentionUsers(),
        initialTags ? Promise.resolve(initialTags) : getMentionTags(),
      ])

      setMentionItems({ "@": users, "#": tags })
      console.log("[v0] Mention items loaded:", { userCount: users.length, tagCount: tags.length })
    } catch (err) {
      console.error("[v0] Failed to load mention items:", err)
      setError("Failed to load mention data")
    } finally {
      setLoading(false)
    }
  }, [initialUsers, initialTags])

  useEffect(() => {
    loadMentionItems()
  }, [loadMentionItems])

  const refreshMentions = useCallback(async () => {
    await loadMentionItems()
  }, [loadMentionItems])

  const contextValue: MentionContextType = {
    mentionItems,
    loading,
    error,
    refreshMentions,
  }

  return <MentionContext.Provider value={contextValue}>{children}</MentionContext.Provider>
}

export function useMentions() {
  const context = useContext(MentionContext)
  if (context === undefined) {
    throw new Error("useMentions must be used within a MentionProvider")
  }
  return context
}

export type { MentionUser, MentionTag, MentionItems }
