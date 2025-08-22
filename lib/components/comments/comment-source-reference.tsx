"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { Comment } from "@/lib/types/comments"
import type { CommentVariant } from "./comment-variations"

interface CommentSourceReferenceProps {
  sourceReference: Comment["sourceReference"]
  variant: CommentVariant
  className?: string
}

export function CommentSourceReference({
  sourceReference,
  variant,
  className = "",
}: CommentSourceReferenceProps) {
  if (!sourceReference) return null

  const getVariantStyles = () => {
    switch (variant) {
      case "clean":
        return {
          container: "mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg",
          dot: "w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0",
          label: "text-xs font-medium text-gray-600 mb-1",
          title: "text-sm font-medium text-gray-900",
          description: "text-xs text-gray-600 mt-1",
          link: "inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 mt-2 font-medium",
        }
      case "notion":
        return {
          container: "mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md",
          dot: "w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0",
          label: "text-xs font-medium text-orange-700 mb-1",
          title: "text-sm font-medium text-orange-900",
          description: "text-xs text-orange-600 mt-1",
          link: "inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 mt-2 font-medium",
        }
      case "github":
        return {
          container: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0",
          label: "text-sm font-medium text-blue-700 mb-1",
          title: "text-sm font-medium text-blue-800",
          description: "text-sm text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2",
        }
      case "professional":
        return {
          container: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0",
          label: "text-sm font-medium text-blue-700 mb-1",
          title: "text-sm font-medium text-blue-800",
          description: "text-sm text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2",
        }
      case "thread":
        return {
          container: "mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md",
          dot: "w-1.5 h-1.5 bg-blue-500 rounded-full",
          label: "text-xs font-medium text-blue-700",
          title: "text-xs font-medium text-blue-800",
          description: "text-xs text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1",
        }
      case "social":
        return {
          container: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full",
          label: "text-sm font-medium text-blue-700 mb-1",
          title: "text-sm font-medium text-blue-800",
          description: "text-sm text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2",
        }
      case "card":
        return {
          container: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0",
          label: "text-sm font-medium text-blue-800",
          title: "text-sm font-medium text-blue-800",
          description: "text-sm text-blue-700 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2",
        }
      case "email":
        return {
          container: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0",
          label: "text-sm font-medium text-blue-800",
          title: "text-sm font-medium text-blue-800",
          description: "text-sm text-blue-700 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2",
        }
      case "bubble":
        return {
          container: "mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs",
          dot: "w-1.5 h-1.5 bg-blue-500 rounded-full",
          label: "font-medium text-blue-700",
          title: "text-blue-700",
          description: "text-blue-600 mt-1",
          link: "ml-1 text-blue-600 hover:text-blue-800 flex items-center gap-1",
        }
      case "timeline":
        return {
          container: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0",
          label: "text-sm font-medium text-blue-700 mb-1",
          title: "text-sm font-medium text-blue-800",
          description: "text-sm text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2",
        }
      case "mobile":
        return {
          container: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0",
          label: "text-sm font-medium text-blue-700 mb-1",
          title: "text-base font-medium text-blue-800",
          description: "text-sm text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-3",
        }
      case "compact":
        return {
          container: "mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs",
          dot: "w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0",
          label: "font-medium text-blue-700",
          title: "text-blue-800",
          description: "text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-1",
        }
      case "plain":
        return {
          container: "mt-2 p-2 bg-gray-50 border border-gray-200 rounded",
          dot: "w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0",
          label: "text-xs font-medium text-gray-600 mb-1",
          title: "text-sm font-medium text-gray-900",
          description: "text-xs text-gray-600 mt-1",
          link: "inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 mt-2",
        }
      default:
        return {
          container: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
          dot: "w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0",
          label: "text-sm font-medium text-blue-700 mb-1",
          title: "text-sm font-medium text-blue-800",
          description: "text-sm text-blue-600 mt-1",
          link: "inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2",
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex items-start gap-2">
        <div className={styles.dot}></div>
        <div className="flex-1">
          {variant === "notion" ? (
            <>
              <div className={styles.label}>Referenced:</div>
              <div className={styles.title}>{sourceReference.label}</div>
            </>
          ) : variant === "bubble" ? (
            <div className="flex items-center gap-1 text-blue-700">
              <span className={styles.label}>Referenced:</span>
              <span className={styles.title}>{sourceReference.label}</span>
              {sourceReference.description && (
                <span className={styles.description}>- {sourceReference.description}</span>
              )}
              {sourceReference.url && (
                <Link
                  href={sourceReference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View Source
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          ) : variant === "card" ? (
            <div className="text-sm text-blue-800">
              <span className="font-medium">Referenced:</span> {sourceReference.label}
            </div>
          ) : (
            <>
              <div className={styles.label}>Referenced:</div>
              <div className={styles.title}>{sourceReference.label}</div>
            </>
          )}
          
          {variant !== "bubble" && variant !== "card" && (
            <>
              {sourceReference.description && (
                <div className={styles.description}>{sourceReference.description}</div>
              )}
              {sourceReference.url && (
                <Link
                  href={sourceReference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View Source <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </>
          )}
          
          {variant === "card" && (
            <>
              {sourceReference.description && (
                <div className={styles.description}>{sourceReference.description}</div>
              )}
              {sourceReference.url && (
                <Link
                  href={sourceReference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View Source
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
