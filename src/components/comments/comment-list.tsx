import type { Comment } from "@/lib/types";

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) return <p className="muted">No comments yet.</p>;

  return (
    <div className="grid">
      {comments.map((comment) => (
        <article className="card rounded-xl border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100" key={comment.id}>
          <p className="text-gray-800 dark:text-gray-200" style={{ marginTop: 0 }}>{comment.content}</p>
          <p className="muted text-sm text-gray-500 dark:text-gray-400" style={{ marginBottom: 0 }}>
            {comment.profiles?.full_name ?? "Unknown"} on {new Date(comment.created_at).toLocaleString()}
          </p>
        </article>
      ))}
    </div>
  );
}
