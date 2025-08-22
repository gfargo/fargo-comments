import type { Comment, CommentReaction } from "@/lib/types/comments";

// Action types for comment reducer
export type CommentAction =
  | { type: "LOAD_COMMENTS"; payload: Comment[] }
  | { type: "ADD_COMMENT"; payload: Comment }
  | { type: "UPDATE_COMMENT"; payload: { id: string; updates: Partial<Comment> } }
  | { type: "DELETE_COMMENT"; payload: string }
  | { type: "ADD_REACTION"; payload: { commentId: string; reaction: CommentReaction } }
  | { type: "REMOVE_REACTION"; payload: { commentId: string; reactionId: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

// Comment state interface
export interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

// Initial state
export const initialCommentState: CommentState = {
  comments: [],
  loading: false,
  error: null,
}

// Comment reducer
export function commentReducer(state: CommentState, action: CommentAction): CommentState {
  switch (action.type) {
    case "LOAD_COMMENTS":
      return {
        ...state,
        comments: action.payload,
        loading: false,
        error: null,
      }

    case "ADD_COMMENT":
      return {
        ...state,
        comments: [...state.comments, action.payload],
        error: null,
      }

    case "UPDATE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.id
            ? { ...comment, ...action.payload.updates, isEdited: true, updatedAt: new Date() }
            : comment,
        ),
        error: null,
      }

    case "DELETE_COMMENT":
      return {
        ...state,
        comments: state.comments.filter((comment) => comment.id !== action.payload),
        error: null,
      }

    case "ADD_REACTION":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.commentId
            ? {
                ...comment,
                reactions: [...comment.reactions, action.payload.reaction],
              }
            : comment,
        ),
        error: null,
      }

    case "REMOVE_REACTION":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.commentId
            ? {
                ...comment,
                reactions: comment.reactions.filter((r) => r.id !== action.payload.reactionId),
              }
            : comment,
        ),
        error: null,
      }

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    default:
      return state
  }
}
