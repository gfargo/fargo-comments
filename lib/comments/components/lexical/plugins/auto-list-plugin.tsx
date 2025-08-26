"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { debug } from "@/lib/comments/utils/debug"
import { useEffect } from "react"
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { $getSelection, $isRangeSelection, KEY_SPACE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical"

export function AutoListPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    debug.log("AutoListPlugin initialized")

    return editor.registerCommand(
      KEY_SPACE_COMMAND,
      () => {
        debug.log("AutoListPlugin: Space key pressed")

        const selection = $getSelection()
        debug.log("AutoListPlugin: Selection:", selection)

        if (!$isRangeSelection(selection)) {
          debug.log("AutoListPlugin: Not a range selection, returning false")
          return false
        }

        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getTopLevelElementOrThrow()
        debug.log("AutoListPlugin: Element type:", element.getType())

        if (element.getType() !== "paragraph") {
          debug.log("AutoListPlugin: Not a paragraph, returning false")
          return false
        }

        const textContent = element.getTextContent()
        debug.log("AutoListPlugin: Text content:", JSON.stringify(textContent))

        // Check for bullet list pattern: exactly "-"
        if (textContent === "-") {
          debug.log("AutoListPlugin: Bullet list pattern detected, creating unordered list")
          editor.update(() => {
            // Clear the dash and dispatch command
            element.clear()
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          })
          return true
        }

        // Check for numbered list pattern: exactly "1.", "2.", etc.
        const numberedMatch = textContent.match(/^\d+\.$/)
        if (numberedMatch) {
          debug.log("AutoListPlugin: Numbered list pattern detected:", textContent)
          editor.update(() => {
            // Clear the numbered prefix and dispatch command
            element.clear()
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          })
          return true
        }

        debug.log("AutoListPlugin: No list pattern matched, returning false")
        return false
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}
