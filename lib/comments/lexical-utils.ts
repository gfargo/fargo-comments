import { debug } from "@/lib/comments/utils/debug"

export interface ExtractedMention {
  value: string
  [key: string]: string | number | boolean | undefined
}

export interface ExtractedTag {
  value: string
  [key: string]: string | number | boolean | undefined
}

interface LexicalNode {
  type: string
  value?: string
  data?: Record<string, unknown>
  trigger?: string
  children?: LexicalNode[]
}

export function extractMentionsAndTags(editorState: string): {
  mentions: ExtractedMention[]
  tags: ExtractedTag[]
} {
  try {
    const parsed: { root: LexicalNode } = JSON.parse(editorState)
    const mentions: ExtractedMention[] = []
    const tags: ExtractedTag[] = []

    function traverseNodes(node: LexicalNode) {
      if (node.type === "custom-beautifulMention") {
        const flattened = {
          value: node.value,
          ...(node.data || {}),
        }

        if (node.trigger === "@") {
          mentions.push(flattened as ExtractedMention)
        } else if (node.trigger === "#") {
          tags.push(flattened as ExtractedTag)
        }
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverseNodes)
      }
    }

    traverseNodes(parsed.root)
    return { mentions, tags }
  } catch (error) {
    debug.error("Error extracting mentions/tags from editorState:", error)
    return { mentions: [], tags: [] }
  }
}
