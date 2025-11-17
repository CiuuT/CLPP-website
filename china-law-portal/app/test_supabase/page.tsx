// app/test_supabase/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

const TABLE_NAME = "test";

type ArticleRow = {
  id: number;
  [key: string]: any; // 其它列用索引访问
};

function extractYearFromCitation(
  citation: string | null | undefined
): string | null {
  if (!citation) return null;
  const match = citation.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
}

export default async function TestSupabaseListPage() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return (
      <div className="min-h-screen bg-white text-zinc-900">
        <main className="mx-auto max-w-3xl px-6 py-24">
          <p className="text-red-600">Error: {error.message}</p>
        </main>
      </div>
    );
  }

  const articles = (data ?? []) as ArticleRow[];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-24">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Test Supabase Articles
          </h1>
          <p className="max-w-prose text-zinc-600">
            Data loaded from Supabase table &quot;{TABLE_NAME}&quot;.
          </p>
        </header>

        <section className="space-y-4">
          {articles.map((row) => {
            const title = row["Title"] as string | null | undefined;
            const author = row["Author"] as string | null | undefined;
            const citation = row["Citation"] as string | null | undefined;
            const journalTitle = row["Journal Title"] as
              | string
              | null
              | undefined;
            const abstract = row["Abstract"] as string | null | undefined;
            const year = extractYearFromCitation(citation);
            const slug = String(row.id); // ✅ 统一用 id 做 slug

            return (
              <article
                key={row.id}
                className="rounded-lg border p-4 hover:bg-zinc-50 transition"
              >
                <h2 className="text-lg font-semibold">
                  <Link
                    href={`/test_supabase/${slug}`}
                    className="hover:underline"
                  >
                    {title || "(No title)"}
                  </Link>
                </h2>
                <p className="text-sm text-zinc-500">
                  {author}
                  {year ? ` · ${year}` : null}
                  {journalTitle ? ` · ${journalTitle}` : null}
                </p>
                {abstract && (
                  <p className="mt-2 text-sm text-zinc-700 line-clamp-3">
                    {abstract}
                  </p>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
