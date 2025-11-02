import Link from "next/link";

type Article = {
  id: string;
  title: string;
  authors?: string[];
  abstract?: string;
};

export default function ArticleCard({ a }: { a: Article }) {
  const authors = (a.authors || []).filter(Boolean).join("; ");

  return (
    <Link
      href={`/articles/${a.id}`}
      className="
        block rounded-2xl border bg-white p-5 transition
        hover:shadow-md hover:border-zinc-300/80
        focus:outline-none focus:ring-2 focus:ring-blue-600/30
      "
    >
      <h2 className="text-lg font-semibold leading-snug">{a.title}</h2>
      {authors && (
        <p className="mt-1 text-sm text-zinc-700">{authors}</p>
      )}
      {a.abstract && (
        <p className="mt-3 text-sm text-zinc-700 line-clamp-3">
          {a.abstract}
        </p>
      )}
    </Link>
  );
}
