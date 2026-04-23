import { loginAction } from "@/app/actions/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <section className="page gap-6">
      <h1 className="page-title text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Login</h1>
      <form action={loginAction} className="card form-card rounded-xl border border-gray-200 bg-white/95 text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
        <label>
          Email
          <input type="email" name="email" required className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
        </label>
        <label>
          Password
          <input type="password" name="password" required minLength={8} className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
        </label>
        {params.error && <p className="text-sm font-medium text-red-600 dark:text-red-400" style={{ margin: 0 }}>{params.error}</p>}
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">Login</button>
      </form>
    </section>
  );
}
