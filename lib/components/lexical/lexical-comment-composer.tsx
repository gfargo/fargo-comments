"use client"

import { forwardRef, useEffect, useState, useRef } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical"
import {
  BeautifulMentionsPlugin,
  type BeautifulMentionsMenuProps,
  type BeautifulMentionsMenuItemProps,
} from "lexical-beautiful-mentions"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Send, User, Hash, FileText, BookOpen, Tag, HelpCircle } from "lucide-react"
import { AutoListPlugin } from "./plugins/auto-list-plugin"
import { EmojiPlugin } from "./plugins/emoji-plugin"
import { KeyboardShortcutPlugin } from "./plugins/keyboard-shortcut-plugin"
import { FocusManagementPlugin } from "./plugins/focus-management-plugin"
import {
  getContainerStyles,
  getContentEditableStyles,
  getPlaceholderPosition,
  getButtonConfig,
  type CommentVariant,
} from "./utils/style-utils"
import { useMentions } from "@/lib/contexts/mention-context"
import { useComments } from "@/lib/contexts/comment-context"
import { lexicalTheme, lexicalNodes, MATCHERS } from "./config/lexical-config"

const CustomMenu = forwardRef<HTMLUListElement, BeautifulMentionsMenuProps>(({ open, loading, ...props }, ref) => (
  <ul
    className="absolute z-50 mt-1 max-h-60 w-72 overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    {...props}
    ref={ref}
  />
))

const CustomMenuItem = forwardRef<HTMLLIElement, BeautifulMentionsMenuItemProps>(
  ({ selected, item, itemValue, ...props }, ref) => {
    const getIcon = () => {
      if (item.trigger === "@") return <User className="w-4 h-4 text-blue-600" />
      if (item.trigger === "#") {
        if (!item.value) return <Tag className="w-4 h-4 text-gray-600" />
        if (item.value.startsWith("question")) return <FileText className="w-4 h-4 text-green-600" />
        if (item.value.startsWith("rule")) return <BookOpen className="w-4 h-4 text-purple-600" />
        if (item.value.startsWith("section")) return <Hash className="w-4 h-4 text-orange-600" />
        return <Tag className="w-4 h-4 text-gray-600" />
      }
      return null
    }

    return (
      <li
        className={`relative cursor-pointer select-none py-2 px-3 ${
          selected ? "bg-blue-50 text-blue-900" : "text-gray-900"
        } hover:bg-gray-50`}
        {...props}
        ref={ref}
      >
        <div className="flex items-center gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{item.value}</div>
            {item.data?.email && <div className="text-sm text-gray-500 truncate">{item.data.email}</div>}
            {item.data?.description && <div className="text-sm text-gray-500 truncate">{item.data.description}</div>}
          </div>
        </div>
      </li>
    )
  },
)

function ContentExtractor({
  onContentChange,
  onEditorStateChange,
  initialContent,
  initialEditorState,
}: {
  onContentChange: (content: string) => void
  onEditorStateChange: (editorState: string) => void
  initialContent?: string
  initialEditorState?: string
}) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (initialEditorState && initialEditorState.trim()) {
      editor.update(() => {
        try {
          const editorState = editor.parseEditorState(initialEditorState)
          editor.setEditorState(editorState)
        } catch (error) {
          console.error("[OKAYD] Failed to parse editor state:", error)
          if (initialContent && initialContent.trim()) {
            const root = $getRoot()
            root.clear()
            const paragraph = $createParagraphNode()
            const textNode = $createTextNode(initialContent)
            paragraph.append(textNode)
            root.append(paragraph)
          }
        }
      })
    } else if (initialContent && initialContent.trim()) {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
        const paragraph = $createParagraphNode()
        const textNode = $createTextNode(initialContent)
        paragraph.append(textNode)
        root.append(paragraph)
      })
    }
  }, [editor, initialContent, initialEditorState])

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot()
        const textContent = root.getTextContent()
        onContentChange(textContent)
      })

      const editorStateJSON = JSON.stringify(editorState.toJSON())
      onEditorStateChange(editorStateJSON)
    })

    return removeListener
  }, [editor, onContentChange, onEditorStateChange])

  return null
}

