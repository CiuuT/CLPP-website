"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import data from "@/data/articles.json";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // simple stats based on your JSON
  const articles = data as { journal?: string }[];
  const articleCount = articles.length;
  const journalCount = Array.from(
    new Set(articles.map((a) => a.journal).filter(Boolean))
  ).length;

  // animated counter for article count
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    const duration = 600; // ms
    const steps = 25;
    const stepTime = duration / steps;
    let current = 0;
    const increment = articleCount / steps;

    const id = setInterval(() => {
      current += increment;
      if (current >= articleCount) {
        setDisplayCount(articleCount);
        clearInterval(id);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(id);
  }, [articleCount]);

  // rotating subtitle
  const subtitles = [
    "Search by keyword, author, or year.",
    "Explore methods, theories, and datasets in Chinese law scholarship.",
    "Filter by topic and quickly scan abstracts.",
  ];
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % subtitles.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // search handler → /search?q=...
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight">
          China Law &amp; Policy Portal
        </h1>

        <p className="max-w-prose text-zinc-600">
          A searchable collection of English-language academic papers about
          Chinese law and policy. Powered by AI metadata extraction.
        </p>

        {/* rotating subtitle */}
        <p className="h-5 text-sm text-blue-700">
          {subtitles[subtitleIndex]}
        </p>

        {/* search bar with a tiny bit of motion */}
        <form
          onSubmit={handleSearch}
          className="mt-2 flex w-full max-w-xl gap-2 rounded-full border bg-zinc-50/80 px-3 py-2 shadow-sm backdrop-blur"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles — e.g. data protection, courts, environmental law..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
          >
            Search
          </button>
        </form>

        {/* buttons: same as before */}
        <div className="mt-4 flex gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
          >
            Start Searching
          </Link>
          <a
            href="https://github.com/CiuuT/CLPP-website"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border px-4 py-2 hover:bg-zinc-50"
          >
            GitHub
          </a>
        </div>

        {/* animated stats */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-700">
          <div className="rounded-xl border bg-zinc-50 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Articles
            </p>
            <p className="mt-1 text-lg font-semibold">
              {displayCount}
            </p>
          </div>
          <div className="rounded-xl border bg-zinc-50 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Journals
            </p>
            <p className="mt-1 text-lg font-semibold">
              {journalCount}
            </p>
          </div>
        </div>

        {/* feature list with subtle hover */}
        <ul className="mt-10 grid gap-3">
          {[
            "Keyword / author / year filters",
            "Detail pages with source/PDF links",
            "Chicago/Bluebook export (soon)",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center text-sm text-zinc-700 transition hover:translate-x-1"
            >
              <span className="mr-2 text-zinc-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
