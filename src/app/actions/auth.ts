"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2).max(80),
});

const roleSchema = z.enum(["viewer", "author", "admin"]);

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/login?error=Invalid%20credentials");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/signup?error=Invalid%20input");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: parsed.data.fullName,
      role: "viewer",
    });
  }

  redirect("/dashboard");
}

export async function updateUserRoleAction(formData: FormData) {
  await requireRole(["admin"]);

  const userId = String(formData.get("userId") ?? "");
  const parsedRole = roleSchema.safeParse(formData.get("role"));
  if (!userId || !parsedRole.success) redirect("/admin/users?error=Invalid%20request");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("profiles").update({ role: parsedRole.data }).eq("id", userId);
  if (error) redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);

  redirect("/admin/users?success=Role%20updated");
}
