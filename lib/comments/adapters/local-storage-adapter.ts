import type {
    Comment,
    CommentThread,
    User,
    MentionUser,
    MentionTag,
} from "@/lib/comments/types/comments";
import type {
    CommentStorageAdapter,
    StorageAdapterConfig,
} from "./comment-storage-adapter";
import { generateId } from "@/lib/comments/utils/generateId";
import { extractMentionsAndTags } from "@/lib/comments/lexical-utils";
import { debug } from "@/lib/comments/utils/debug";

export class LocalStorageAdapter implements CommentStorageAdapter {
  private readonly STORAGE_KEYS = {
    COMMENTS: "fargo_comment_store",
  } as const;

  constructor(private config: StorageAdapterConfig = {}) {}

  async getComments(): Promise<Comment[]> {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.STORAGE_KEYS.COMMENTS);
    if (!stored) return [];

    const comments = JSON.parse(stored);
    return comments.map((comment: Comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }));
  }

  async saveComments(comments: Comment[]): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }

  async addComment(comment: Comment): Promise<void> {
    const comments = await this.getComments();
    comments.push({
      ...comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.saveComments(comments);
  }

  async updateComment(
    commentId: string,
    updates: Partial<Comment>
  ): Promise<void> {
    const comments = await this.getComments();
    const index = comments.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      comments[index] = {
        ...comments[index],
        ...updates,
        updatedAt: new Date(),
        isEdited: true,
      };
      await this.saveComments(comments);
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    const comments = await this.getComments();
    const filtered = comments.filter((c) => c.id !== commentId);
    await this.saveComments(filtered);
  }

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
    const extracted = extractMentionsAndTags(editorState);
    const finalMentions = mentions.length > 0 ? mentions : extracted.mentions;
    const finalTags = tags.length > 0 ? tags : extracted.tags;

    const comment: Comment = {
      id: generateId(),
      content,
      editorState,
      authorId: author.id,
      author,
      sourceId,
      sourceType,
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      mentions: finalMentions,
      tags: finalTags,
      reactions: [],
      status: "active",
    };

    await this.addComment(comment);
    debug.log("Comment added to storage:", comment);
    return comment;
  }

  async updateCommentWithEditorState(
    commentId: string,
    content: string,
    editorState: string,
    mentions?: MentionUser[],
    tags?: MentionTag[]
  ): Promise<void> {
    const comments = await this.getComments();
    const index = comments.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      const extracted = extractMentionsAndTags(editorState);
      const finalMentions = mentions || extracted.mentions;
      const finalTags = tags || extracted.tags;

      comments[index] = {
        ...comments[index],
        content,
        editorState,
        mentions: finalMentions,
        tags: finalTags,
        updatedAt: new Date(),
        isEdited: true,
      };
      await this.saveComments(comments);
    }
  }

  async getCommentsBySource(
    sourceId: string,
    sourceType?: string
  ): Promise<Comment[]> {
    const comments = await this.getComments();
    return comments.filter((c) => {
      if (sourceType) {
        return c.sourceId === sourceId && c.sourceType === sourceType;
      }
      return c.sourceId === sourceId;
    });
  }

  async getCommentThreads(
    sourceId?: string,
    sourceType?: string
  ): Promise<CommentThread[]> {
    const comments = sourceId
      ? await this.getCommentsBySource(sourceId, sourceType)
      : await this.getComments();

    const rootComments = comments.filter((c) => !c.parentId);

    return rootComments.map((rootComment) => {
      const replies = comments.filter((c) => c.parentId === rootComment.id);
      return {
        id: rootComment.id,
        rootComment,
        replies,
        totalReplies: replies.length,
        lastActivity:
          replies.length > 0
            ? new Date(Math.max(...replies.map((r) => r.createdAt.getTime())))
            : rootComment.createdAt,
      };
    });
  }

  async clearAllStorage(): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.STORAGE_KEYS.COMMENTS);
  }
}
