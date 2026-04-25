"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { canEditPost, requireRole } from "@/lib/auth";
import { generateSummary } from "@/lib/ai";
import { ensureUniqueSlug, slugify } from "@/lib/posts";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const postSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(20).max(20000),
  status: z.enum(["draft", "published"]),
});

export async function createPostAction(formData: FormData) {
  const { user } = await requireRole(["author", "admin"]);

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    status: formData.get("status"),
  });

  if (!parsed.success) redirect("/posts/new?error=Invalid%20post%20data");

  const baseSlug = slugify(parsed.data.title);
  const slug = await ensureUniqueSlug(baseSlug || "post");
  const summary = await generateSummary(parsed.data.content);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    title: parsed.data.title,
    slug,
    content: parsed.data.content,
    summary,
    status: parsed.data.status,
  });

  if (error) redirect(`/posts/new?error=${encodeURIComponent(error.message)}`);
  redirect(`/posts/${slug}`);
}

export async function updatePostAction(postId: string, formData: FormData) {
  const { user, profile } = await requireRole(["author", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase.from("posts").select("id, author_id").eq("id", postId).single();
  if (!existing || !canEditPost(profile.role, existing.author_id, user.id)) redirect("/forbidden");

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    status: formData.get("status"),
  });

  if (!parsed.success) redirect(`/posts/${postId}/edit?error=Invalid%20post%20data`);

  const baseSlug = slugify(parsed.data.title);
  const slug = await ensureUniqueSlug(baseSlug || "post", postId);

  const { error } = await supabase
    .from("posts")
    .update({
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      status: parsed.data.status,
    })
    .eq("id", postId);

  if (error) redirect(`/posts/${slug}/edit?error=${encodeURIComponent(error.message)}`);
  redirect(`/posts/${slug}`);
}
