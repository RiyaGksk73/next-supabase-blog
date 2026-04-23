export type Role = "viewer" | "author" | "admin";
export type PostStatus = "draft" | "published";

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "full_name" | "role"> | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: Pick<Profile, "full_name"> | null;
}
