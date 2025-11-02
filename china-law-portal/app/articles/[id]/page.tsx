// app/articles/[id]/page.tsx
import data from "@/data/articles.json";

type Article = {
  id: string;
  title: string;
  authors?: string[];
  journal?: string;
  citation?: string;
  year?: number | string | null;
  doi?: string;
  url?: string;
  abstract?: string;
  conclusion?: string;
  keywords?: string[];
  methods?: string[];
  subMethods?: string[];
  theories?: string[];
  research?: {
    questions?: string;
    answers?: string;
    notes?: string;
    historical?: boolean;
    comparative?: boolean;
    interdisciplinary?: boolean;
  };
  legalSources?: {
    type?: string;
    citations?: string;
    policyDocuments?: string;
  };
  data?: {
    sourceIdentification?: string;
    authorsDataDescription?: string;
    sourceDataset?: string;
  };
  notes?: string;
  license?: string;
};

export default async function ArticleDetail({
  params,
}: {
  // 👇 Next 15/16 can pass params as a Promise — we await it.
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;               // ✅ keep await (as you want)
  const decoded = decodeURIComponent(id);

  const a = (data as Article[]).find((x) => String(x.id) === decoded);

  if (!a) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-red-600">Article Not Found</h1>
        <p className="mt-4 text-lg">Could not find an article with ID: {decoded}</p>
        <a href="/articles" className="mt-6 inline-block hover:underline">← Back to Articles</a>
      </div>
    );
  }

  const authors = (a.authors || []).join("; ");

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">{a.title}</h1>
      <p className="mt-1 text-sm text-zinc-700">
        {authors} {a.year ? `· ${a.year}` : ""} {a.journal ? `· ${a.journal}` : ""}
      </p>
      {a.citation && <p className="mt-2 text-xs text-zinc-500">{a.citation}</p>}

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <a href="/articles" className="hover:underline">← Back</a>
        {a.url && <a className="hover:underline" href={a.url} target="_blank">Source ↗</a>}
        {a.doi && <a className="hover:underline" href={a.doi} target="_blank">DOI ↗</a>}
      </div>

      {a.abstract && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Abstract</h2>
          <p className="mt-2 whitespace-pre-wrap">{a.abstract}</p>
        </>
      )}

      {a.conclusion && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Conclusion</h2>
          <p className="mt-2 whitespace-pre-wrap">{a.conclusion}</p>
        </>
      )}

      {a.theories?.length ? (
        <>
          <h2 className="mt-8 text-lg font-semibold">Theories / Frameworks</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {a.theories.map((t) => (
              <span key={t} className="rounded-full border bg-zinc-50 px-2 py-0.5 text-[12px]">
                {t}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {(a.methods?.length || a.subMethods?.length) && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Methods</h2>
          {a.methods?.length ? <p className="mt-2 text-sm text-zinc-700">{a.methods.join("; ")}</p> : null}
          {a.subMethods?.length ? <p className="mt-2 text-sm text-zinc-700">{a.subMethods.join("; ")}</p> : null}
        </>
      )}

      {a.research && (a.research.questions || a.research.answers || a.research.notes) && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Research Q&A</h2>
          {a.research.questions && <p className="mt-2 whitespace-pre-wrap"><strong>Questions:</strong> {a.research.questions}</p>}
          {a.research.answers && <p className="mt-2 whitespace-pre-wrap"><strong>Answers:</strong> {a.research.answers}</p>}
          {a.research.notes && <p className="mt-2 whitespace-pre-wrap text-zinc-700"><strong>Notes:</strong> {a.research.notes}</p>}
          <div className="mt-3 text-sm text-zinc-700">
            {a.research.historical && <span className="mr-2 rounded-full bg-zinc-100 px-2 py-0.5">Historical</span>}
            {a.research.comparative && <span className="mr-2 rounded-full bg-zinc-100 px-2 py-0.5">Comparative</span>}
            {a.research.interdisciplinary && <span className="mr-2 rounded-full bg-zinc-100 px-2 py-0.5">Interdisciplinary</span>}
          </div>
        </>
      )}

      {(a.legalSources?.type || a.legalSources?.citations || a.legalSources?.policyDocuments) && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Legal Sources</h2>
          {a.legalSources?.type && <p className="mt-2"><strong>Type:</strong> {a.legalSources.type}</p>}
          {a.legalSources?.citations && <p className="mt-2 whitespace-pre-wrap"><strong>Citations:</strong> {a.legalSources.citations}</p>}
          {a.legalSources?.policyDocuments && <p className="mt-2 whitespace-pre-wrap"><strong>Policy docs:</strong> {a.legalSources.policyDocuments}</p>}
        </>
      )}

      {(a.data?.sourceIdentification || a.data?.authorsDataDescription || a.data?.sourceDataset) && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Data</h2>
          {a.data?.sourceIdentification && <p className="mt-2 whitespace-pre-wrap"><strong>Identification:</strong> {a.data.sourceIdentification}</p>}
          {a.data?.authorsDataDescription && <p className="mt-2 whitespace-pre-wrap"><strong>Author's description:</strong> {a.data.authorsDataDescription}</p>}
          {a.data?.sourceDataset && <p className="mt-2 whitespace-pre-wrap"><strong>Dataset:</strong> {a.data.sourceDataset}</p>}
        </>
      )}

      {(a.license || a.notes) && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Notes & License</h2>
          {a.notes && <p className="mt-2 whitespace-pre-wrap">{a.notes}</p>}
          {a.license && <p className="mt-2 text-sm text-zinc-700"><strong>License:</strong> {a.license}</p>}
        </>
      )}
    </article>
  );
}
