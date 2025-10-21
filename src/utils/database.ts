import "server-only";

import { Pool } from "@neondatabase/serverless";
import { unstable_cache } from "next/cache";

import {
  DEFAULT_ARTICLE_SORT_DIRECTION,
  DEFAULT_ARTICLE_SORT_FIELD,
  type ArticleRow,
  type ArticleSortDirection,
  type ArticleSortField,
  isArticleSortField,
  normalizeArticleSortDirection,
} from "./articles";

const SORT_COLUMN_SQL: Record<ArticleSortField, string> = {
  title: "LOWER(COALESCE(title, ''))",
  creator: "LOWER(COALESCE(creator, ''))",
  site: "LOWER(COALESCE(site, ''))",
  tags: "LOWER(COALESCE(array_to_string(tags, ', '), ''))",
};

declare global {
  var __neonPool__: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const pool = globalThis.__neonPool__ ?? new Pool({ connectionString });

if (!globalThis.__neonPool__) {
  globalThis.__neonPool__ = pool;
}

export async function getArticles(options: {
  sortBy?: ArticleSortField;
  sortDirection?: ArticleSortDirection;
} = {}): Promise<ArticleRow[]> {
  const sortField = options.sortBy ?? DEFAULT_ARTICLE_SORT_FIELD;
  const orderExpression =
    SORT_COLUMN_SQL[
      isArticleSortField(sortField)
        ? sortField
        : DEFAULT_ARTICLE_SORT_FIELD
    ];
  const direction = normalizeArticleSortDirection(
    options.sortDirection,
    DEFAULT_ARTICLE_SORT_DIRECTION,
  );
  const directionSql = direction === "asc" ? "ASC" : "DESC";

  const queryText = `SELECT * FROM articles ORDER BY ${orderExpression} ${directionSql}, title ASC`;
  const { rows } = await pool.query<ArticleRow>(queryText);
  return rows;
}

export const getArticlesCached = unstable_cache(
  async (options: {
    sortBy?: ArticleSortField;
    sortDirection?: ArticleSortDirection;
  } = {}) => getArticles(options),
  ["articles"],
  {
    revalidate: 3600,
    tags: ["articles"],
  },
);

export const dbPool = pool;
