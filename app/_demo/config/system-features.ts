import { LucideIcon } from "lucide-react"
import { 
  MessageSquare, 
  Database, 
  Palette, 
  Link, 
  GitBranch, 
  Search, 
  Edit3, 
  Settings 
} from "lucide-react"

export interface SystemFeature {
  title: string
  description: string
  icon: LucideIcon
  category: 'core' | 'architecture' | 'ui' | 'integration'
}

export const systemFeatures: SystemFeature[] = [
  {
    title: "Advanced Rich Text Editing",
    description: "Powered by Lexical with @mentions, #tags, auto-list creation, emoji search, and automatic URL/email detection. Centralized configuration ensures consistency across editing and read-only modes.",
    icon: Edit3,
    category: "core"
  },
  {
    title: "Flexible Storage Architecture",
    description: "Pluggable storage adapters support localStorage, REST APIs, server actions, and TanStack Query. Switch between storage backends without changing your components.",
    icon: Database,
    category: "architecture"
  },
  {
    title: "12+ Design Variants",
    description: "From card and bubble styles to timeline and GitHub variants - each with unique visual identity and user experience. Seamlessly switch between designs.",
    icon: Palette,
    category: "ui"
  },
  {
    title: "Generic Source Association",
    description: "Comments can be associated with any entity type using sourceId/sourceType patterns. Perfect for audits, projects, documents, or custom domain objects.",
    icon: Link,
    category: "integration"
  },
  {
    title: "Flat Thread Architecture",
    description: "Smart reply system with improved flat threading that prevents deep nesting while maintaining visual hierarchy and proper reply associations.",
    icon: GitBranch,
    category: "architecture"
  },
  {
    title: "Search & Storage Management",
    description: "Full-text comment search with filtering, adapter-based storage persistence, and easy data management tools for efficient content discovery.",
    icon: Search,
    category: "core"
  },
  {
    title: "Seamless Inline Editing",
    description: "Edit comments in-place with auto-clearing composers, save/cancel controls, and consistent UX across all variants without page reloads.",
    icon: MessageSquare,
    category: "ui"
  },
  {
    title: "Context-Aware Configuration",
    description: "Adaptive composer styling, variant-specific button configurations, and intelligent placeholder positioning with centralized Lexical configuration.",
    icon: Settings,
    category: "integration"
  }
]

export const featureCategories = {
  core: { name: "Core Features", color: "text-blue-600", bgColor: "bg-blue-50" },
  architecture: { name: "Architecture", color: "text-green-600", bgColor: "bg-green-50" },
  ui: { name: "User Interface", color: "text-purple-600", bgColor: "bg-purple-50" },
  integration: { name: "Integration", color: "text-orange-600", bgColor: "bg-orange-50" }
}
