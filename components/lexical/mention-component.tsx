import { forwardRef } from "react"
import type { BeautifulMentionComponentProps } from "lexical-beautiful-mentions"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { getIcon, getStyles, generateResourceUrl } from "./utils/mention-utils"

export const CustomMentionComponent = forwardRef<HTMLSpanElement, BeautifulMentionComponentProps>(
  ({ trigger, value, data, ...other }, ref) => {
    return (
      <span
        {...other}
        ref={ref}
        className={getStyles(trigger)}
        title={data?.email || data?.description || `${trigger}${value}`}
      >
        {getIcon(trigger, value)}
        <span>{value}</span>
        {trigger === "#" &&
          (value.startsWith("question") || value.startsWith("rule") || value.startsWith("section")) && (
            <Link
              href={generateResourceUrl(value)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <ExternalLink className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity" />
            </Link>
          )}
      </span>
    )
  },
)

CustomMentionComponent.displayName = "CustomMentionComponent"
