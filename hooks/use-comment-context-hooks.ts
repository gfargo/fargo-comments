"use client"

import { useState, useMemo, useCallback } from "react"
import type { CommentHooks, CommentHookRegistry, CommentHookContext } from "@/types/comment-hooks"
import type { User } from "@/types/comments"
import type { CommentConfig } from "@/hooks/use-comment-config"
import type { CommentState } from "@/lib/reducers/comment-reducer"
import type { CommentEventEmitter } from "@/lib/comment-events"

interface UseCommentContextHooksProps {
  initialHooks?: Partial<CommentHooks>
  currentUser: User | null
  config: CommentConfig
  state: CommentState
  events: CommentEventEmitter
}

export function useCommentContextHooks({
  initialHooks,
  currentUser,
  config,
  state,
  events,
}: UseCommentContextHooksProps) {
  const [registeredHooks, setRegisteredHooks] = useState<CommentHooks>(() => {
    const hooks: CommentHooks = {}
    if (initialHooks) {
      Object.entries(initialHooks).forEach(([key, callbacks]) => {
        if (callbacks) {
          hooks[key as keyof CommentHooks] = Array.isArray(callbacks) ? callbacks : [callbacks]
        }
      })
    }
    return hooks
  })

  const createHookContext = useCallback((): CommentHookContext => {
    return {
      currentUser,
      config,
      existingComments: state.comments,
    }
  }, [currentUser, config, state.comments])

  const hookRegistry: CommentHookRegistry = useMemo(
    () => ({
      registerHook: (hookName, callback) => {
        setRegisteredHooks((prev) => ({
          ...prev,
          [hookName]: [...(prev[hookName] || []), callback],
        }))
        return () => {
          setRegisteredHooks((prev) => ({
            ...prev,
            [hookName]: (prev[hookName] || []).filter((cb) => cb !== callback),
          }))
        }
      },
      unregisterHook: (hookName, callback) => {
        setRegisteredHooks((prev) => ({
          ...prev,
          [hookName]: (prev[hookName] || []).filter((cb) => cb !== callback),
        }))
      },
      executeHooks: async (hookName, data, context) => {
        const hooks = registeredHooks[hookName] || []
        let result = data

        for (const hook of hooks) {
          try {
            const hookResult = await hook(result, context)
            if (hookResult && typeof hookResult === "object") {
              result = { ...result, ...hookResult }
            }
          } catch (error) {
            console.error(`[v0] Hook ${hookName} failed:`, error)
            events.emit("error", {
              error: `Hook ${hookName} failed: ${error}`,
              action: "hook",
            })
          }
        }

        return result
      },
    }),
    [registeredHooks, events],
  )

  return {
    hookRegistry,
    createHookContext,
  }
}
