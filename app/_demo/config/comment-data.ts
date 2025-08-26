import { User } from "@/lib/comments/types/comments";

export const currentUser = {
  id: "user1",
  name: "Sarah Johnson",
  email: "sarah@company.com",
  role: "auditor" as const,
  avatar: "/placeholder.svg?height=32&width=32",
  createdAt: new Date(),
} as User;

export const sampleThreadComments = [
  {
    id: "thread-1",
    content:
      "I've reviewed the nutrition facts panel and found several compliance issues that need immediate attention.",
    author: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Lead Auditor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
    reactions: [
      { type: "like" as const, userId: "user2" },
      { type: "urgent" as const, userId: "user3" },
    ],
  },
  {
    id: "thread-2",
    content:
      "Thanks for flagging this! Can you specify which sections are problematic? I want to prioritize the fixes correctly.",
    author: {
      id: "user3",
      name: "Alex Rivera",
      email: "alex@company.com",
      role: "Brand Manager" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
  },
  {
    id: "thread-3",
    content:
      "The main issues are: 1) Serving size format is incorrect, 2) Vitamin D value is missing, 3) Added sugars line is not properly indented. All are FDA compliance requirements.",
    author: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Lead Auditor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
  },
  {
    id: "thread-4",
    content:
      "I can handle the formatting issues. For the Vitamin D value, do we have the lab results from the latest batch testing?",
    author: {
      id: "user6",
      name: "Design Team",
      email: "design@company.com",
      role: "Designer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "high" as const,
  },
  {
    id: "thread-5",
    content:
      "Yes, I have the latest lab results. Vitamin D content is 2.1 mcg per serving. I'll send you the complete nutritional analysis spreadsheet.",
    author: {
      id: "user4",
      name: "Dr. Lisa Park",
      email: "lisa@company.com",
      role: "Nutritionist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "high" as const,
    sourceReference: {
      id: "ref-vitamin-d",
      url: "/documents/lab-results-vitamin-d-analysis.pdf",
      label: "Vitamin D Lab Analysis Report",
      description:
        "Complete nutritional analysis including Vitamin D content verification",
      type: "document" as const,
      metadata: {
        pageTitle: "Lab Results - Vitamin D Content Analysis",
        batchNumber: "VD-2024-0318",
        testDate: "2024-03-18",
      },
    },
    reactions: [{ type: "like" as const, userId: "user6" }],
  },
  {
    id: "thread-6",
    content:
      "Perfect! I've updated the nutrition facts panel with all the corrections. The new version addresses all compliance issues mentioned. Ready for final review.",
    author: {
      id: "user6",
      name: "Design Team",
      email: "design@company.com",
      role: "Designer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: "resolved" as const,
    priority: "high" as const,
    reactions: [
      { type: "like" as const, userId: "user1" },
      { type: "like" as const, userId: "user3" },
      { type: "like" as const, userId: "user4" },
    ],
  },
];
