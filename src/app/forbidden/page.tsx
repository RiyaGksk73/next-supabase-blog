import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <section className="card rounded-xl border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Forbidden</h1>
      <p className="muted text-gray-500 dark:text-gray-400">You do not have permission to access this page.</p>
      <Link className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" href="/">Go back home</Link>
    </section>
  );
}
