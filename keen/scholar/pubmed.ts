/**
 * PubMed E-utilities client.
 *
 * Two-call flow:
 *   1. esearch.fcgi → list of PMIDs matching the query
 *   2. efetch.fcgi → abstract XML for those PMIDs
 *
 * No API key required for low volume (3 req/s). If NCBI_API_KEY is set the
 * limit rises to 10 req/s. Caller is responsible for rate-pacing across calls.
 */

const ESEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
const EFETCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";

export interface PubMedSearchInput {
  query: string;
  /** Default 10. Caps at 50 — keeps a single search bounded. */
  limit?: number;
  /** Last N years. Defaults to 10. */
  recency?: number;
}

export interface PubMedAbstract {
  pmid: string;
  title: string;
  abstract: string;
  journal: string;
  year: number | null;
  url: string;
}

function withKey(params: URLSearchParams): URLSearchParams {
  const key = process.env.NCBI_API_KEY;
  if (key) params.set("api_key", key);
  return params;
}

export async function searchPubMed(input: PubMedSearchInput): Promise<string[]> {
  const limit = Math.min(input.limit ?? 10, 50);
  const recency = input.recency ?? 10;
  const term = `(${input.query}) AND ("last ${recency} years"[PDat])`;

  const params = withKey(
    new URLSearchParams({
      db: "pubmed",
      term,
      retmode: "json",
      retmax: String(limit),
      sort: "relevance",
    }),
  );

  const res = await fetch(`${ESEARCH}?${params.toString()}`);
  if (!res.ok) return [];
  const data = (await res.json()) as { esearchresult?: { idlist?: string[] } };
  return data.esearchresult?.idlist ?? [];
}

export async function fetchAbstracts(pmids: string[]): Promise<PubMedAbstract[]> {
  if (pmids.length === 0) return [];
  const params = withKey(
    new URLSearchParams({
      db: "pubmed",
      id: pmids.join(","),
      retmode: "xml",
      rettype: "abstract",
    }),
  );
  const res = await fetch(`${EFETCH}?${params.toString()}`);
  if (!res.ok) return [];
  const xml = await res.text();
  return parseAbstractsXml(xml);
}

const TITLE_RE = /<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/;
const ABSTRACT_RE = /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g;
const JOURNAL_RE = /<Title>([^<]+)<\/Title>/;
const YEAR_RE = /<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/;
const PMID_RE = /<PMID[^>]*>([^<]+)<\/PMID>/;

function parseAbstractsXml(xml: string): PubMedAbstract[] {
  const articles = xml.split(/<PubmedArticle>/).slice(1);
  const out: PubMedAbstract[] = [];
  for (const block of articles) {
    const pmid = block.match(PMID_RE)?.[1]?.trim();
    if (!pmid) continue;
    const title = stripTags(block.match(TITLE_RE)?.[1] ?? "");
    const journal = stripTags(block.match(JOURNAL_RE)?.[1] ?? "");
    const yearMatch = block.match(YEAR_RE)?.[1];
    const year = yearMatch ? Number.parseInt(yearMatch, 10) : null;

    const parts: string[] = [];
    for (const m of block.matchAll(ABSTRACT_RE)) {
      parts.push(stripTags(m[1]));
    }
    const abstract = parts.join("\n").trim();

    if (!abstract) continue;

    out.push({
      pmid,
      title,
      abstract,
      journal,
      year,
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    });
  }
  return out;
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export interface HarvestedPaper {
  pmid: string;
  url: string;
  title: string;
  abstract: string;
  journal: string;
  year: number | null;
}

/** One-call helper used by ingest.ts. */
export async function harvestForTopic(
  topic: string,
  limit = 5,
): Promise<HarvestedPaper[]> {
  const ids = await searchPubMed({ query: topic, limit });
  if (ids.length === 0) return [];
  return fetchAbstracts(ids);
}
