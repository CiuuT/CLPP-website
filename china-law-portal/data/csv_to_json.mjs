import fs from "fs";
import path from "path";
import csv from "csv-parser";

const inputFile = path.resolve("articles_spring_2026_clean.csv");
const outputFile = path.resolve("articles.json");

const columnMap = {
  "Article ID": "id",
  "Title": "title",
  "Authors": "authors",
  "Year": "year",
  "Citation": "citation",
  "Journal Title": "journalTitle",
  "URL": "url",
  "DOI": "doi",
  "Abstract": "abstract",
  "Conclusion": "conclusion",
  "Keywords": "keywords",
  "Research Questions": "researchQuestions",
  "Answers": "answers",
  "Research Methods": "researchMethods",
  "Sub-research method types": "subResearchMethodTypes",
  "Historical Research": "historicalResearch",
  "Comparative Research": "comparativeResearch",
  "Interdisciplinary Research": "interdisciplinaryResearch",
  "Research Theories (relied on)": "researchTheoriesReliedOn",
  "Research Theories (critiqued)": "researchTheoriesCritiqued",
  "Type of Legal Sources": "typeOfLegalSources",
  "Legal Sources Citations": "legalSourcesCitations",
  "Policy documents": "policyDocuments",
  "Data Source Identification": "dataSourceIdentification",
  "Author's Data Description": "authorsDataDescription",
  "Accessibility": "accessibility",
  "Data Accessibility Link": "dataAccessibilityLink",
  "Source Dataset": "sourceDataset",
  "Article License Type": "articleLicenseType",
  "AI Summaries": "aiSummaries",
  "AI Data Description": "aiDataDescription",
};

function cleanValue(value) {
  if (value === undefined || value === null) return null;

  const trimmed = String(value).trim();

  if (trimmed === "") return null;
  if (trimmed.toLowerCase() === "nan") return null;

  return trimmed;
}

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv({
      mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim(),
    })
  )
  .on("data", (row) => {
    const mappedRow = {};

    for (const [csvKey, jsonKey] of Object.entries(columnMap)) {
      mappedRow[jsonKey] = cleanValue(row[csvKey]);
    }

    if (mappedRow.id !== null) {
      mappedRow.id = String(mappedRow.id);
    }

    results.push(mappedRow);
  })
  .on("end", () => {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf-8");
    console.log(`Done: ${outputFile} created with ${results.length} records.`);
  })
  .on("error", (err) => {
    console.error("Error reading CSV:", err);
  });
