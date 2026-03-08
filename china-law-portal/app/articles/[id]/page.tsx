// app/articles/[id]/page.tsx
import data from "@/data/articles.json";
import { CitationWithCopy } from "./CitationWithCopy";

type Article = {
  id: string | number | null;
  title: string;
  authors?: string | null;
  year?: string | null;
  citation?: string | null;
  journalTitle?: string | null;
  url?: string | null;
  doi?: string | null;
  abstract?: string | null;
  conclusion?: string | null;
  keywords?: string | null;
  researchQuestions?: string | null;
  answers?: string | null;
  researchMethods?: string | null;
  subResearchMethodTypes?: string | null;
  historicalResearch?: string | boolean | null;
  comparativeResearch?: string | boolean | null;
  interdisciplinaryResearch?: string | boolean | null;
  researchTheoriesReliedOn?: string | null;
  researchTheoriesCritiqued?: string | null;
  typeOfLegalSources?: string | null;
  legalSourcesCitations?: string | null;
  policyDocuments?: string | null;
  dataSourceIdentification?: string | null;
  authorsDataDescription?: string | null;
  accessibility?: string | null;
  dataAccessibilityLink?: string | null;
  sourceDataset?: string | null;
  articleLicenseType?: string | null;
  aiSummaries?: string | null;
  aiDataDescription?: string | null;
};

