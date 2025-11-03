// scripts/csv-to-json.mjs
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

// --- CONFIGURATION ---
// ❗️ 1. Set the path to your source CSV file
const CSV_FILE_PATH = './data/articles.csv'; 

// ❗️ 2. Set the path for the final JSON output
const JSON_OUTPUT_PATH = './data/articles.json'; 

// --- Helper: normalize header keys (trim, collapse spaces, lowercase, fix quotes)
const NBSP = /\u00A0/g;
function norm(s) {
  return String(s ?? "")
    .replace(NBSP, " ")
    .replace(/\s+/g, " ")
    .replace(/’/g, "'")         // curly apostrophe -> straight
    .trim()
    .toLowerCase();
}

// Return first non-empty value found among a list of header aliases
function pick(row, ...aliases) {
  for (const a of aliases) {
    // try exact
    if (row[a] != null && String(row[a]).trim() !== "") return row[a];
    // try normalized key match across row keys
    const want = norm(a);
    for (const k of Object.keys(row)) {
      if (norm(k) === want) {
        const v = row[k];
        if (v != null && String(v).trim() !== "") return v;
      }
    }
  }
  return "";
}

// Column aliases for resilience
const ALIASES = {
  title: ["Title"],
  author: ["Author"],
  citation: ["Citation"],
  journal: ["Journal Title", "Journal Title "], // trailing space variant
  url: ["URL"],
  doi: ["Article DOI if available", "DOI", "doi"],
  abstract: ["Abstract"],
  conclusion: ["Conclusion"],
  keywords: ["Keywords if provided by the article", "Keywords"],
  rq: ["Research Question(s)", "Research Questions"],
  answers: ["Answers", "Answers "],
  rqNotes: ["Research Question and Answer Note"],

  methods: ["Research Methods"],
  subMethods: ["Sub-research method types", "Sub-research method types "],

  // ← two columns you mentioned with spacing/duplication
  theories1: ["Research Theories", "Research Theories "],
  theories2: ["Research Theories  "],

  historical: ["Historical Research"],
  comparative: ["Is it comparative research"],
  interdisciplinary: ["Is it interdisciplinary research"],

  // DATA BLOCK (the ones we need)
  dataSourceId: ["Data Source Identification", " Data Source Identification "],
  authorsDataDesc: [
    "Author's Data Description",        // straight apostrophe
    "Author’s Data Description",        // curly apostrophe
    " Author's Data Description",       // leading space variant
  ],
  sourceDataset: ["Source Dataset"],

  notes: ["Additional Notes"],
  license: ["Article License Type", " Article License Type "],
};

// Split helpers
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
function yearFromCitation(cit) {
  const m = String(cit || "").match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}
function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Loads and parses the CSV file.
 * @param {string} filePath
 * @returns {Promise<object[]>}
 */
function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

/**
 * Main function to run the script
 */
async function run() {
  let rows;
  
  // --- 1. LOAD DATA ---
  try {
    rows = await loadCSV(CSV_FILE_PATH);
    console.log(`✅ Loaded ${rows.length} rows from ${CSV_FILE_PATH}`);
  } catch (err) {
    console.error(`❌ Error loading CSV: ${err.message}`);
    console.error('Did you set the CSV_FILE_PATH variable correctly?');
    return; // Stop the script
  }

  // --- 2. MAP DATA ---
  // This is your original mapping logic.
  // It now runs *after* 'rows' has been successfully loaded.
  const mapped = rows.map((r, i) => {
    const title = clean(pick(r, ...ALIASES.title));
    const authors = splitList(pick(r, ...ALIASES.author));
    const citation = clean(pick(r, ...ALIASES.citation));
    const journal = clean(pick(r, ...ALIASES.journal));
    const url = clean(pick(r, ...ALIASES.url));
    const doi = normalizeDOI(pick(r, ...ALIASES.doi));
    const abstract = clean(pick(r, ...ALIASES.abstract));
    const conclusion = clean(pick(r, ...ALIASES.conclusion));
    const keywords = splitList(pick(r, ...ALIASES.keywords));
    const methods = splitList(pick(r, ...ALIASES.methods));
    const subMethods = splitList(pick(r, ...ALIASES.subMethods));
    const theories = [
      ...splitList(pick(r, ...ALIASES.theories1)),
      ...splitList(pick(r, ...ALIASES.theories2)),
    ];

    const y = yearFromCitation(citation);

    const doiSlug = doi
      .replace(/^https?:\/\/doi\.org\//, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .replace(/(^-|-$)/g, "");

    const idBase =
      doiSlug ||
      slugify(`${title}-${y ?? ""}`) ||
      slugify(authors.join("-")) ||
      `item-${i + 1}`;

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
        questions: clean(pick(r, ...ALIASES.rq)),
        answers: clean(pick(r, ...ALIASES.answers)),
        notes: clean(pick(r, ...ALIASES.rqNotes)),
        historical: /^y/i.test(clean(pick(r, ...ALIASES.historical))),
        comparative: /^y/i.test(clean(pick(r, ...ALIASES.comparative))),
        interdisciplinary: /^y/i.test(clean(pick(r, ...ALIASES.interdisciplinary))),
      },
      // ✅ NESTED DATA with Author's Data Description
      data: {
        sourceIdentification: clean(pick(r, ...ALIASES.dataSourceId)),
        authorsDataDescription: clean(pick(r, ...ALIASES.authorsDataDesc)),
        sourceDataset: clean(pick(r, ...ALIASES.sourceDataset)),
      },
      notes: clean(pick(r, ...ALIASES.notes)),
      license: clean(pick(r, ...ALIASES.license)),
    };
  });

  // --- 3. WRITE JSON FILE ---
  try {
    // Ensure the output directory exists
    const outputDir = path.dirname(JSON_OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the file
    await fs.promises.writeFile(
      JSON_OUTPUT_PATH,
      JSON.stringify(mapped, null, 2)
    );
    console.log(`✅ Successfully saved ${mapped.length} items to ${JSON_OUTPUT_PATH}`);
  } catch (err) {
    console.error(`❌ Error writing JSON file: ${err.message}`);
    return;
  }

  // --- 4. (optional) REPORT ---
  const countWithDesc = mapped.filter(a => a.data?.authorsDataDescription).length;
  console.log(`ℹ️  Info: ${countWithDesc} items include "Author's Data Description".`);
}

// --- Run the script ---
run();