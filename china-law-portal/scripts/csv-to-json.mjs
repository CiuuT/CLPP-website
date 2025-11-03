// scripts/csv-to-json.mjs
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const SRC = path.resolve("data", "articles.csv");
const DEST = path.resolve("data", "articles.json");

/** fix mojibake & tidy text */
function clean(s) {
  let v = String(s ?? "");
  v = v
    .replace(/\u00A0/g, " ")       // NBSP -> space
    .replace(/\s+/g, " ")          // collapse whitespace
    // common mojibake seen in your sample:
    .replace(/\?\?/g, "’")         // ?? -> apostrophe
    .replace(/Lin\uFFFDs/gi, "Lin’s")
    .replace(/\u0092/g, "’")
    .replace(/\u2013|\u2014/g, "-")
    .trim();
  return v;
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function splitList(s) {
  return String(s || "")
    .split(/;|,|\band\b/gi)
    .map((x) => clean(x))
    .filter(Boolean);
}

function normalizeDOI(s) {
  const v = clean(s);
  if (!v) return "";
  if (/^10\./.test(v)) return `https://doi.org/${v}`;
  if (/^doi:\s*/i.test(v)) return `https://doi.org/${v.replace(/^doi:\s*/i, "")}`;
  if (/^https?:\/\//i.test(v)) return v;
  return v;
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

const csv = fs.readFileSync(SRC, "utf8");
const rows = parse(csv, {
  columns: true,           // first row = headers
  bom: true,               // handle BOM
  skip_empty_lines: true,
  relax_column_count: true,
  relax_quotes: true,
});

const COL = {
  title: "Title",
  author: "Author",
  citation: "Citation",
  journal: "Journal Title",
  url: "URL",
  doi: "Article DOI if available",
  abstract: "Abstract",
  conclusion: "Conclusion",
  keywords: "Keywords if provided by the article",
  rq: "Research Question(s)",
  answers: "Answers",
  rqNotes: "Research Question and Answer Note",
  methods: "Research Methods",
  subMethods: "Sub-research method types ",
  historical: "Historical Research",
  comparative: "Is it comparative research",
  interdisciplinary: "Is it interdisciplinary research",
  theories1: "Research Theories",
  theories2: "Research Theories",
  methodTheoryNotes: "Research Method/theories Notes",
  legalSourceType: "Type of Legal Sources",
  legalSourceCites: "Legal Sources Citations",
  policyDocs: " Policy documents",
  dataSourceId: "Data Source Identification",
  authorsDataDesc: "Author's Data Description",
  notes: "Additional Notes",
  sourceDataset: "Source Dataset",
  license: " Article License Type ",
};

function yearFromCitation(cit) {
  const m = String(cit || "").match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

const mapped = rows.map((r, i) => {
  const title = toTitleCase(clean(r[COL.title]));
  const authors = splitList(r[COL.author]);
  const citation = clean(r[COL.citation]);
  const journal = clean(r[COL.journal]);
  const url = clean(r[COL.url]);
  const doi = normalizeDOI(r[COL.doi]);
  const abstract = clean(r[COL.abstract]);
  const conclusion = clean(r[COL.conclusion]);
  const keywords = splitList(r[COL.keywords]);
  const methods = splitList(r[COL.methods]);
  const subMethods = splitList(r[COL.subMethods]);
  const theories = [...splitList(r[COL.theories1]), ...splitList(r[COL.theories2])];

  const y = yearFromCitation(citation);

  const doiSlug = doi.replace(/^https?:\/\/doi\.org\//, "")
    .replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/(^-|-$)/g, "");
  const idBase = doiSlug || slugify(`${title}-${y ?? ""}`) || slugify(authors.join("-")) || `item-${i+1}`;

  return {
    id: idBase,
    title,
    authors,
    journal,
    citation,
    year: y,
    url,
    doi,
    abstract,
    conclusion,
    keywords,
    methods,
    subMethods,
    theories,
    research: {
      questions: clean(r[COL.rq]),
      answers: clean(r[COL.answers]),
      notes: clean(r[COL.rqNotes]),
      historical: String(r[COL.historical] || "").trim().toLowerCase().startsWith("y"),
      comparative: String(r[COL.comparative] || "").trim().toLowerCase().startsWith("y"),
      interdisciplinary: String(r[COL.interdisciplinary] || "").trim().toLowerCase().startsWith("y"),
    },
    legalSources: {
      type: clean(r[COL.legalSourceType]),
      citations: clean(r[COL.legalSourceCites]),
      policyDocuments: clean(r[COL.policyDocs]),
    },
    data: {
      sourceIdentification: clean(r[COL.dataSourceId]),
      authorsDataDescription: clean(r[COL.authorsDataDesc]),
      sourceDataset: clean(r[COL.sourceDataset]),
    },
    notes: clean(r[COL.notes]),
    license: clean(r[COL.license]),
  };
});

// drop junk rows (no title & almost no content)
const filtered = mapped.filter(a => {
  if (!a.title || a.title.length < 3) return false;
  const hasAnyContent = a.abstract || a.citation || a.journal || a.url || (a.authors && a.authors.length);
  return !!hasAnyContent;
});

// ensure unique ids
const seen = new Set();
for (const a of filtered) {
  let id = a.id, n = 2;
  while (seen.has(id)) id = `${a.id}-${n++}`;
  seen.add(id);
  a.id = id;
}

fs.writeFileSync(DEST, JSON.stringify(filtered, null, 2), "utf8");
console.log(`Wrote ${filtered.length} items to data/articles.json`);
