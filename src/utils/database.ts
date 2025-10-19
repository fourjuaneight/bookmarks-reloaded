import "server-only";

import { Pool } from "@neondatabase/serverless";

export type ArticleRow = {
  id?: number;
  title: string | null;
  creator: string | null;
  site: string | null;
  tags: string[] | null;
  url: string | null;
  archive: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
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

export async function getArticles(): Promise<ArticleRow[]> {
  const { rows } = await pool.query<ArticleRow>("SELECT * FROM articles");
  return rows;
}

export const dbPool = pool;
