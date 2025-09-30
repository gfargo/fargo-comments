import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
    User,
    Comment,
    CommentThread,
    MentionUser,
    MentionTag,
} from "@/lib/comments/types/comments"
import type {
    CommentStorageAdapter,
    StorageAdapterConfig,
} from "./comment-storage-adapter"

export function useTanstackQueryAdapter(config: StorageAdapterConfig = {}) {
  const queryClient = useQueryClient()
  const baseUrl = config.apiEndpoint || "/api"
  const headers = {
    "Content-Type": "application/json",
    ...config.headers,
  }

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Query hooks for data fetching
  const useComments = () =>
    useQuery<Comment[]>({
      queryKey: ["comments"],
      queryFn: () => request<Comment[]>("/comments"),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })

  const useCommentThreads = (sourceId?: string, sourceType?: string) =>
    useQuery<CommentThread[]>({
      queryKey: ["comments", "threads", sourceId, sourceType],
      queryFn: () => {
        const query = sourceId
          ? `?sourceId=${sourceId}${
              sourceType ? `&sourceType=${sourceType}` : ""
            }`
          : ""
        return request<CommentThread[]>(`/comments/threads${query}`)
      },
    })

  const addCommentMutation = useMutation({
    mutationFn: (comment: Comment) =>
      request<Comment>("/comments", {
        method: "POST",
        body: JSON.stringify(comment),
      }),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData<Comment[]>(["comments"])

      queryClient.setQueryData(
        ["comments"],
        (old: Comment[] = []) => [...old, newComment]
      )

      return { previousComments }
    },
    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(["comments"], context?.previousComments)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      updates,
    }: {
      commentId: string
      updates: Partial<Comment>
    }) =>
      request<void>(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      request<void>(`/comments/${commentId}`, {
        method: "DELETE",
      }),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData<Comment[]>(["comments"])

      queryClient.setQueryData(
        ["comments"],
        (old: Comment[] = []) =>
          old.filter((comment) => comment.id !== deletedId)
      )

      return { previousComments }
    },
    onError: (_err, _deletedId, context) => {
      queryClient.setQueryData(["comments"], context?.previousComments)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const addLexicalCommentMutation = useMutation({
    mutationFn: (params: {
      content: string
      editorState: string
      author: User
      mentions?: MentionUser[]
      tags?: MentionTag[]
      sourceId?: string
      sourceType?: string
      parentId?: string
    }) =>
      request<Comment>("/comments/lexical", {
        method: "POST",
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const adapter: CommentStorageAdapter & {
    hooks: {
      useComments: typeof useComments
      useCommentThreads: typeof useCommentThreads
    }
    mutations: {
      addComment: typeof addCommentMutation
      updateComment: typeof updateCommentMutation
      deleteComment: typeof deleteCommentMutation
      addLexicalComment: typeof addLexicalCommentMutation
    }
  } = {
    // Hook access
    hooks: {
      useComments,
      useCommentThreads,
    },
    mutations: {
      addComment: addCommentMutation,
      updateComment: updateCommentMutation,
      deleteComment: deleteCommentMutation,
      addLexicalComment: addLexicalCommentMutation,
    },

    // Fallback methods for backward compatibility
    async getComments(): Promise<Comment[]> {
      return request<Comment[]>("/comments")
    },

    async saveComments(comments: Comment[]): Promise<void> {
      await request<void>("/comments/bulk", {
        method: "PUT",
        body: JSON.stringify(comments),
      })
    },

    async addComment(comment: Comment): Promise<void> {
      await request<void>("/comments", {
        method: "POST",
        body: JSON.stringify(comment),
      })
    },

    async updateComment(
      commentId: string,
      updates: Partial<Comment>
    ): Promise<void> {
      await request<void>(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      })
    },

    async deleteComment(commentId: string): Promise<void> {
      await request<void>(`/comments/${commentId}`, {
        method: "DELETE",
      })
    },

    async addLexicalComment(
      content: string,
      editorState: string,
      author: User,
      mentions: MentionUser[] = [],
      tags: MentionTag[] = [],
      sourceId?: string,
      sourceType?: string,
      parentId?: string
    ): Promise<Comment> {
      return request<Comment>("/comments/lexical", {
        method: "POST",
        body: JSON.stringify({
          content,
          editorState,
          author,
          mentions,
          tags,
          sourceId,
          sourceType,
          parentId,
        }),
      })
    },

    async updateCommentWithEditorState(
      commentId: string,
      content: string,
      editorState: string
    ): Promise<void> {
      await request<void>(`/comments/${commentId}/lexical`, {
        method: "PATCH",
        body: JSON.stringify({ content, editorState }),
      })
    },

    async getcommentsSource(
      sourceId: string,
      sourceType?: string
    ): Promise<Comment[]> {
      const query = `?sourceId=${sourceId}${
        sourceType ? `&sourceType=${sourceType}` : ""
      }`
      return request<Comment[]>(`/comments${query}`)
    },

    async getCommentThreads(
      sourceId?: string,
      sourceType?: string
    ): Promise<CommentThread[]> {
      const query = sourceId
        ? `?sourceId=${sourceId}${
            sourceType ? `&sourceType=${sourceType}` : ""
          }`
        : ""
      return request<CommentThread[]>(`/comments/threads${query}`)
    },

    async clearAllStorage(): Promise<void> {
      await request<void>("/storage/clear", { method: "DELETE" })
    },
  }

  return adapter
}
