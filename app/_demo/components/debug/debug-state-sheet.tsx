"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bug, Copy, Check } from "lucide-react";
import { useComments } from "@/lib/comments/contexts/comment-context";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function DebugStateSheet() {
  const [copied, setCopied] = useState(false);
  const { state, currentUser, config } = useComments();

  const debugData = {
    comments: state.comments,
    commentsCount: state.comments?.length || 0,
    currentUser,
    config,
    loading: state.loading,
    error: state.error,
    fullState: state,
    timestamp: new Date().toISOString(),
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
      setCopied(true);
      toast.success("Debug state has been copied to your clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy debug state to clipboard.");
      console.log(err);
    }
  };

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 bg-transparent"
              >
                <Bug className="h-3 w-3" />
                <span className="sr-only">Debug State</span>
              </Button>
            </SheetTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Open the debug state inspector to view the current state of the
          comment system.
        </TooltipContent>
      </Tooltip>

      <SheetContent className="w-[600px] sm:w-[800px] max-w-[90vw] md:max-w-[90vw] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-lg">
                  Debug State Inspector
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-600">
                  Current state of the comment system including comments, users,
                  config, and metadata.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <div className="p-6 space-y-6 h-full">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Quick Stats
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {state.comments?.length ?? 0} Comments
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      Variant: {config?.variant ?? "default"}
                    </Badge>
                    <Badge
                      variant={state.loading ? "destructive" : "default"}
                      className={
                        state.loading ? "" : "bg-green-100 text-green-800"
                      }
                    >
                      {state.loading ? "Loading" : "Ready"}
                    </Badge>
                    {state.error && <Badge variant="destructive">Error</Badge>}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Current User
                  </h4>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
                    {currentUser ? (
                      <div>
                        <div className="font-medium">{currentUser.name}</div>
                        <div className="text-xs text-gray-500">
                          {currentUser.email}
                        </div>
                      </div>
                    ) : (
                      "No user authenticated"
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-1 min-h-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Full State Object
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyToClipboard}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="bg-gray-900 rounded-lg border overflow-hidden flex-1 min-h-0">
                  <ScrollArea className="h-[400px] md:h-[600px]">
                    <pre className="text-xs font-mono text-green-400 p-4 whitespace-pre-wrap break-words leading-relaxed">
                      {JSON.stringify(debugData, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
