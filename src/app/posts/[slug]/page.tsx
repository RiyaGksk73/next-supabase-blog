import Link from "next/link";
import { notFound } from "next/navigation";
import { addCommentAction } from "@/app/actions/comments";
import { CommentList } from "@/components/comments/comment-list";
import { canEditPost, getCurrentUserWithProfile } from "@/lib/auth";
import { getCommentsByPostId } from "@/lib/comments";
import { canViewPost, getPostBySlug } from "@/lib/posts";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { user, profile } = await getCurrentUserWithProfile();
  const userRole = profile?.role ?? null;
  if (!canViewPost(post.status, userRole, post.author_id, user?.id)) notFound();

  const comments = await getCommentsByPostId(post.id);
  const editable = user && profile ? canEditPost(profile.role, post.author_id, user.id) : false;

  return (
    <section className="page gap-8">
      <article className="card page rounded-xl border border-gray-200 bg-white/95 text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
        <h1 className="page-title text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{post.title}</h1>
        <p className="muted text-gray-500 dark:text-gray-400" style={{ margin: 0 }}>
          By {post.profiles?.full_name ?? "Unknown"} | {new Date(post.created_at).toLocaleString()} | {post.status}
        </p>
        {post.summary && (
          <p className="summary-box post-summary text-gray-700 dark:text-gray-200">
            <strong>Summary:</strong> {post.summary}
          </p>
        )}
        <p className="content text-gray-800 dark:text-gray-200">{post.content}</p>
        {editable && (
          <div className="actions">
            <Link className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" href={`/posts/${post.slug}/edit`}>Edit Post</Link>
          </div>
        )}
      </article>

      <section className="page">
        <h2 className="section-title text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Comments</h2>
        <CommentList comments={comments} />

        {user ? (
          <form action={addCommentAction} className="card rounded-xl border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="slug" value={post.slug} />
            <label>
              Add a comment
              <textarea name="content" rows={3} required maxLength={1000} className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
            </label>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">Post Comment</button>
          </form>
        ) : (
          <p className="muted text-gray-500 dark:text-gray-400">
            <Link href="/login">Login</Link> to comment.
          </p>
        )}
      </section>
    </section>
  );
}
