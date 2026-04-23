import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { user, profile } = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, updated_at")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <section className="grid gap-6">
      <div className="card rounded-xl border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100" style={{ marginTop: 0 }}>Dashboard</h1>
        <p className="muted text-gray-500 dark:text-gray-400" style={{ marginBottom: 0 }}>Role: {profile?.role ?? "viewer"}</p>
      </div>

      {(profile?.role === "author" || profile?.role === "admin") && (
        <div className="card rounded-xl border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100"><Link className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" href="/posts/new">Create new post</Link></div>
      )}

      <div className="grid">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100" style={{ marginBottom: 0 }}>Your Posts</h2>
        {(posts ?? []).length === 0 && <p className="muted text-gray-500 dark:text-gray-400">You have not written any posts yet.</p>}
        {(posts ?? []).map((post) => (
          <article className="card rounded-xl border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100" key={post.id}>
            <p className="font-semibold text-gray-900 dark:text-gray-100" style={{ marginTop: 0 }}><Link href={`/posts/${post.slug}`}>{post.title}</Link></p>
            <p className="muted text-gray-500 dark:text-gray-400">Status: {post.status}</p>
            <div className="actions"><Link href={`/posts/${post.slug}/edit`}>Edit</Link></div>
          </article>
        ))}
      </div>
    </section>
  );
}
