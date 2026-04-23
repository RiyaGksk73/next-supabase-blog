import Link from "next/link";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="card post-card page rounded-xl border border-gray-200 bg-white/95 text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
      <div>
        <h2 className="post-card-title text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="muted text-sm text-gray-500 dark:text-gray-400" style={{ margin: 0 }}>
          By {post.profiles?.full_name ?? "Unknown"} on {new Date(post.created_at).toLocaleDateString()}
        </p>
      </div>
      <p className="post-summary text-gray-700 dark:text-gray-300">{post.summary ?? `${post.content.slice(0, 180)}...`}</p>
      <Link className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" href={`/posts/${post.slug}`}>Read more</Link>
    </article>
  );
}
