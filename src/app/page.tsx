import { PostCard } from "@/components/posts/post-card";
import { getPublishedPosts } from "@/lib/posts";

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <section className="page gap-6">
      <h1 className="page-title text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Latest Posts</h1>
      {posts.length === 0 && <p className="muted text-gray-500 dark:text-gray-400">No published posts yet.</p>}
      <div className="post-list">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}
