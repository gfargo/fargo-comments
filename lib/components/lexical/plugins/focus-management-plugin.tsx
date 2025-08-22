"use client"

import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { 
  KEY_TAB_COMMAND,
  COMMAND_PRIORITY_HIGH,
} from "lexical"

interface FocusManagementPluginProps {
  submitButtonRef: React.RefObject<HTMLButtonElement | null>
}

export function FocusManagementPlugin({ submitButtonRef }: FocusManagementPluginProps) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (event) => {
        if (!event) return false
        
        const { shiftKey } = event as KeyboardEvent
        
        // If Tab (without Shift) is pressed, focus the submit button
        if (!shiftKey) {
          event.preventDefault()
          submitButtonRef.current?.focus()
          return true
        }
        
        // Let Shift+Tab work normally
        return false
      },
      COMMAND_PRIORITY_HIGH
    )
  }, [editor, submitButtonRef])

  return null
}
