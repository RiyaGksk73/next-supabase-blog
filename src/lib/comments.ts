import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Comment } from "@/lib/types";

type CommentProfile = { full_name: string | null };
type CommentRow = Omit<Comment, "profiles"> & {
  profiles?: CommentProfile | CommentProfile[] | null;
};

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, author_id, content, created_at, profiles(full_name)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as unknown as CommentRow[];

  return rows.map((comment) => ({
    ...comment,
    profiles: Array.isArray(comment?.profiles)
      ? (comment.profiles[0] ?? null)
      : (comment?.profiles ?? null),
  }));
}
