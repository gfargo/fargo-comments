"use client"

import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { 
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_NORMAL,
} from "lexical"

interface KeyboardShortcutPluginProps {
  onSubmit: () => void
}

export function KeyboardShortcutPlugin({ onSubmit }: KeyboardShortcutPluginProps) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!event) return false
        
        const { ctrlKey, metaKey } = event as KeyboardEvent
        
        // Check for Cmd+Enter (macOS) or Ctrl+Enter (Windows/Linux)
        if (ctrlKey || metaKey) {
          event.preventDefault()
          onSubmit()
          return true
        }
        
        return false
      },
      COMMAND_PRIORITY_NORMAL
    )
  }, [editor, onSubmit])

  return null
}
