import { LucideIcon } from "lucide-react"
import { 
  GitBranch, 
  CheckCircle, 
  Flag, 
  Users,
  MessageSquare,
  Clock,
  Target,
  Layers
} from "lucide-react"

export interface ThreadFeature {
  title: string
  description: string
  icon: LucideIcon
  category: 'visual' | 'workflow' | 'collaboration' | 'organization'
  status?: 'available' | 'under-development' | 'coming-soon'
}

export const threadFeatures: ThreadFeature[] = [
  {
    title: "Visual Hierarchy",
    description: "Clear parent-child relationships with proper indentation and visual connections between replies and their parent comments.",
    icon: GitBranch,
    category: "visual"
  },
  {
    title: "Status Tracking",
    description: "Comments can have different statuses (open, in-progress, resolved) with visual indicators and color coding.",
    icon: CheckCircle,
    category: "workflow",
    status: "under-development"
  },
  {
    title: "Priority Levels",
    description: "High, medium, and low priority indicators help teams focus on the most important discussions first.",
    icon: Flag,
    category: "organization",
    status: "under-development"
  },
  {
    title: "Multi-Participant",
    description: "Support for multiple team members with role-based styling and clear authorship identification.",
    icon: Users,
    category: "collaboration"
  },
  {
    title: "Thread Branching",
    description: "Flat thread architecture prevents deep nesting while maintaining clear conversation flow and reply relationships.",
    icon: Layers,
    category: "visual"
  },
  {
    title: "Conversation Context",
    description: "Maintain context across long discussions with smart reply threading and participant tracking.",
    icon: MessageSquare,
    category: "collaboration"
  },
  {
    title: "Timeline Tracking",
    description: "Chronological ordering with timestamps and activity indicators for complete conversation history.",
    icon: Clock,
    category: "organization"
  },
  {
    title: "Focus Management",
    description: "Highlight active discussions and filter by status or priority to manage team attention effectively.",
    icon: Target,
    category: "workflow"
  }
]

export const threadFeatureCategories = {
  visual: { name: "Visual Design", color: "text-purple-600", bgColor: "bg-purple-50" },
  workflow: { name: "Workflow", color: "text-blue-600", bgColor: "bg-blue-50" },
  collaboration: { name: "Collaboration", color: "text-green-600", bgColor: "bg-green-50" },
  organization: { name: "Organization", color: "text-orange-600", bgColor: "bg-orange-50" }
}

export const threadExample = {
  title: "Thread Flow Example",
  description: "The \"Audit Workflow Example\" above demonstrates a complete workflow from issue identification to resolution, showing how different team members collaborate using the comment system. Notice how replies are visually connected to parent comments and how status changes are reflected throughout the conversation.",
  highlight: true
}
