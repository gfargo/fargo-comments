"use client"

import { useEffect } from "react"
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { BeautifulMentionsPlugin } from "lexical-beautiful-mentions"
import { lexicalReadOnlyTheme, lexicalNodes, mentionItems, validateUrl } from "./config/lexical-config"

export { validateUrl }

interface LexicalReadOnlyRendererProps {
  editorState?: string
  content: string
  className?: string
}

function EditorStateLoader({ editorState, content }: { editorState?: string; content: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (editorState) {
      try {
        const parsedState = JSON.parse(editorState)
        editor.update(() => {
          const newEditorState = editor.parseEditorState(parsedState)
          editor.setEditorState(newEditorState)
        })
      } catch (error) {
        console.error("[OKAYD] Failed to parse editor state:", error)
        editor.update(() => {
          const root = $getRoot()
          root.clear()
          const paragraph = $createParagraphNode()
          paragraph.append($createTextNode(content))
          root.append(paragraph)
        })
      }
    } else {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
        const paragraph = $createParagraphNode()
        paragraph.append($createTextNode(content))
        root.append(paragraph)
      })
    }
  }, [editor, editorState, content])

  return null
}

export function LexicalReadOnlyRenderer({ editorState, content, className = "" }: LexicalReadOnlyRendererProps) {
  const initialConfig = {
    namespace: "ReadOnlyRenderer",
    editable: false,
    theme: lexicalReadOnlyTheme,
    nodes: lexicalNodes,
    onError: (error: Error) => {
      console.error("[OKAYD] Lexical read-only renderer error:", error)
    },
  }

  return (
    <div className={`lexical-read-only ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="lexical-content-editable outline-none resize-none overflow-hidden" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <BeautifulMentionsPlugin items={mentionItems} menuComponent={() => null} menuItemComponent={() => null} />
        <EditorStateLoader editorState={editorState} content={content} />
      </LexicalComposer>
    </div>
  )
}

export default LexicalReadOnlyRenderer
