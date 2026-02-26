/**
 * Posts Operations Module
 * Handles all post-related WordPress REST API operations
 */

import type { WordPressPost, PostQueryParams, CreatePostRequest, UpdatePostRequest } from "@/types/wordpress.js";

/**
 * Interface for the base client methods needed by posts operations
 */
export interface PostsClientBase {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: unknown): Promise<T>;
  put<T>(endpoint: string, data?: unknown): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

/**
 * Posts operations mixin
 * Provides CRUD operations for WordPress posts
 */
export class PostsOperations {
  constructor(private client: PostsClientBase) {}

  /**
   * Get a list of posts with optional filtering
   */
  async getPosts(params?: PostQueryParams, postType: string = "posts"): Promise<WordPressPost[]> {
    const queryString = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
    return this.client.get<WordPressPost[]>(`${postType}${queryString}`);
  }

  /**
   * Get a single post by ID
   */
  async getPost(
    id: number,
    context: "view" | "embed" | "edit" = "view",
    postType: string = "posts",
  ): Promise<WordPressPost> {
    return this.client.get<WordPressPost>(`${postType}/${id}?context=${context}`);
  }

  /**
   * Create a new post
   */
  async createPost(data: CreatePostRequest, postType: string = "posts"): Promise<WordPressPost> {
    return this.client.post<WordPressPost>(postType, data);
  }

  /**
   * Update an existing post
   */
  async updatePost(data: UpdatePostRequest, postType: string = "posts"): Promise<WordPressPost> {
    const { id, ...updateData } = data;
    return this.client.put<WordPressPost>(`${postType}/${id}`, updateData);
  }

  /**
   * Delete a post
   */
  async deletePost(
    id: number,
    force = false,
    postType: string = "posts",
  ): Promise<{ deleted: boolean; previous?: WordPressPost }> {
    return this.client.delete(`${postType}/${id}?force=${force}`);
  }

  /**
   * Get post revisions
   */
  async getPostRevisions(id: number, postType: string = "posts"): Promise<WordPressPost[]> {
    return this.client.get<WordPressPost[]>(`${postType}/${id}/revisions`);
  }
}
