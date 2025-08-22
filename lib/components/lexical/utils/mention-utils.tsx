import { User, Hash, FileText, BookOpen, Tag } from "lucide-react"

export const getIcon = (trigger: string, value: string) => {
  if (trigger === "@") return <User className="w-3 h-3" />
  if (trigger === "#") {
    if (value.startsWith("question")) return <FileText className="w-3 h-3" />
    if (value.startsWith("rule")) return <BookOpen className="w-3 h-3" />
    if (value.startsWith("section")) return <Hash className="w-3 h-3" />
    return <Tag className="w-3 h-3" />
  }
  return null
}

export const getStyles = (trigger: string) => {
  if (trigger === "@") {
    return "inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
  }
  return "inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
}

export const generateResourceUrl = (value: string): string => {
  if (value.startsWith("question")) {
    return `/audit/questions/${value}`
  } else if (value.startsWith("rule")) {
    return `/audit/rules/${value}`
  } else if (value.startsWith("section")) {
    return `/audit/sections/${value}`
  }
  return `/audit/resources/${value}`
}
