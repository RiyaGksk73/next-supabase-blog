import { updateUserRoleAction } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  await requireRole(["admin"]);
  const params = await searchParams;

  const supabase = await createSupabaseServerClient();
  const { data: users } = await supabase.from("profiles").select("id, full_name, role").order("full_name", { ascending: true });

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100" style={{ margin: 0 }}>User Management</h1>
      {params.error && <p className="text-sm font-medium text-red-600 dark:text-red-400" style={{ margin: 0 }}>{params.error}</p>}
      {params.success && <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400" style={{ margin: 0 }}>{params.success}</p>}

      <div className="grid">
        {(users ?? []).map((user) => (
          <form className="card rounded-xl border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100" action={updateUserRoleAction} key={user.id}>
            <input type="hidden" name="userId" value={user.id} />
            <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100" style={{ margin: 0 }}>{user.full_name ?? user.id}</p>
                <p className="muted text-gray-500 dark:text-gray-400" style={{ margin: 0 }}>{user.id}</p>
              </div>
              <div className="row">
                <select name="role" defaultValue={user.role} className="rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
                  <option value="viewer">viewer</option>
                  <option value="author">author</option>
                  <option value="admin">admin</option>
                </select>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">Update</button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
