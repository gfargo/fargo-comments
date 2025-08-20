import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { User } from "@/types/comments"
import type { CommentStorageAdapter, StorageAdapterConfig } from "./comment-storage-adapter"

export function useTanstackQueryAdapter(config: StorageAdapterConfig = {}) {
  const queryClient = useQueryClient()
  const baseUrl = config.apiEndpoint || "/api"
  const headers = {
    "Content-Type": "application/json",
    ...config.headers,
  }

  const request = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
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
    useQuery({
      queryKey: ["comments"],
      queryFn: () => request("/comments"),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })

  const useUsers = () =>
    useQuery({
      queryKey: ["users"],
      queryFn: () => request("/users"),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })

  const useAudits = () =>
    useQuery({
      queryKey: ["audits"],
      queryFn: () => request("/audits"),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })

  const useCommentsByAuditItem = (auditItemId: string) =>
    useQuery({
      queryKey: ["comments", "audit", auditItemId],
      queryFn: () => request(`/comments?auditItemId=${auditItemId}`),
      enabled: !!auditItemId,
    })

  const useCommentThreads = (auditItemId?: string) =>
    useQuery({
      queryKey: ["comments", "threads", auditItemId],
      queryFn: () => {
        const query = auditItemId ? `?auditItemId=${auditItemId}` : ""
        return request(`/comments/threads${query}`)
      },
    })

  const addCommentMutation = useMutation({
    mutationFn: (comment: any) =>
      request("/comments", {
        method: "POST",
        body: JSON.stringify(comment),
      }),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData(["comments"])

      queryClient.setQueryData(["comments"], (old: any[] = []) => [...old, newComment])

      return { previousComments }
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["comments"], context?.previousComments)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, updates }: { commentId: string; updates: any }) =>
      request(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      request(`/comments/${commentId}`, {
        method: "DELETE",
      }),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previousComments = queryClient.getQueryData(["comments"])

      queryClient.setQueryData(["comments"], (old: any[] = []) => old.filter((comment) => comment.id !== deletedId))

      return { previousComments }
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["comments"], context?.previousComments)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const addLexicalCommentMutation = useMutation({
    mutationFn: (params: any) =>
      request("/comments/lexical", {
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
      useUsers: typeof useUsers
      useAudits: typeof useAudits
      useCommentsByAuditItem: typeof useCommentsByAuditItem
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
      useUsers,
      useAudits,
      useCommentsByAuditItem,
      useCommentThreads,
    },
    mutations: {
      addComment: addCommentMutation,
      updateComment: updateCommentMutation,
      deleteComment: deleteCommentMutation,
      addLexicalComment: addLexicalCommentMutation,
    },

    // Fallback methods for backward compatibility
    async getComments(): Promise<any[]> {
      return request("/comments")
    },

    async saveComments(comments: any[]): Promise<void> {
      await request("/comments/bulk", {
        method: "PUT",
        body: JSON.stringify(comments),
      })
    },

    async addComment(comment: any): Promise<void> {
      await request("/comments", {
        method: "POST",
        body: JSON.stringify(comment),
      })
    },

    async updateComment(commentId: string, updates: any): Promise<void> {
      await request(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      })
    },

    async deleteComment(commentId: string): Promise<void> {
      await request(`/comments/${commentId}`, {
        method: "DELETE",
      })
    },

    async addLexicalComment(
      content: string,
      editorState: string,
      author: User,
      mentions: any[] = [],
      tags: any[] = [],
      auditItemId?: string,
      parentId?: string,
    ): Promise<any> {
      return request("/comments/lexical", {
        method: "POST",
        body: JSON.stringify({
          content,
          editorState,
          author,
          mentions,
          tags,
          auditItemId,
          parentId,
        }),
      })
    },

    async updateCommentWithEditorState(commentId: string, content: string, editorState: string): Promise<void> {
      await request(`/comments/${commentId}/lexical`, {
        method: "PATCH",
        body: JSON.stringify({ content, editorState }),
      })
    },

    async getUsers(): Promise<User[]> {
      return request("/users")
    },

    async saveUsers(users: User[]): Promise<void> {
      await request("/users/bulk", {
        method: "PUT",
        body: JSON.stringify(users),
      })
    },

    async getAudits(): Promise<any[]> {
      return request("/audits")
    },

    async saveAudits(audits: any[]): Promise<void> {
      await request("/audits/bulk", {
        method: "PUT",
        body: JSON.stringify(audits),
      })
    },

    async getCommentsByAuditItem(auditItemId: string): Promise<any[]> {
      return request(`/comments?auditItemId=${auditItemId}`)
    },

    async getCommentThreads(auditItemId?: string): Promise<any[]> {
      const query = auditItemId ? `?auditItemId=${auditItemId}` : ""
      return request(`/comments/threads${query}`)
    },

    async clearAllStorage(): Promise<void> {
      await request("/storage/clear", { method: "DELETE" })
    },
  }

  return adapter
}
