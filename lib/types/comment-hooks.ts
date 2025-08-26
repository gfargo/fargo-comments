import type { Comment, User, MentionUser, MentionTag } from "@/lib/types/comments"
import type { CommentConfig } from "@/lib/hooks/use-comment-config"

// Hook context provided to all hook callbacks
export interface CommentHookContext {
  currentUser: User | null
  config: CommentConfig
  existingComments: Comment[]
}

// Hook callback types for different operations
export interface AddCommentHookData {
  content: string
  editorState: string
  mentions: MentionUser[]
  tags: MentionTag[]
  sourceId?: string
  sourceType?: string
  parentId?: string
  user: User
}

export interface UpdateCommentHookData {
  commentId: string
  content: string
  editorState: string
  mentions: MentionUser[]
  tags: MentionTag[]
  existingComment: Comment
}

export interface CommentHookData {
  comment: Comment
}

// Hook callback function types
export type AddCommentHook = (
  data: AddCommentHookData,
  context: CommentHookContext,
) => Promise<Partial<AddCommentHookData>> | Partial<AddCommentHookData>

export type UpdateCommentHook = (
  data: UpdateCommentHookData,
  context: CommentHookContext,
) => Promise<Partial<UpdateCommentHookData>> | Partial<UpdateCommentHookData>

export type PreSaveCommentHook = (
  data: CommentHookData,
  context: CommentHookContext,
) => Promise<Partial<Comment>> | Partial<Comment>

export type PostSaveCommentHook = (data: CommentHookData, context: CommentHookContext) => Promise<void> | void

// Hook registry interface
export interface CommentHooks {
  beforeAddComment?: AddCommentHook[]
  afterAddComment?: PostSaveCommentHook[]
  beforeUpdateComment?: UpdateCommentHook[]
  afterUpdateComment?: PostSaveCommentHook[]
  beforeSaveComment?: PreSaveCommentHook[]
  afterSaveComment?: PostSaveCommentHook[]
}

// Hook registration methods
export interface CommentHookRegistry {
  registerHook: <T extends keyof CommentHooks>(hookName: T, callback: NonNullable<CommentHooks[T]>[0]) => () => void
  unregisterHook: <T extends keyof CommentHooks>(hookName: T, callback: NonNullable<CommentHooks[T]>[0]) => void
  executeHooks: <T extends keyof CommentHooks>(
    hookName: T,
    data: Parameters<NonNullable<CommentHooks[T]>[0]>[0],
    context: CommentHookContext,
  ) => Promise<Parameters<NonNullable<CommentHooks[T]>[0]>[0]>
}
