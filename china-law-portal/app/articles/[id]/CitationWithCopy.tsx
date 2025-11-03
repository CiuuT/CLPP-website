// app/articles/[id]/CitationWithCopy.tsx
"use client";

import { useState } from "react";

export function CitationWithCopy({ citation }: { citation: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  return (
    <div className="mt-2 flex items-start gap-2">
      <p className="flex-1 text-xs text-zinc-500">{citation}</p>
      <button
        onClick={handleCopy}
        className="rounded border px-2 py-1 text-[11px] text-zinc-700 hover:bg-zinc-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
