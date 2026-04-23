import { notFound, redirect } from "next/navigation";
import { updatePostAction } from "@/app/actions/posts";
import { PostEditorForm } from "@/components/posts/post-editor-form";
import { canEditPost, requireRole } from "@/lib/auth";
import { getPostBySlug } from "@/lib/posts";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user, profile } = await requireRole(["author", "admin"]);
  const post = await getPostBySlug(slug);

  if (!post) notFound();
  if (!canEditPost(profile.role, post.author_id, user.id)) redirect("/forbidden");

  const action = updatePostAction.bind(null, post.id);

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100" style={{ margin: 0 }}>Edit Post</h1>
      <PostEditorForm action={action} initial={{ title: post.title, content: post.content, summary: post.summary, status: post.status }} />
    </section>
  );
}
