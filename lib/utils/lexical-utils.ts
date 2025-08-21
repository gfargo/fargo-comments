export interface ExtractedMention {
  trigger: "@"
  value: string
  data: any
}

export interface ExtractedTag {
  trigger: "#"
  value: string
  data: any
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
        const extracted = {
          trigger: node.trigger,
          value: node.value,
          data: node.data || {},
        }

        if (node.trigger === "@") {
          mentions.push(extracted as ExtractedMention)
        } else if (node.trigger === "#") {
          tags.push(extracted as ExtractedTag)
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
