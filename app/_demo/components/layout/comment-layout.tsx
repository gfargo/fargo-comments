"use client";

import type React from "react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Palette, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComments } from "@/lib/comments/contexts/comment-context";
import { toast } from "sonner";
import { DebugStateSheet } from "@/app/_demo/components/debug/debug-state-sheet";
import { track } from '@vercel/analytics';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  | "mobile";

interface CommentLayoutProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string;
}

const variantOptions = [
  { value: "card", label: "Card" },
  { value: "bubble", label: "Bubble" },
  { value: "timeline", label: "Timeline" },
  { value: "compact", label: "Compact" },
  { value: "social", label: "Social" },
  { value: "professional", label: "Professional" },
  { value: "clean", label: "Clean" },
  { value: "thread", label: "Thread" },
  { value: "github", label: "GitHub" },
  { value: "email", label: "Email" },
  { value: "notion", label: "Notion" },
  { value: "mobile", label: "Mobile" },
];

export function CommentLayout({
  children,
  title,
  description,
}: CommentLayoutProps) {
  const { clearAllStorage, config, updateConfig } = useComments();
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const handleClearStorage = async () => {
    await clearAllStorage();
    toast.success("All comment data has been cleared.");
    window.location.reload();
  };

  const handleClearStorageClick = () => {
    setShowClearConfirmation(true);
  };

  const handleConfirmedClear = async () => {
    setShowClearConfirmation(false);
    await handleClearStorage();
  };

  const handleVariantChange = (variant: CommentVariant) => {
    console.log(variant);
    updateConfig({ variant });
    
    // Track variant change
    track('variant_changed', {
      variant: variant,
      previous_variant: config.variant || 'card',
      timestamp: Date.now()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title || "Flexible Comment System"}
              </h1>
              {description && (
                <p className="text-muted-foreground mt-1 text-sm">{description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Variant Selector */}
              <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded-md border border-primary/20">
                <Palette className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary hidden sm:inline">
                  Style:
                </span>
                <Select
                  value={config.variant || "card"}
                  onValueChange={handleVariantChange}
                >
                  <SelectTrigger className="w-24 sm:w-28 h-6 text-xs border-0 bg-transparent p-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variantOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-xs"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Debug State Sheet Button */}
              <DebugStateSheet />

              {/* Clear Storage Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearStorageClick}
                      className="h-8 px-2 sm:px-3 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 border-destructive/20 bg-transparent"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Clear Local Data</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear all comments from local storage</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">{children}</div>

      {/* Confirmation Dialog for Clear Storage Action */}
      <AlertDialog
        open={showClearConfirmation}
        onOpenChange={setShowClearConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              comments from local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedClear}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CommentLayout;
