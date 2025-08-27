"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { debug } from "@/lib/comments/utils/debug"
import { BeautifulMentionsItem } from 'lexical-beautiful-mentions'

type MentionItemUser = BeautifulMentionsItem & {
  email?: string
  avatar?: string
  role?: string
}

type MentionItemTag = BeautifulMentionsItem & {
  description?: string
  type: "resource" | "rule" | "section" | "question"
  url?: string
}

type MentionItems = {
  "@": MentionItemUser[]
  "#": MentionItemTag[]
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
  initialUsers?: MentionItemUser[]
  initialTags?: MentionItemTag[]
  getUsersCallback?: () => Promise<MentionItemUser[]>
  getTagsCallback?: () => Promise<MentionItemTag[]>
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
      debug.log("Using provided initial mention data, skipping loadMentionItems")
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
      debug.log("Mention items loaded:", { userCount: users.length, tagCount: tags.length })
    } catch (err) {
      debug.error("Failed to load mention items:", err)
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

export type { MentionItemUser as MentionUser, MentionItemTag as MentionTag, MentionItems }
