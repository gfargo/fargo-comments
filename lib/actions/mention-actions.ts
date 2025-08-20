import { mentionUsers, mentionTags } from "../data/mention-items"

export async function getMentionUsers() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 444))
  return mentionUsers
}

export async function getMentionTags() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 444))
  return mentionTags
}
