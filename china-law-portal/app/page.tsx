import Link from "next/link";

export default function Home() {
  return (
    
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight">
          China Law & Policy Portal
        </h1>
        <p className="max-w-prose text-zinc-600">
          A searchable collection of English-language academic papers about
          Chinese law and policy. Powered by AI metadata extraction.
        </p>
        <div className="flex gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
          >
            Start Searching
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border px-4 py-2 hover:bg-zinc-50"
          >
            GitHub
          </a>
        </div>
        <ul className="mt-10 grid gap-3">
          <li className="text-sm text-zinc-700">• Keyword / author / year filters</li>
          <li className="text-sm text-zinc-700">• Detail pages with source/PDF links</li>
          <li className="text-sm text-zinc-700">• Chicago/Bluebook export (soon)</li>
        </ul>
      </main>
    </div>
  
  );
}

