"use client";

import { useState } from "react";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
  initial?: {
    title?: string;
    content?: string;
    summary?: string | null;
    status?: "draft" | "published";
  };
}

export function PostEditorForm({ action, initial }: Props) {
  const [content, setContent] = useState(initial?.content ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerateSummary() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Failed to generate summary");
        return;
      }
      setSummary(data.summary ?? "");
    } catch {
      setError("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={action} className="card page rounded-xl border border-gray-200 bg-white/95 text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
      <label>
        Title
        <input name="title" defaultValue={initial?.title ?? ""} required maxLength={120} className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
      </label>

      <label>
        Content
        <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={14} required maxLength={20000} className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
      </label>

      <div className="actions">
        <button type="button" onClick={onGenerateSummary} disabled={loading || !content.trim()} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400">
          {loading ? "Generating..." : "Generate AI Summary"}
        </button>
      </div>

      <label>
        Summary
        <textarea name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} placeholder="Optional summary" className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
      </label>

      <label>
        Status
        <select name="status" defaultValue={initial?.status ?? "draft"} className="rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400" style={{ margin: 0 }}>{error}</p>}
      <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">Save Post</button>
    </form>
  );
}
