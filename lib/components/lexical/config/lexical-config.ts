import { ListItemNode, ListNode } from "@lexical/list"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { createBeautifulMentionNode, type BeautifulMentionsTheme } from "lexical-beautiful-mentions"
import { CustomMentionComponent } from "../mention-component"

export const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

export const EMAIL_MATCHER =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/

export const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
      attributes: { rel: "noreferrer", target: "_blank" },
    }
  },
  (text: string) => {
    const match = EMAIL_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: `mailto:${fullMatch}`,
    }
  },
]

export function validateUrl(url: string): boolean {
  return url === "https://" || URL_MATCHER.test(url) || EMAIL_MATCHER.test(url)
}

export const lexicalTheme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "mb-1",
  link: "text-blue-600 hover:text-blue-800 underline cursor-pointer",
  list: {
    listitem: "mx-2",
    nested: {
      listitem: "mx-4",
    },
    olDepth: [
      "list-decimal ml-4 space-y-1",
      "list-decimal ml-6 space-y-1",
      "list-decimal ml-8 space-y-1",
      "list-decimal ml-10 space-y-1",
      "list-decimal ml-12 space-y-1",
    ],
    ul: "list-disc ml-4 space-y-1",
  },
  beautifulMentions: {
    "@": "mention-user",
    "#": "mention-tag",
  } as BeautifulMentionsTheme,
}

export const lexicalReadOnlyTheme = {
  ...lexicalTheme,
  list: {
    listitem: "my-2 ml-2",
    nested: {
      listitem: "my-1 ml-4",
    },
    olDepth: [
      "list-decimal ml-4 space-y-1",
      "list-[lower-alpha] ml-6 space-y-1",
      "list-[lower-roman] ml-8 space-y-1",
      "list-decimal ml-10 space-y-1",
      "list-[lower-alpha] ml-12 space-y-1",
    ],
    ul: "list-disc ml-4 space-y-1",
  },
}

export const lexicalNodes = [
  ...createBeautifulMentionNode(CustomMentionComponent),
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
]

export const mentionItems = {
  "@": [],
  "#": [],
}
