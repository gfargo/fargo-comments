export interface ExtractedMention {
  value: string
  [key: string]: any // Allow for dynamic properties from data object
}

export interface ExtractedTag {
  value: string
  [key: string]: any // Allow for dynamic properties from data object
}

export function extractMentionsAndTags(editorState: string): {
  mentions: ExtractedMention[]
  tags: ExtractedTag[]
} {
  try {
    const parsed = JSON.parse(editorState)
    const mentions: ExtractedMention[] = []
    const tags: ExtractedTag[] = []

    function traverseNodes(node: any) {
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
    console.error("[v0] Error extracting mentions/tags from editorState:", error)
    return { mentions: [], tags: [] }
  }
}
