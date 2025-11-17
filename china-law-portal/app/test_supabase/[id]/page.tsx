// app/test_supabase/[id]/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

const TABLE_NAME = "test";

type ArticleRow = {
  id: number;
  [key: string]: any;
};

function extractYearFromCitation(
  citation: string | null | undefined
): string | null {
  if (!citation) return null;
  const match = citation.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
}

export default async function TestSupabaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // URL 里的那一段，例如 "5"
  const numericId = Number(id);

  if (!Number.isFinite(numericId)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <p>Invalid id in URL: {id}</p>
      </main>
    );
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", numericId)
    .maybeSingle<ArticleRow>();

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

  if (!data) {
    return (
      <div className="min-h-screen bg-white text-zinc-900">
        <main className="mx-auto max-w-3xl px-6 py-24">
          <p>Article not found for id: {numericId}</p>
        </main>
      </div>
    );
  }

  const row = data;

  const title = row["Title"] as string | null | undefined;
  const author = row["Author"] as string | null | undefined;
  const citation = row["Citation"] as string | null | undefined;
  const journalTitle = row["Journal Title"] as
    | string
    | null
    | undefined;
  const url = row["URL"] as string | null | undefined;
  const doiRaw = row["Article DOI if available"] as
    | string
    | null
    | undefined;
  const abstract = row["Abstract"] as string | null | undefined;
  const conclusion = row["Conclusion"] as string | null | undefined;
  const researchMethods = row["Research Methods"] as
    | string
    | null
    | undefined;
  const subResearchMethods = row["Sub-research method types"] as
    | string
    | null
    | undefined;
  const researchQuestions = row["Research Question(s)"] as
    | string
    | null
    | undefined;
  const answers = row["Answers"] as string | null | undefined;
  const historical = row["Historical Research"] as
    | string
    | null
    | undefined;
  const comparative = row["comparative research"] as
    | string
    | null
    | undefined;
  const interdisciplinary = row["Interdisciplinary research"] as
    | string
    | null
    | undefined;
  const typeOfLegalSources = row["Type of Legal Sources"] as
    | string
    | null
    | undefined;
  const legalSourcesCitations = row["Legal Sources Citations"] as
    | string
    | null
    | undefined;
  const policyDocs = row["Policy documents"] as
    | string
    | null
    | undefined;
  const dataSourceId = row["Data Source Identification"] as
    | string
    | null
    | undefined;
  const authorsDataDesc = row["Author's Data Description"] as
    | string
    | null
    | undefined;
  const dataLink = row["Data Accessibility Link"] as
    | string
    | null
    | undefined;
  const sourceDataset = row["Source Dataset"] as
    | string
    | null
    | undefined;
  const licenseType = row["Article License Type"] as
    | string
    | null
    | undefined;

  const year = extractYearFromCitation(citation);

  // 构造干净的 DOI URL：如果已经是 http 就直接用，否则补上前缀
  let doiUrl: string | null = null;
  if (doiRaw) {
    if (doiRaw.startsWith("http")) {
      doiUrl = doiRaw;
    } else {
      doiUrl = `https://doi.org/${doiRaw}`;
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="text-sm text-zinc-600">
          {author}
          {year ? ` · ${year}` : null}
          {journalTitle ? ` · ${journalTitle}` : null}
        </p>

        {citation && (
          <p className="text-sm text-zinc-700">{citation}</p>
        )}

        <div className="flex gap-3 text-sm">
          <Link
            href="/test_supabase"
            className="text-zinc-600 hover:underline"
          >
            ← Back
          </Link>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:underline"
            >
              Source ↗
            </a>
          )}
          {doiUrl && (
            <a
              href={doiUrl}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:underline"
            >
              DOI ↗
            </a>
          )}
        </div>

        {abstract && (
          <section className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Abstract</h2>
            <p className="text-sm leading-relaxed">{abstract}</p>
          </section>
        )}

        {conclusion && (
          <section className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Conclusion</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {conclusion}
            </p>
          </section>
        )}

        {(researchMethods || subResearchMethods) && (
          <section className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Methods</h2>
            {researchMethods && (
              <p className="text-sm">{researchMethods}</p>
            )}
            {subResearchMethods && (
              <p className="text-sm text-zinc-700">
                {subResearchMethods}
              </p>
            )}
            {(historical || comparative || interdisciplinary) && (
              <p className="text-xs text-zinc-500">
                {historical && "Historical; "}
                {comparative && "Comparative; "}
                {interdisciplinary && "Interdisciplinary"}
              </p>
            )}
          </section>
        )}

        {(researchQuestions || answers) && (
          <section className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Research Q&amp;A</h2>
            {researchQuestions && (
              <p className="text-sm">
                <span className="font-medium">Questions: </span>
                {researchQuestions}
              </p>
            )}
            {answers && (
              <p className="text-sm">
                <span className="font-medium">Answers: </span>
                {answers}
              </p>
            )}
          </section>
        )}

        {(typeOfLegalSources || policyDocs || legalSourcesCitations) && (
          <section className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Legal Sources</h2>
            {typeOfLegalSources && (
              <p className="text-sm">
                <span className="font-medium">Type: </span>
                {typeOfLegalSources}
              </p>
            )}
            {policyDocs && (
              <p className="text-sm">
                <span className="font-medium">Policy docs: </span>
                {policyDocs}
              </p>
            )}
            {legalSourcesCitations && (
              <p className="text-sm">
                <span className="font-medium">Citations: </span>
                {legalSourcesCitations}
              </p>
            )}
          </section>
        )}

        {(sourceDataset ||
          dataSourceId ||
          authorsDataDesc ||
          dataLink ||
          licenseType) && (
          <section className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Data</h2>
            {sourceDataset && (
              <p className="text-sm">
                <span className="font-medium">Dataset: </span>
                {sourceDataset}
              </p>
            )}
            {dataSourceId && (
              <p className="text-sm">
                <span className="font-medium">Source: </span>
                {dataSourceId}
              </p>
            )}
            {authorsDataDesc && (
              <p className="text-sm">
                <span className="font-medium">Author&apos;s description: </span>
                {authorsDataDesc}
              </p>
            )}
            {dataLink && (
              <p className="text-sm">
                <span className="font-medium">Access: </span>
                <a
                  href={dataLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {dataLink}
                </a>
              </p>
            )}
            {licenseType && (
              <p className="text-xs text-zinc-500">
                License: {licenseType}
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
