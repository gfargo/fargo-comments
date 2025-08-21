"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bug, Copy, Check } from "lucide-react"
import { useComments } from "@/contexts/comment-context"
import { useToast } from "@/hooks/use-toast"

export function DebugStateSheet() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const { state, currentUser, config } = useComments()

  console.log("[v0] Debug Sheet - state.comments:", state.comments)
  console.log("[v0] Debug Sheet - state.loading:", state.loading)
  console.log("[v0] Debug Sheet - state.error:", state.error)

  const debugData = {
    comments: state.comments,
    commentsCount: state.comments?.length || 0,
    currentUser,
    config,
    loading: state.loading,
    error: state.error,
    fullState: state,
    timestamp: new Date().toISOString(),
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "Debug state has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy debug state to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 bg-transparent"
        >
          <Bug className="h-3 w-3 mr-1" />
          Debug State
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[800px] flex flex-grow">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Debug State Inspector</SheetTitle>
              <SheetDescription>
                Current state of the comment system including comments, users, config, and metadata.
              </SheetDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 bg-transparent"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy JSON"}
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Stats</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{state.comments?.length ?? 0} Comments</Badge>
                <Badge variant="secondary">Variant: {config?.variant ?? "default"}</Badge>
                <Badge variant={state.loading ? "destructive" : "default"}>{state.loading ? "Loading" : "Ready"}</Badge>
                {state.error && <Badge variant="destructive">Error</Badge>}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current User</h4>
              <div className="text-sm text-gray-600">
                {currentUser ? `${currentUser.name} (${currentUser.email})` : "No user"}
              </div>
            </div>
          </div>

          {/* Full State Dump */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Full State Object</h4>
            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
