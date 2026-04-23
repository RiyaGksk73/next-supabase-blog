import { createPostAction } from "@/app/actions/posts";
import { PostEditorForm } from "@/components/posts/post-editor-form";
import { requireRole } from "@/lib/auth";

export default async function NewPostPage() {
  await requireRole(["author", "admin"]);

  return (
    <section className="page gap-6">
      <h1 className="page-title text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create Post</h1>
      <PostEditorForm action={createPostAction} />
    </section>
  );
}
