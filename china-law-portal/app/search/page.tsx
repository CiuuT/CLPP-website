"use client";

import { useMemo, useState } from "react";
import data from "@/data/articles.json";

type Article = {
  id: string;
  title: string;
  authors?: string[];
  journal?: string;
  year?: number | string | null;
  abstract?: string;
  summary?: string;
  methods?: string[];
  keywords?: string[];
  research?: {
    historical?: boolean;
    comparative?: boolean;
    interdisciplinary?: boolean;
  };
  sourceDataset?: string;
  data?: { sourceDataset?: string };
};

function uniqSorted<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)).sort((a: any, b: any) =>
    String(a).localeCompare(String(b))
  );
}
// read Source Dataset from either shape
function getDataset(a: Article): string | undefined {
  return a.sourceDataset || a.data?.sourceDataset || undefined;
}

export default function SearchPage() {
  const articles = data as Article[];

  // ---------- build facet options ----------
  const { years, authors, journals, methods, datasets } = useMemo(() => {
    const y = new Set<number>();
    const a = new Set<string>();
    const j = new Set<string>();
    const m = new Set<string>();
    const t = new Set<string>();

    for (const it of articles) {
      if (it.year && Number(it.year)) y.add(Number(it.year));
      (it.authors || []).forEach((x) => x && a.add(x));
      if (it.journal) j.add(it.journal);
      (it.methods || []).forEach((x) => x && m.add(x));
      const ds = getDataset(it);
      if (ds) t.add(ds);
    }
    return {
      years: Array.from(y).sort((A, B) => B - A),
      authors: uniqSorted(Array.from(a)),
      journals: uniqSorted(Array.from(j)),
      methods: uniqSorted(Array.from(m)),
      datasets: uniqSorted(Array.from(t)),
    };
  }, [articles]);

  // ---------- filter state ----------
  const [q, setQ] = useState("");
  const [year, setYear] = useState("all");
  const [author, setAuthor] = useState("all");
  const [journal, setJournal] = useState("all");
  const [method, setMethod] = useState("all");
  const [dataset, setDataset] = useState("all");
  const [onlyHistorical, setOnlyHistorical] = useState(false);
  const [onlyComparative, setOnlyComparative] = useState(false);
  const [onlyInterdisciplinary, setOnlyInterdisciplinary] = useState(false);

  const clearFilters = () => {
    setQ("");
    setYear("all");
    setAuthor("all");
    setJournal("all");
    setMethod("all");
    setDataset("all");
    setOnlyHistorical(false);
    setOnlyComparative(false);
    setOnlyInterdisciplinary(false);
  };

  // ---------- filtering ----------
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();

    return articles.filter((a) => {
      // keyword search across common fields
      const hay = [
        a.title,
        a.abstract,
        a.summary,
        a.journal,
        ...(a.authors || []),
        ...(a.methods || []),
        ...(a.keywords || []),
        getDataset(a),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchQ = !kw || hay.includes(kw);
      const matchYear = year === "all" || String(a.year ?? "") === year;
      const matchAuthor =
        author === "all" || (a.authors || []).includes(author);
      const matchJournal = journal === "all" || a.journal === journal;
      const matchMethod =
        method === "all" || (a.methods || []).includes(method);
      const matchDataset =
        dataset === "all" || getDataset(a) === dataset;

      const r = a.research || {};
      const matchHistorical = !onlyHistorical || !!r.historical;
      const matchComparative = !onlyComparative || !!r.comparative;
      const matchInterdisc = !onlyInterdisciplinary || !!r.interdisciplinary;

      return (
        matchQ &&
        matchYear &&
        matchAuthor &&
        matchJournal &&
        matchMethod &&
        matchDataset &&
        matchHistorical &&
        matchComparative &&
        matchInterdisc
      );
    });
  }, [
    articles,
    q,
    year,
    author,
    journal,
    method,
    dataset,
    onlyHistorical,
    onlyComparative,
    onlyInterdisciplinary,
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Search Articles</h1>
      <p className="mt-1 text-sm text-zinc-600">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Keyword / title / author / theory / method / journal"
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All journals</option>
          {journals.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All methods</option>
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={dataset}
          onChange={(e) => setDataset(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All datasets</option>
          {datasets.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Research flags */}
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyHistorical}
            onChange={(e) => setOnlyHistorical(e.target.checked)}
          />
          Historical
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyComparative}
            onChange={(e) => setOnlyComparative(e.target.checked)}
          />
          Comparative
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyInterdisciplinary}
            onChange={(e) => setOnlyInterdisciplinary(e.target.checked)}
          />
          Interdisciplinary
        </label>

        <button
          onClick={clearFilters}
          className="ml-auto rounded-lg border px-3 py-1.5 hover:bg-zinc-50"
        >
          Clear filters
        </button>
      </div>

      {/* Results */}
      <ul className="mt-6 space-y-4">
        {results.map((a) => (
          <li key={a.id} className="rounded-2xl border p-5">
            <a href={`/articles/${a.id}`} className="text-lg font-semibold hover:underline">
              {a.title}
            </a>
            <p className="mt-1 text-sm text-zinc-700">
              {(a.authors || []).join("; ")}{" "}
              {a.year ? `· ${a.year}` : ""} {a.journal ? `· ${a.journal}` : ""}
            </p>
            {a.abstract && (
              <p className="mt-2 text-sm text-zinc-700 line-clamp-3">{a.abstract}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              {getDataset(a) && (
                <span className="rounded-full border bg-zinc-50 px-2 py-0.5">
                  {getDataset(a)}
                </span>
              )}
              {(a.methods || []).slice(0, 3).map((m) => (
                <span key={m} className="rounded-full border bg-zinc-50 px-2 py-0.5 text-[11px]">
                  {m}
                </span>
              ))}
            </div>
          </li>
        ))}
        {results.length === 0 && (
          <p className="text-sm text-zinc-600">No results. Try different filters.</p>
        )}
      </ul>
    </section>
  );
}
