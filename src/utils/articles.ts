export type ArticleRow = {
  title: string | null;
  creator: string | null;
  site: string | null;
  tags: string[] | null;
  url: string | null;
  archive: string | null;
};

export const ARCHIVE_LINK = `${process.env.BLOB_URL}/${process.env.ARTICLES_PATH}/`;

export const ARTICLE_SORTABLE_FIELDS = [
  "title",
  "creator",
  "site",
  "tags",
] as const;

export type ArticleSortField = (typeof ARTICLE_SORTABLE_FIELDS)[number];
export type ArticleSortDirection = "asc" | "desc";

export const DEFAULT_ARTICLE_SORT_FIELD: ArticleSortField = "title";
export const DEFAULT_ARTICLE_SORT_DIRECTION: ArticleSortDirection = "asc";

// Validate arbitrary input from query params before using it for sorting.
export function isArticleSortField(value: unknown): value is ArticleSortField {
  return (
    typeof value === "string" &&
    ARTICLE_SORTABLE_FIELDS.includes(value as ArticleSortField)
  );
}

// Coerce untrusted input to a supported sort direction while preserving the fallback.
export function normalizeArticleSortDirection(
  value: unknown,
  fallback: ArticleSortDirection = DEFAULT_ARTICLE_SORT_DIRECTION
): ArticleSortDirection {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.toLowerCase();
  if (normalized === "asc" || normalized === "desc") {
    return normalized;
  }

  return fallback;
}

const collator = new Intl.Collator("en", {
  sensitivity: "base",
  usage: "sort",
  numeric: false,
});

function normalizeString(value: string | null | undefined): string {
  // Standardize strings for case-insensitive comparisons.
  return value?.trim().toLowerCase() ?? "";
}

function extractComparableValue(
  article: ArticleRow,
  field: ArticleSortField,
): string {
  // Derive the string we can safely compare for the requested column.
  switch (field) {
    case "title":
      return normalizeString(article.title);
    case "creator":
      return normalizeString(article.creator);
    case "site":
      return normalizeString(article.site);
    case "tags":
      if (Array.isArray(article.tags)) {
        return normalizeString(article.tags.join(", "));
      }
      return normalizeString(article.tags ?? "");
    default:
      return "";
  }
}

function buildFallbackKey(article: ArticleRow): string {
  // Produce a stable fallback key to keep ordering deterministic.
  const primary = normalizeString(article.title);
  const byUrl = normalizeString(article.url);
  const byArchive = normalizeString(article.archive);
  return `${primary}::${byUrl}::${byArchive}`;
}

export function sortArticlesData(
  articles: ArticleRow[],
  field: ArticleSortField,
  direction: ArticleSortDirection,
): ArticleRow[] {
  // Sort articles client side while mirroring the server side tie breakers.
  const directionMultiplier = direction === "asc" ? 1 : -1;

  return [...articles].sort((a, b) => {
    const aValue = extractComparableValue(a, field);
    const bValue = extractComparableValue(b, field);

    const comparison = collator.compare(String(aValue), String(bValue));
    if (comparison !== 0) {
      return comparison * directionMultiplier;
    }

    const fallbackComparison = collator.compare(
      buildFallbackKey(a),
      buildFallbackKey(b),
    );

    if (fallbackComparison !== 0) {
      return fallbackComparison * directionMultiplier;
    }

    return 0;
  });
}
