export type CommentVariant =
  | "default"
  | "compact"
  | "inline"
  | "card"
  | "bubble"
  | "timeline"
  | "social"
  | "professional"
  | "clean"
  | "github"
  | "email"
  | "notion"
  | "mobile"
  | "thread"

export const getContainerStyles = (variant: CommentVariant) => {
  switch (variant) {
    case "compact":
      return "border border-gray-200 rounded-lg p-2 bg-white"
    case "inline":
      return "border-b border-gray-200 pb-2"
    case "bubble":
      return "border border-blue-200 rounded-2xl p-3 bg-blue-50/50"
    case "timeline":
      return "border border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-shadow duration-200"
    case "social":
      return "border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
    case "professional":
      return "border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
    case "clean":
      return "border-b border-gray-100 pb-4 mb-4"
    case "github":
      return "border border-gray-300 rounded-md p-3 bg-gray-50"
    case "email":
      return "border border-gray-200 rounded-lg p-4 bg-white"
    case "notion":
      return "border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50/50 transition-colors"
    case "mobile":
      return "border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
    case "thread":
      return "border-l-2 border-gray-200 pl-4 py-2"
    case "card":
      return "border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
    default:
      return "border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
  }
}

export const getContentEditableStyles = (variant: CommentVariant) => {
  switch (variant) {
    case "compact":
      return "min-h-[60px] p-2 text-sm focus:outline-none"
    case "inline":
      return "min-h-[32px] p-1 text-sm focus:outline-none"
    case "bubble":
      return "min-h-[80px] p-3 text-sm focus:outline-none rounded-xl"
    case "timeline":
      return "min-h-[90px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200"
    case "social":
      return "min-h-[90px] p-3 focus:outline-none"
    case "professional":
      return "min-h-[100px] p-3 focus:outline-none font-medium"
    case "clean":
      return "min-h-[80px] p-2 focus:outline-none"
    case "github":
      return "min-h-[80px] p-2 text-sm focus:outline-none font-mono"
    case "email":
      return "min-h-[100px] p-3 focus:outline-none"
    case "notion":
      return "min-h-[90px] p-3 focus:outline-none"
    case "mobile":
      return "min-h-[100px] p-4 text-base focus:outline-none"
    case "thread":
      return "min-h-[70px] p-2 text-sm focus:outline-none"
    case "card":
      return "min-h-[100px] p-3 focus:outline-none"
    default:
      return "min-h-[100px] p-3 focus:outline-none"
  }
}

export const getPlaceholderPosition = (variant: CommentVariant) => {
  switch (variant) {
    case "inline":
      return "top-1 left-1" // matches p-1 padding
    case "compact":
      return "top-2 left-2" // matches p-2 padding
    case "bubble":
    case "social":
    case "professional":
    case "email":
    case "notion":
    case "card":
      return "top-3 left-3" // matches p-3 padding
    case "mobile":
      return "top-4 left-4" // matches p-4 padding
    case "timeline":
    case "github":
    case "thread":
    case "clean":
      return "top-2 left-2" // matches p-2 padding
    default:
      return "top-3 left-3" // default p-3 padding
  }
}

export const getButtonConfig = (variant: CommentVariant) => {
  switch (variant) {
    case "compact":
      return {
        size: "sm" as const,
        showIcon: true,
        showText: false,
        text: "",
        className: "px-2",
      }
    case "mobile":
      return {
        size: "default" as const,
        showIcon: false,
        showText: true,
        text: "Post",
        className: "px-6",
      }
    case "inline":
      return {
        size: "xs" as const,
        showIcon: true,
        showText: false,
        text: "",
        className: "px-1",
      }
    case "bubble":
      return {
        size: "sm" as const,
        showIcon: true,
        showText: true,
        text: "Send",
        className: "rounded-full",
      }
    case "timeline":
      return {
        size: "sm" as const,
        showIcon: true,
        showText: true,
        text: "Add to Timeline",
        className:
          "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200",
      }
    case "social":
      return {
        size: "default" as const,
        showIcon: true,
        showText: true,
        text: "Share",
        className: "bg-blue-600 hover:bg-blue-700",
      }
    case "professional":
      return {
        size: "default" as const,
        showIcon: true,
        showText: true,
        text: "Submit",
        className: "bg-gray-900 hover:bg-gray-800",
      }
    case "clean":
      return {
        size: "sm" as const,
        showIcon: false,
        showText: true,
        text: "Post",
        className: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
      }
    case "github":
      return {
        size: "sm" as const,
        showIcon: true,
        showText: true,
        text: "Comment",
        className: "bg-green-600 hover:bg-green-700",
      }
    case "email":
      return {
        size: "default" as const,
        showIcon: true,
        showText: true,
        text: "Send",
        className: "bg-blue-600 hover:bg-blue-700",
      }
    case "notion":
      return {
        size: "sm" as const,
        showIcon: false,
        showText: true,
        text: "Comment",
        className: "bg-gray-800 hover:bg-gray-900",
      }
    case "thread":
      return {
        size: "xs" as const,
        showIcon: true,
        showText: true,
        text: "Reply",
        className: "px-1.5 py-0.5",
      }
    case "card":
      return {
        size: "default" as const,
        showIcon: true,
        showText: true,
        text: "Post Comment",
        className: "",
      }
    default:
      return {
        size: "default" as const,
        showIcon: true,
        showText: true,
        text: "Post Comment",
        className: "",
      }
  }
}
