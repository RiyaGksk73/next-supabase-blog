import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Post, Role } from "@/lib/types";

type PostProfile = { full_name: string | null; role: Role };
type PostRow = Omit<Post, "profiles"> & {
  profiles?: PostProfile | PostProfile[] | null;
};

function normalizePost(row: PostRow): Post {
  const profile = Array.isArray(row?.profiles)
    ? (row.profiles[0] ?? null)
    : (row?.profiles ?? null);

  return {
    ...row,
    profiles: profile,
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  const supabase = await createSupabaseServerClient();
  let slug = baseSlug;
  let i = 1;

  while (true) {
    let query = supabase.from("posts").select("id").eq("slug", slug).limit(1);
    if (excludeId) {
      query = query.neq("id", excludeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) {
      return slug;
    }
    i += 1;
    slug = `${baseSlug}-${i}`;
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, author_id, title, slug, content, summary, status, created_at, updated_at, profiles(full_name, role)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as unknown as PostRow[];
  return rows.map(normalizePost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, author_id, title, slug, content, summary, status, created_at, updated_at, profiles(full_name, role)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return normalizePost(data as unknown as PostRow);
}

export function canViewPost(status: Post["status"], role: Role | null, authorId: string, userId?: string) {
  if (status === "published") return true;
  if (!role || !userId) return false;
  return role === "admin" || (role === "author" && authorId === userId);
}
