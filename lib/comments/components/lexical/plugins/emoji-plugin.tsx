"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  $getSelection,
  $isRangeSelection,
  type TextNode,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from "lexical";
import data from "@emoji-mart/data";
import { init, SearchIndex } from "emoji-mart";

// Initialize emoji-mart data with proper configuration
let emojiMartInitialized = false;

const initializeEmojiMart = () => {
  if (!emojiMartInitialized) {
    try {
      init({ data });
      emojiMartInitialized = true;
      console.log("[OKAYD] EmojiMart initialized successfully");
    } catch (error) {
      console.error("[OKAYD] EmojiMart initialization failed:", error);
    }
  }
};

interface EmojiPluginProps {
  className?: string;
}

interface EmojiResult {
  id: string;
  name: string;
  native: string;
  keywords: string[];
}

export function EmojiPlugin({ className = "" }: EmojiPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emojiResults, setEmojiResults] = useState<EmojiResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [resultsPosition, setResultsPosition] = useState({ top: 0, left: 0 });
  const [triggerNode, setTriggerNode] = useState<TextNode | null>(null);
  const [triggerOffset, setTriggerOffset] = useState<number>(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchEmojis = useMemo(
    () => async (query: string) => {
      if (!query.trim()) {
        setEmojiResults([]);
        return;
      }

      // Ensure emoji-mart is initialized
      initializeEmojiMart();

      try {
        const results = await SearchIndex.search(query);
        console.log("[OKAYD] Raw emoji search results:", results?.slice(0, 2));
        
        if (!results || results.length === 0) {
          setEmojiResults([]);
          return;
        }
        
        const emojiResults = results.slice(0, 8).map((emoji: any) => {
          // Handle different possible data structures from emoji-mart
          let native = emoji.native;
          
          // Fallback methods to get the native emoji
          if (!native && emoji.skins?.[0]?.native) {
            native = emoji.skins[0].native;
          } else if (!native && emoji.unified) {
            try {
              native = String.fromCodePoint(...emoji.unified.split('-').map((u: string) => parseInt(u, 16)));
            } catch (e) {
              console.log("[OKAYD] Failed to convert unified to native:", emoji.unified, e);
              native = '❓';
            }
          } else if (!native) {
            native = '❓';
          }
          
          return {
            id: emoji.id,
            name: emoji.name || emoji.id,
            native: native,
            keywords: emoji.keywords || [],
          };
        });
        
        console.log("[OKAYD] Processed emoji results:", emojiResults.slice(0, 2));
        setEmojiResults(emojiResults);
        setSelectedIndex(0);
      } catch (error) {
        console.log("[OKAYD] Emoji search error:", error);
        setEmojiResults([]);
      }
    },
    []
  );

  const updateResultsPosition = useCallback(() => {
    try {
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Find the closest editor container (handles reply/edit contexts)
        const editorElement = editor.getRootElement();
        let containerElement = editorElement;

        // Look for the closest positioned container (for reply/edit modals)
        let parent = editorElement?.parentElement;
        while (parent && parent !== document.body) {
          const style = window.getComputedStyle(parent);
          if (
            style.position === "relative" ||
            style.position === "absolute" ||
            style.position === "fixed"
          ) {
            containerElement = parent;
            break;
          }
          parent = parent.parentElement;
        }

        const containerRect = containerElement?.getBoundingClientRect();

        if (containerRect) {
          // Position relative to the container for better accuracy in different contexts
          setResultsPosition({
            top: rect.bottom - containerRect.top + 5,
            left: Math.max(rect.left - containerRect.left, 0),
          });
          console.log("[OKAYD] EmojiPlugin: Position updated", {
            top: rect.bottom - containerRect.top + 5,
            left: Math.max(rect.left - containerRect.left, 0),
          });
        } else {
          // Fallback to viewport positioning
          setResultsPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
          });
        }
      }
    } catch (error) {
      console.log("[OKAYD] Position calculation error:", error);
    }
  }, [editor]);

  // const handleEmojiSelect = useCallback((emoji: EmojiResult) => {
  //   console.log("[OKAYD] EmojiPlugin: Emoji selected:", emoji.native)

  //   editor.update(() => {
  //     if (triggerNode && typeof triggerOffset === "number") {
  //       try {
  //         const textContent = triggerNode.getTextContent()
  //         const selection = $getSelection()

  //         if ($isRangeSelection(selection) && selection.isCollapsed()) {
  //           const currentOffset = selection.anchor.offset
  //           const beforeTrigger = textContent.substring(0, triggerOffset)
  //           const afterSearch = textContent.substring(currentOffset)
  //           const newText = beforeTrigger + emoji.native + afterSearch

  //           triggerNode.setTextContent(newText)

  //           // Move cursor after the emoji
  //           const newOffset = triggerOffset + emoji.native.length
  //           selection.anchor.set(triggerNode.getKey(), newOffset, "text")
  //           selection.focus.set(triggerNode.getKey(), newOffset, "text")

  //           console.log("[OKAYD] EmojiPlugin: Emoji inserted successfully")
  //         }
  //       } catch (error) {
  //         console.log("[OKAYD] Emoji insertion error:", error)
  //       }
  //     }
  //   })

  //   setShowResults(false)
  //   setSearchQuery("")
  //   setTriggerNode(null)
  //   setTimeout(() => editor.focus(), 10)
  // }, [editor, triggerNode, triggerOffset])

  const handleEmojiSelect = (emoji: EmojiResult) => {
    console.log("[OKAYD] EmojiPlugin: Emoji selected:", emoji);

    if (!emoji.native) {
      console.error("[OKAYD] EmojiPlugin: No native emoji found:", emoji);
      setShowResults(false);
      setSearchQuery("");
      setTriggerNode(null);
      return;
    }

    editor.update(() => {
      if (triggerNode && typeof triggerOffset === "number") {
        try {
          const textContent = triggerNode.getTextContent();
          const selection = $getSelection();

          if ($isRangeSelection(selection) && selection.isCollapsed()) {
            const currentOffset = selection.anchor.offset;
            const beforeTrigger = textContent.substring(0, triggerOffset);
            const afterSearch = textContent.substring(currentOffset);
            const newText = beforeTrigger + emoji.native + afterSearch;

            triggerNode.setTextContent(newText);

            // Move cursor after the emoji
            const newOffset = triggerOffset + emoji.native.length;
            selection.anchor.set(triggerNode.getKey(), newOffset, "text");
            selection.focus.set(triggerNode.getKey(), newOffset, "text");

            console.log("[OKAYD] EmojiPlugin: Emoji inserted successfully");
          }
        } catch (error) {
          console.log("[OKAYD] Emoji insertion error:", error);
        }
      }
    });

    setShowResults(false);
    setSearchQuery("");
    setTriggerNode(null);
    setTimeout(() => editor.focus(), 10);
  };

  const keyDownHandler = useMemo(
    () => (event: KeyboardEvent) => {
      if (showResults) {
        // Handle navigation within results
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, emojiResults.length - 1)
          );
          return true;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          return true;
        }
        if (event.key === "Enter") {
          event.preventDefault();
          if (emojiResults[selectedIndex]) {
            handleEmojiSelect(emojiResults[selectedIndex]);
          }
          return true;
        }
        if (event.key === "Escape") {
          setShowResults(false);
          setSearchQuery("");
          setTriggerNode(null);
          return true;
        }
        if (event.key === "Backspace") {
          setTimeout(() => {
            try {
              editor.getEditorState().read(() => {
                if (!triggerNode) return;

                const textContent = triggerNode.getTextContent();
                const colonIndex = triggerOffset;
                const selection = $getSelection();

                if ($isRangeSelection(selection) && selection.isCollapsed()) {
                  const currentOffset = selection.anchor.offset;

                  // If cursor is at or before the colon, close the picker
                  if (currentOffset <= colonIndex + 1) {
                    setShowResults(false);
                    setSearchQuery("");
                    setTriggerNode(null);
                    return;
                  }

                  const searchText = textContent.substring(
                    colonIndex + 1,
                    currentOffset
                  );
                  setSearchQuery(searchText);
                  searchEmojis(searchText);
                }
              });
            } catch (error) {
              console.log("[OKAYD] Backspace handling error:", error);
              // Close picker on error to prevent stuck state
              setShowResults(false);
              setSearchQuery("");
              setTriggerNode(null);
            }
          }, 10);
          return false; // Allow backspace to proceed normally
        }
      }

      if (event.key === ":") {
        console.log(
          "[OKAYD] EmojiPlugin: Colon detected, starting search mode..."
        );

        setTimeout(() => {
          try {
            editor.getEditorState().read(() => {
              const selection = $getSelection();
              if (!$isRangeSelection(selection) || !selection.isCollapsed())
                return;

              const anchorNode = selection.anchor.getNode();
              const anchorOffset = selection.anchor.offset;

              if (anchorNode.getType() === "text" && anchorOffset > 0) {
                const textNode = anchorNode as TextNode;
                const textContent = textNode.getTextContent();
                const charBeforeCursor = textContent[anchorOffset - 1];

                if (charBeforeCursor === ":") {
                  console.log("[OKAYD] EmojiPlugin: Starting emoji search");
                  setTriggerNode(textNode);
                  setTriggerOffset(anchorOffset - 1);
                  setSearchQuery("");
                  setShowResults(true);
                  updateResultsPosition();
                }
              }
            });
          } catch (error) {
            console.log("[OKAYD] Colon detection error:", error);
          }
        }, 10);
      }

      if (
        showResults &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        event.key !== ":"
      ) {
        setTimeout(() => {
          try {
            editor.getEditorState().read(() => {
              if (!triggerNode) return;

              const textContent = triggerNode.getTextContent();
              const colonIndex = triggerOffset;
              const selection = $getSelection();

              if ($isRangeSelection(selection) && selection.isCollapsed()) {
                const currentOffset = selection.anchor.offset;
                const searchText = textContent.substring(
                  colonIndex + 1,
                  currentOffset
                );
                console.log(
                  "[OKAYD] EmojiPlugin: Search query updated:",
                  searchText
                );
                setSearchQuery(searchText);
                searchEmojis(searchText);
              }
            });
          } catch (error) {
            console.log("[OKAYD] Search update error:", error);
            // Close picker on error to prevent stuck state
            setShowResults(false);
            setSearchQuery("");
            setTriggerNode(null);
          }
        }, 10);
      }

      return false;
    },
    [
      showResults,
      emojiResults,
      selectedIndex,
      triggerNode,
      triggerOffset,
      searchEmojis,
      updateResultsPosition,
      editor,
      handleEmojiSelect,
    ]
  );

  useEffect(() => {
    console.log("[OKAYD] EmojiPlugin initialized");
    
    // Initialize emoji-mart when component mounts
    initializeEmojiMart();

    const removeKeyListener = editor.registerCommand(
      KEY_DOWN_COMMAND,
      keyDownHandler,
      COMMAND_PRIORITY_LOW
    );

    return removeKeyListener;
  }, [editor, keyDownHandler]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setSearchQuery("");
        setTriggerNode(null);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showResults]);

  if (!showResults || emojiResults.length === 0) {
    return null;
  }

  return (
    <div
      ref={resultsRef}
      className={`absolute z-50 ${className}`}
      style={{
        top: resultsPosition.top,
        left: resultsPosition.left,
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[200px] max-w-[300px]">
        <div className="p-2 text-xs text-gray-500 border-b">
          {searchQuery
            ? `Search: "${searchQuery}"`
            : "Type to search emojis..."}
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {emojiResults.map((emoji, index) => (
            <div
              key={emoji.id}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                index === selectedIndex
                  ? "bg-blue-50 border-l-2 border-blue-500"
                  : ""
              }`}
              onClick={() => handleEmojiSelect(emoji)}
            >
              <span className="text-lg">{emoji.native || '❓'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {emoji.name}
                </div>
                {emoji.keywords.length > 0 && (
                  <div className="text-xs text-gray-500 truncate">
                    {emoji.keywords.slice(0, 3).join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 text-xs text-gray-400 border-t">
          ↑↓ navigate • Enter select • Esc cancel
        </div>
      </div>
    </div>
  );
}

export default EmojiPlugin;
