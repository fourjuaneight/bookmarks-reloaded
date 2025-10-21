export type ArticleRow = {
  title: string | null;
  creator: string | null;
  site: string | null;
  tags: string[] | null;
  url: string | null;
  archive: string | null;
};

export const ARTICLE_SORTABLE_FIELDS = [
  "title",
  "creator",
  "site",
  "tags",
] as const;

export type ArticleSortField = (typeof ARTICLE_SORTABLE_FIELDS)[number];
export type ArticleSortDirection = "asc" | "desc";

export const DEFAULT_ARTICLE_SORT_FIELD: ArticleSortField = "title";
export const DEFAULT_ARTICLE_SORT_DIRECTION: ArticleSortDirection = "desc";

export function isArticleSortField(value: unknown): value is ArticleSortField {
  return (
    typeof value === "string" &&
    ARTICLE_SORTABLE_FIELDS.includes(value as ArticleSortField)
  );
}

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
  return value?.trim().toLowerCase() ?? "";
}

function extractComparableValue(
  article: ArticleRow,
  field: ArticleSortField,
): string {
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
