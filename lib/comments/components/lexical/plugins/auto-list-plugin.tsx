"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { $getSelection, $isRangeSelection, KEY_SPACE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical"

export function AutoListPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    console.log("[OKAYD] AutoListPlugin initialized")

    return editor.registerCommand(
      KEY_SPACE_COMMAND,
      () => {
        console.log("[OKAYD] AutoListPlugin: Space key pressed")

        const selection = $getSelection()
        console.log("[OKAYD] AutoListPlugin: Selection:", selection)

        if (!$isRangeSelection(selection)) {
          console.log("[OKAYD] AutoListPlugin: Not a range selection, returning false")
          return false
        }

        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getTopLevelElementOrThrow()
        console.log("[OKAYD] AutoListPlugin: Element type:", element.getType())

        if (element.getType() !== "paragraph") {
          console.log("[OKAYD] AutoListPlugin: Not a paragraph, returning false")
          return false
        }

        const textContent = element.getTextContent()
        console.log("[OKAYD] AutoListPlugin: Text content:", JSON.stringify(textContent))

        // Check for bullet list pattern: exactly "-"
        if (textContent === "-") {
          console.log("[OKAYD] AutoListPlugin: Bullet list pattern detected, creating unordered list")
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
          console.log("[OKAYD] AutoListPlugin: Numbered list pattern detected:", textContent)
          editor.update(() => {
            // Clear the numbered prefix and dispatch command
            element.clear()
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          })
          return true
        }

        console.log("[OKAYD] AutoListPlugin: No list pattern matched, returning false")
        return false
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}
