// app/articles/page.tsx
import data from "@/data/articles.json";
import ArticleCard from "@/components/ArticleCard";

type Article = Parameters<typeof ArticleCard>[0]["a"];

// 🔑 Mark dynamic because output depends on ?page=
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArticlesPage({
  // Next 15/16: searchParams is a Promise in server components
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ✅ keep await (as you requested)
  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  // Use a stable array once, then paginate
  const all = (data as Article[]).filter(
    (a) => a?.title && a.title.trim().length > 2
  );

  const perPage = 50;
  const page = Math.max(1, Number(pageParam || 1));
  const total = all.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const items = all.slice(start, start + perPage);

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Articles</h1>
      <p className="mt-1 text-sm text-zinc-600">
        {total} total · page {page} / {pages}
      </p>

      <ul className="mt-6 space-y-4">
        {items.map((a) => (
          <li key={a.id}>
            <ArticleCard a={a} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <a
          href={`/articles?page=${Math.max(1, page - 1)}`}
          className={`rounded-lg border px-3 py-2 ${
            page === 1 ? "pointer-events-none opacity-40" : "hover:bg-zinc-50"
          }`}
          aria-disabled={page === 1}
        >
          ← Prev
        </a>
        <span className="text-sm text-zinc-600">Page {page} of {pages}</span>
        <a
          href={`/articles?page=${Math.min(pages, page + 1)}`}
          className={`rounded-lg border px-3 py-2 ${
            page === pages ? "pointer-events-none opacity-40" : "hover:bg-zinc-50"
          }`}
          aria-disabled={page === pages}
        >
          Next →
        </a>
      </div>
    </section>
  );
}
