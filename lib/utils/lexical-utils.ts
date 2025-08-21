export interface ExtractedMention {
  id: string
  name: string
  email?: string
  trigger: "@" | "#"
  data?: any
}

export interface ExtractedTag {
  id: string
  label: string
  description?: string
  trigger: "@" | "#"
  data?: any
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
          id: node.data?.id || `${node.trigger}-${node.value}`,
          trigger: node.trigger,
          data: node.data || {},
        }

        if (node.trigger === "@") {
          mentions.push({
            ...extracted,
            name: node.value,
            email: node.data?.email,
            trigger: "@",
          })
        } else if (node.trigger === "#") {
          tags.push({
            ...extracted,
            label: node.value,
            description: node.data?.description,
            trigger: "#",
          })
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
