import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

export async function getCurrentUserWithProfile() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { user: null, profile: null as Profile | null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userData.user.id)
    .single();

  return { user: userData.user, profile: (profile as Profile) ?? null };
}

export async function requireAuth() {
  const { user, profile } = await getCurrentUserWithProfile();
  if (!user) {
    redirect("/login");
  }
  return { user, profile };
}

export async function requireRole(allowed: Role[]) {
  const { user, profile } = await requireAuth();
  if (!profile || !allowed.includes(profile.role)) {
    redirect("/forbidden");
  }
  return { user, profile };
}

export function canEditPost(role: Role, authorId: string, userId: string) {
  return role === "admin" || (role === "author" && authorId === userId);
}
