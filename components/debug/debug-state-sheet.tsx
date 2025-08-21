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
      <SheetContent className="w-[600px] sm:w-[800px] max-w-[90vw] flex flex-col">
        <SheetHeader className="pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-lg font-semibold">Debug State Inspector</SheetTitle>
              <SheetDescription className="mt-2 text-sm text-muted-foreground">
                Current state of the comment system including comments, users, config, and metadata.
              </SheetDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 shrink-0 bg-transparent"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy JSON"}
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-hidden">
          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Quick Stats</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-medium">
                    {state.comments?.length ?? 0} Comments
                  </Badge>
                  <Badge variant="outline" className="font-medium">
                    Variant: {config?.variant ?? "default"}
                  </Badge>
                  <Badge variant={state.loading ? "destructive" : "default"} className="font-medium">
                    {state.loading ? "Loading" : "Ready"}
                  </Badge>
                  {state.error && (
                    <Badge variant="destructive" className="font-medium">
                      Error
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Current User</h4>
                <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                  {currentUser ? (
                    <div>
                      <div className="font-medium text-foreground">{currentUser.name}</div>
                      <div className="text-xs">{currentUser.email}</div>
                    </div>
                  ) : (
                    "No user authenticated"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <h4 className="text-sm font-semibold text-foreground">Full State Object</h4>
            <div className="flex-1 rounded-lg border bg-muted/20 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <pre className="text-xs font-mono leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
                    {JSON.stringify(debugData, null, 2)}
                  </pre>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
