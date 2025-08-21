"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface MentionUser {
  id: string
  value: string
  email?: string
  avatar?: string
  role?: string
}

interface MentionTag {
  id: string
  value: string
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
  getUsersCallback?: () => Promise<MentionUser[]>
  getTagsCallback?: () => Promise<MentionTag[]>
}

export function MentionProvider({ children, initialUsers, initialTags, getUsersCallback, getTagsCallback }: MentionProviderProps) {
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
        initialUsers ? Promise.resolve(initialUsers) : getUsersCallback ? getUsersCallback() : Promise.resolve([]),
        initialTags ? Promise.resolve(initialTags) : getTagsCallback ? getTagsCallback() : Promise.resolve([]),
      ])

      setMentionItems({ "@": users, "#": tags })
      console.log("[v0] Mention items loaded:", { userCount: users.length, tagCount: tags.length })
    } catch (err) {
      console.error("[v0] Failed to load mention items:", err)
      setError("Failed to load mention data")
    } finally {
      setLoading(false)
    }
  }, [initialUsers, initialTags, getUsersCallback, getTagsCallback])

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
