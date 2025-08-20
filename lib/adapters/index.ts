import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"
import { LocalStorageAdapter } from "./local-storage-adapter"
import { ServerActionAdapter } from "./server-action-adapter"
import { ApiAdapter } from "./api-adapter"
import { useTanstackQueryAdapter } from "./tanstack-query-adapter"

export type { CommentStorageAdapter, StorageAdapterConfig }
export { LocalStorageAdapter }
export { ServerActionAdapter }
export { ApiAdapter }
export { useTanstackQueryAdapter }

export function createStorageAdapter(
  type: "localStorage" | "serverActions" | "api" | "custom",
  config: StorageAdapterConfig = {},
  customAdapter?: CommentStorageAdapter,
): CommentStorageAdapter {
  switch (type) {
    case "localStorage":
      return new LocalStorageAdapter(config)
    case "serverActions":
      return new ServerActionAdapter(config)
    case "api":
      return new ApiAdapter(config)
    case "custom":
      if (!customAdapter) {
        throw new Error("Custom adapter must be provided when type is 'custom'")
      }
      return customAdapter
    default:
      throw new Error(`Unknown adapter type: ${type}`)
  }
}
