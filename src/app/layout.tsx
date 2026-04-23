import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "InkStack",
  description: "Full-stack blogging platform with Next.js + Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (() => {
              try {
                const storedTheme = localStorage.getItem("theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme = storedTheme === "light" || storedTheme === "dark"
                  ? storedTheme
                  : prefersDark
                    ? "dark"
                    : "light";
                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              } catch (error) {
                document.documentElement.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
              }
            })();
          `}
        </Script>
        <NavBar />
        <main className="container page-shell">
          {children}
        </main>
      </body>
    </html>
  );
}
