"use client";

import { useMemo, useState } from "react";
import data from "@/data/articles.json";

type Article = {
  id: string | number | null;
  title: string;
  authors?: string | null;
  year?: string | number | null;
  abstract?: string | null;
  conclusion?: string | null;
  keywords?: string | null;
  researchMethods?: string | null;
};

function uniqSorted(arr: string[]): string[] {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

function splitMultiValue(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/;|,|\|/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function SearchPage() {
  const articles = data as unknown as Article[];

  // search inputs
  const [titleQuery, setTitleQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const [keywordQuery, setKeywordQuery] = useState("");

  // filters
  const [year, setYear] = useState("all");
  const [method, setMethod] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");

  const { years, methods, authors } = useMemo(() => {
    const yearSet = new Set<string>();
    const methodSet = new Set<string>();
    const authorSet = new Set<string>();

    for (const a of articles) {
      if (a.year != null && String(a.year).trim() !== "") {
        yearSet.add(String(a.year));
      }

      splitMultiValue(a.researchMethods).forEach((m) => methodSet.add(m));
      splitMultiValue(a.authors).forEach((x) => authorSet.add(x));
    }

    return {
      years: Array.from(yearSet).sort((a, b) => Number(b) - Number(a)),
      methods: uniqSorted(Array.from(methodSet)),
      authors: uniqSorted(Array.from(authorSet)),
    };
  }, [articles]);

  const clearFilters = () => {
    setTitleQuery("");
    setAuthorQuery("");
    setKeywordQuery("");
    setYear("all");
    setMethod("all");
    setAuthorFilter("all");
  };

  const results = useMemo(() => {
    const tq = titleQuery.trim().toLowerCase();
    const aq = authorQuery.trim().toLowerCase();
    const kq = keywordQuery.trim().toLowerCase();

    return articles.filter((a) => {
      const authorList = splitMultiValue(a.authors);
      const methodList = splitMultiValue(a.researchMethods);
      const keywordList = splitMultiValue(a.keywords);

      const titleText = (a.title || "").toLowerCase();
      const authorText = authorList.join(" ").toLowerCase();
      const keywordText = [
        ...keywordList,
        a.abstract || "",
        a.conclusion || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchTitle = !tq || titleText.includes(tq);
      const matchAuthorSearch = !aq || authorText.includes(aq);
      const matchKeyword = !kq || keywordText.includes(kq);

      const matchYear = year === "all" || String(a.year ?? "") === year;
      const matchMethod =
        method === "all" || methodList.includes(method);
      const matchAuthorFilter =
        authorFilter === "all" || authorList.includes(authorFilter);

      return (
        matchTitle &&
        matchAuthorSearch &&
        matchKeyword &&
        matchYear &&
        matchMethod &&
        matchAuthorFilter
      );
    });
  }, [articles, titleQuery, authorQuery, keywordQuery, year, method, authorFilter]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Search Articles</h1>
      <p className="mt-1 text-sm text-zinc-600">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      {/* search inputs */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          value={titleQuery}
          onChange={(e) => setTitleQuery(e.target.value)}
          placeholder="Search by title"
          className="rounded-lg border px-3 py-2"
        />
        <input
          value={authorQuery}
          onChange={(e) => setAuthorQuery(e.target.value)}
          placeholder="Search by author"
          className="rounded-lg border px-3 py-2"
        />
        <input
          value={keywordQuery}
          onChange={(e) => setKeywordQuery(e.target.value)}
          placeholder="Search by keyword, abstract, conclusion"
          className="rounded-lg border px-3 py-2"
        />
      </div>

      {/* filters */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All research methods</option>
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <button
          onClick={clearFilters}
          className="rounded-lg border px-3 py-1.5 hover:bg-zinc-50"
        >
          Clear all
        </button>
      </div>

      {/* results */}
      <ul className="mt-6 space-y-4">
        {results.map((a, idx) => {
          const authorList = splitMultiValue(a.authors);
          const methodList = splitMultiValue(a.researchMethods);

          return (
            <li
              key={a.id ?? `${a.title}-${idx}`}
              className="rounded-2xl border p-5"
            >
              {a.id != null ? (
                <a
                  href={`/articles/${a.id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {a.title}
                </a>
              ) : (
                <span className="text-lg font-semibold">{a.title}</span>
              )}

              <p className="mt-1 text-sm text-zinc-700">
                {authorList.length ? authorList.join("; ") : "N/A"}
                {a.year ? ` · ${a.year}` : ""}
              </p>

              {a.abstract && (
                <p className="mt-2 line-clamp-3 text-sm text-zinc-700">
                  {a.abstract}
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {methodList.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    className="rounded-full border bg-zinc-50 px-2 py-0.5"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </li>
          );
        })}

        {results.length === 0 && (
          <p className="text-sm text-zinc-600">
            No results. Try different search terms or filters.
          </p>
        )}
      </ul>
    </section>
  );
}