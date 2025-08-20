"use client"

import type React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useComments } from "@/contexts/comment-context"
import { useToast } from "@/hooks/use-toast"

type CommentVariant =
  | "card"
  | "bubble"
  | "timeline"
  | "compact"
  | "social"
  | "professional"
  | "clean"
  | "thread"
  | "github"
  | "email"
  | "notion"
  | "mobile"

interface CommentLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function CommentLayout({ children, title, description }: CommentLayoutProps) {
  const { toast } = useToast()
  const { clearAllStorage, config, updateConfig } = useComments()

  const variantOptions = [
    { value: "card", label: "Card Style" },
    { value: "bubble", label: "Chat Bubble" },
    { value: "timeline", label: "Timeline" },
    { value: "compact", label: "Compact" },
    { value: "social", label: "Social Media" },
    { value: "professional", label: "Professional" },
    { value: "clean", label: "Clean" },
    { value: "thread", label: "Thread" },
    { value: "github", label: "GitHub" },
    { value: "email", label: "Email" },
    { value: "notion", label: "Notion" },
    { value: "mobile", label: "Mobile" },
  ]

  const handleClearStorage = async () => {
    await clearAllStorage()
    toast({
      title: "Storage Cleared",
      description: "All comments, users, and audit data have been cleared.",
    })
    window.location.reload()
  }

  const handleVariantChange = (variant: CommentVariant) => {
    console.log(variant)
    updateConfig({ variant })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title || "Flexible Comment System"}</h1>
              {description && <p className="text-gray-600 mt-1 text-sm">{description}</p>}
            </div>

            <div className="flex items-center gap-3">
              {/* Variant Selector */}
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-md border">
                <Palette className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Style:</span>
                <Select value={config.variant || "card"} onValueChange={handleVariantChange}>
                  <SelectTrigger className="w-28 h-6 text-xs border-0 bg-transparent p-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variantOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Storage Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearStorage}
                className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">{children}</div>
    </div>
  )
}
