"use client"

import { useState, useCallback } from "react"

// Configuration interfaces for editor features
export interface EditorFeatures {
  lists?: boolean
  checkLists?: boolean
  autoLink?: boolean
  mentions?: boolean
  emoji?: boolean
  autoList?: boolean
}

export interface CommentConfig {
  editorFeatures?: EditorFeatures
  placeholder?: string
  variant?:
    | "card"
    | "bubble"
    | "timeline"
    | "compact"
    | "plain"
    | "social"
    | "professional"
    | "clean"
    | "thread"
    | "github"
    | "email"
    | "notion"
    | "mobile"
}

// Default configuration
const defaultConfig: CommentConfig = {
  editorFeatures: {
    lists: true,
    checkLists: true,
    autoLink: true,
    mentions: true,
    emoji: true,
    autoList: true,
  },
  placeholder: "Add a comment ...",
  variant: "compact",
}

export function useCommentConfig(initialConfig?: CommentConfig) {
  const [currentConfig, setCurrentConfig] = useState<CommentConfig>({
    ...defaultConfig,
    ...initialConfig,
    editorFeatures: {
      ...defaultConfig.editorFeatures,
      ...initialConfig?.editorFeatures,
    },
  })

  const updateConfig = useCallback((newConfig: Partial<CommentConfig>) => {
    console.log("updating config!!", newConfig)
    setCurrentConfig((prev) => ({
      ...prev,
      ...newConfig,
      editorFeatures: {
        ...prev.editorFeatures,
        ...newConfig.editorFeatures,
      },
    }))
  }, [])

  return {
    config: currentConfig,
    updateConfig,
  }
}