interface LexicalCommentComposerProps {
  variant?: CommentVariant
  placeholder?: string
  onSubmit?: (content: string, editorState: string, mentions: any[], tags: any[]) => void
  className?: string
  initialContent?: string
  initialEditorState?: string
}

export function LexicalCommentComposer({
  variant = "default",
  placeholder,
  onSubmit,
  className = "",
  initialContent = "",
  initialEditorState = "",
}: LexicalCommentComposerProps) {
  const [currentContent, setCurrentContent] = useState("")
  const [currentEditorState, setCurrentEditorState] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const { mentionItems, loading: mentionLoading, error: mentionError } = useMentions()
  const { config } = useComments()

  const effectiveVariant = variant || config.variant || "default"
  const effectivePlaceholder = placeholder || config.placeholder || "Add a comment..."
  const features = config.editorFeatures || {}

  const initialConfig = {
    namespace: "CommentEditor",
    theme: lexicalTheme,
    nodes: lexicalNodes,
    onError: (error: Error) => {
      console.error("Lexical error:", error)
    },
  }

  const handleSubmit = () => {
    if (onSubmit && currentContent.trim()) {
      onSubmit(currentContent.trim(), currentEditorState, [], [])

      if (!initialContent && !initialEditorState) {
        setCurrentContent("")
        setCurrentEditorState("")
      }
    }
  }

  const buttonConfig = getButtonConfig(effectiveVariant)

  return (
    <div className={`relative ${getContainerStyles(effectiveVariant)} ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={getContentEditableStyles(effectiveVariant)}
                aria-placeholder={effectivePlaceholder}
                placeholder={
                  <div
                    className={`absolute ${getPlaceholderPosition(effectiveVariant)} text-gray-400 pointer-events-none select-none`}
                  >
                    {effectivePlaceholder}
                  </div>
                }
              />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          {features.lists !== false && <ListPlugin />}
          {features.checkLists !== false && <CheckListPlugin />}
          {features.mentions !== false && !mentionLoading && !mentionError && (
            <BeautifulMentionsPlugin
              items={mentionItems}
              menuComponent={CustomMenu}
              menuItemComponent={CustomMenuItem}
            />
          )}
          <ContentExtractor
            onContentChange={setCurrentContent}
            onEditorStateChange={setCurrentEditorState}
            initialContent={initialContent}
            initialEditorState={initialEditorState}
          />
        </div>
        {effectiveVariant !== "inline" && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <TooltipProvider>
              <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-1 text-gray-500 hover:text-gray-700"
                    onTouchStart={() => setShowTooltip(true)}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      setTimeout(() => setShowTooltip(false), 3000)
                    }}
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-xs">
                  <div className="text-sm">
                    <p className="font-medium mb-2">Start typing...</p>
                    <ul className="space-y-1 text-xs">
                      {features.mentions !== false && (
                        <>
                          <li>• @ to mention users</li>
                          <li>• # to reference resources</li>
                        </>
                      )}
                      {features.lists !== false && (
                        <>
                          <li>• - for bullet lists</li>
                          <li>• 1. for numbered lists</li>
                        </>
                      )}
                      {features.autoLink !== false && <li>• URLs will auto-link</li>}
                      {features.emoji !== false && <li>• : for emojis</li>}
                    </ul>
                    {mentionLoading && <p className="text-xs text-amber-600 mt-2">Loading mentions...</p>}
                    {mentionError && <p className="text-xs text-red-600 mt-2">Mention loading failed</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              ref={submitButtonRef}
              onClick={handleSubmit}
              size={buttonConfig.size}
              className={`flex items-center gap-2 ${buttonConfig.className || ""}`}
              disabled={!currentContent.trim()}
            >
              {buttonConfig.showIcon && <Send className="w-4 h-4" />}
              {buttonConfig.showText && buttonConfig.text}
            </Button>
          </div>
        )}
        {features.autoList !== false && <AutoListPlugin />}
        {features.autoLink !== false && <AutoLinkPlugin matchers={MATCHERS} />}
        {features.emoji !== false && <EmojiPlugin />}
        <KeyboardShortcutPlugin onSubmit={handleSubmit} />
        <FocusManagementPlugin submitButtonRef={submitButtonRef} />
      </LexicalComposer>
    </div>
  )
}

export default LexicalCommentComposer
