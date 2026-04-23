"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const commentSchema = z.object({
  postId: z.string().uuid(),
  slug: z.string().min(1),
  content: z.string().min(1).max(1000),
});

export async function addCommentAction(formData: FormData) {
  const { user, profile } = await requireAuth();

  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    slug: formData.get("slug"),
    content: formData.get("content"),
  });

  if (!parsed.success) redirect("/?error=Invalid%20comment");

  const supabase = await createSupabaseServerClient();

  const { data: post } = await supabase
    .from("posts")
    .select("id, author_id, status")
    .eq("id", parsed.data.postId)
    .single();

  const canComment =
    !!post &&
    (post.status === "published" ||
      (profile?.role === "admin") ||
      (profile?.role === "author" && post.author_id === user.id));

  if (!canComment) {
    redirect(`/posts/${parsed.data.slug}?error=Forbidden`);
  }

  const { error } = await supabase.from("comments").insert({
    post_id: parsed.data.postId,
    author_id: user.id,
    content: parsed.data.content,
  });

  if (error) redirect(`/posts/${parsed.data.slug}?error=${encodeURIComponent(error.message)}`);

  revalidatePath(`/posts/${parsed.data.slug}`);
  redirect(`/posts/${parsed.data.slug}`);
}
