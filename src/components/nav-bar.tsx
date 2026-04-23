import Link from "next/link";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export async function NavBar() {
  const { user, profile } = await getCurrentUserWithProfile();

  return (
    <header className="site-header border-b border-gray-200/80 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
      <div className="container nav flex items-center justify-between gap-4 py-4">
        <Link href="/" className="brand text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
          InkStack
        </Link>
        <div className="flex items-center gap-3">
          <nav className="nav-links flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/">Posts</Link>
            {user && <Link href="/dashboard">Dashboard</Link>}
            {(profile?.role === "author" || profile?.role === "admin") && <Link href="/posts/new">Write</Link>}
            {profile?.role === "admin" && <Link href="/admin/users">Admin</Link>}
            {!user && <Link href="/login">Login</Link>}
            {!user && <Link href="/signup">Sign up</Link>}
            {user && (
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </form>
            )}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