function splitToTags(value?: string | null) {
  if (!value) return [];

  return value
    .split(/;|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function displayValue(value?: string | boolean | null) {
  if (value == null) return "N/A";
  if (typeof value === "string" && value.trim() === "") return "N/A";
  return String(value);
}

function hasDisplayValue(value?: string | boolean | null) {
  if (value == null) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
}

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;              
  const decoded = decodeURIComponent(id);

  const articles = data as unknown as Article[];
  const a = articles.find((x) => String(x.id) === decoded);

  if (!a) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-red-600">Article Not Found</h1>
        <p className="mt-4 text-lg">Could not find an article with ID: {decoded}</p>
        <a href="/articles" className="mt-6 inline-block hover:underline">← Back to Articles</a>
      </div>
    );
  }

  const authors = a.authors ?? "";
  const keywordList = splitToTags(a.keywords);

  const display = {
  research: {
    questions: a.researchQuestions,
    answers: a.answers,
    methods: a.researchMethods,
    subMethods: a.subResearchMethodTypes,
    historical: a.historicalResearch,
    comparative: a.comparativeResearch,
    interdisciplinary: a.interdisciplinaryResearch,
    theoriesReliedOn: a.researchTheoriesReliedOn,
    theoriesCritiqued: a.researchTheoriesCritiqued,
  },
  legalSources: {
    type: a.typeOfLegalSources,
    citations: a.legalSourcesCitations,
    policyDocuments: a.policyDocuments,
  },
  data: {
    sourceIdentification: a.dataSourceIdentification,
    authorsDataDescription: a.authorsDataDescription,
    accessibility: a.accessibility,
    dataAccessibilityLink: a.dataAccessibilityLink,
    sourceDataset: a.sourceDataset,
  },
  ai: {
    summaries: a.aiSummaries,
    dataDescription: a.aiDataDescription,
  }, };

  const doiHref =
    a.doi && a.doi.startsWith("http") 
      ? a.doi 
      : a.doi 
        ? `https://doi.org/${a.doi}` 
        : null;
  
    return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">{a.title}</h1>

      <p className="mt-1 text-sm text-zinc-700">
        {authors || "N/A"}
        {a.year ? ` · ${a.year}` : " · N/A"}
        {a.journalTitle ? ` · ${a.journalTitle}` : " · N/A"}
      </p>

      {a.citation ? (
        <CitationWithCopy citation={a.citation} />
      ) : (
        <div className="mt-3 text-sm text-zinc-500">Citation: N/A</div>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <a href="/articles" className="hover:underline">
          ← Back
        </a>

        {a.url ? (
          <a href={a.url} target="_blank" rel="noreferrer" className="hover:underline">
            Source ↗
          </a>
        ) : (
          <span className="text-zinc-500">Source: N/A</span>
        )}

        {doiHref ? (
          <a href={doiHref} target="_blank" rel="noreferrer" className="hover:underline">
            DOI ↗
          </a>
        ) : (
          <span className="text-zinc-500">DOI: N/A</span>
        )}
      </div>

      <>
        <h2 className="mt-8 text-lg font-semibold">Abstract</h2>
        <p className="mt-2 whitespace-pre-wrap">{displayValue(a.abstract)}</p>
      </>

      <>
        <h2 className="mt-8 text-lg font-semibold">Conclusion</h2>
        <p className="mt-2 whitespace-pre-wrap">{displayValue(a.conclusion)}</p>
      </>

      <>
        <h2 className="mt-8 text-lg font-semibold">Keywords</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {keywordList.length > 0 ? (
            keywordList.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border bg-zinc-50 px-3 py-1 text-sm text-zinc-700"
              >
                {keyword}
              </span>
            ))
          ) : (
            <span className="rounded-full border bg-zinc-50 px-3 py-1 text-sm text-zinc-500">
              N/A
            </span>
          )}
        </div>
      </>

      <details className="mt-8 rounded-lg border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-lg font-semibold">Research</summary>

        <div className="mt-3">
          <p className="mt-2 whitespace-pre-wrap">
            <strong>Questions:</strong> {displayValue(display.research.questions)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Answers:</strong> {displayValue(display.research.answers)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Methods:</strong> {displayValue(display.research.methods)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Sub-method Types:</strong> {displayValue(display.research.subMethods)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Theories Relied On:</strong> {displayValue(display.research.theoriesReliedOn)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Theories Critiqued:</strong> {displayValue(display.research.theoriesCritiqued)}
          </p>

          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <p>
              <strong>Historical Research:</strong> {displayValue(display.research.historical)}
            </p>
            <p>
              <strong>Comparative Research:</strong> {displayValue(display.research.comparative)}
            </p>
            <p>
              <strong>Interdisciplinary Research:</strong>{" "}
              {displayValue(display.research.interdisciplinary)}
            </p>
          </div>
        </div>
      </details>

      <details className="mt-8 rounded-lg border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-lg font-semibold">Legal Sources</summary>

        <div className="mt-3">
          <p className="mt-2 whitespace-pre-wrap">
            <strong>Type:</strong> {displayValue(display.legalSources.type)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Citations:</strong> {displayValue(display.legalSources.citations)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Policy Documents:</strong> {displayValue(display.legalSources.policyDocuments)}
          </p>
        </div>
      </details>

      <details className="mt-8 rounded-lg border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-lg font-semibold">Data</summary>

        <div className="mt-3">
          <p className="mt-2 whitespace-pre-wrap">
            <strong>Data Source Identification:</strong>{" "}
            {displayValue(display.data.sourceIdentification)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Author&apos;s Data Description:</strong>{" "}
            {displayValue(display.data.authorsDataDescription)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Accessibility:</strong> {displayValue(display.data.accessibility)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Data Accessibility Link:</strong>{" "}
            {hasDisplayValue(display.data.dataAccessibilityLink) ? (
              <a
                href={String(display.data.dataAccessibilityLink)}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {String(display.data.dataAccessibilityLink)}
              </a>
            ) : (
              "N/A"
            )}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>Source Dataset:</strong> {displayValue(display.data.sourceDataset)}
          </p>
        </div>
      </details>

      <details className="mt-8 rounded-lg border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-lg font-semibold">
          AI-generated Information
        </summary>

        <div className="mt-3">
          <p className="mt-2 whitespace-pre-wrap">
            <strong>AI Summaries:</strong> {displayValue(display.ai.summaries)}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            <strong>AI Data Description:</strong> {displayValue(display.ai.dataDescription)}
          </p>
        </div>
      </details>

      <details className="mt-8 rounded-lg border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-lg font-semibold">License</summary>

        <div className="mt-3">
          <p className="text-sm text-zinc-700">
            <strong>License:</strong> {displayValue(a.articleLicenseType)}
          </p>
        </div>
      </details>
    </article>
  );
}