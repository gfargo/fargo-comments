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
  hideToast?: boolean
  debug?: boolean
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
  hideToast: false,
  debug: false,
  editorFeatures: {
    lists: true,
    checkLists: true,
    autoLink: true,
    mentions: true,
    emoji: true,
    autoList: true,
  },
  placeholder: "Add a comment ...",
  variant: "card",
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

// Debug logging utility
export function createDebugLogger(config: CommentConfig) {
  return {
    log: (...args: any[]) => {
      if (config.debug) {
        console.log("[FARGO]", ...args)
      }
    },
    error: (...args: any[]) => {
      if (config.debug) {
        console.error("[FARGO]", ...args)
      }
    },
    warn: (...args: any[]) => {
      if (config.debug) {
        console.warn("[FARGO]", ...args)
      }
    }
  }
}
