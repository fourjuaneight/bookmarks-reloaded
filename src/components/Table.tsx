"use client";

import { useCallback, useEffect, useMemo } from "react";

import {
  type ArticleRow,
  type ArticleSortDirection,
  type ArticleSortField,
  sortArticlesData,
} from "@/utils/articles";
import { usePersistentState } from "@/hooks/usePersistentState";

interface TableProps {
  articles: ArticleRow[];
  initialSortField: ArticleSortField;
  initialSortDirection: ArticleSortDirection;
}

const SORTABLE_HEADERS: ReadonlyArray<{
  key: ArticleSortField;
  label: string;
}> = [
  { key: "title", label: "Title" },
  { key: "creator", label: "Creator" },
  { key: "site", label: "Site" },
  { key: "tags", label: "Tags" },
];

export function Table({
  articles,
  initialSortField,
  initialSortDirection,
}: TableProps) {
  const [sortField, setSortField] = usePersistentState<ArticleSortField>(
    "bookmarks-table:sort-field",
    initialSortField,
  );
  const [sortDirection, setSortDirection] = usePersistentState<ArticleSortDirection>(
    "bookmarks-table:sort-direction",
    initialSortDirection,
  );

  useEffect(() => {
    setSortField((current) =>
      current === initialSortField ? current : initialSortField,
    );
  }, [initialSortField, setSortField]);

  useEffect(() => {
    setSortDirection((current) =>
      current === initialSortDirection ? current : initialSortDirection,
    );
  }, [initialSortDirection, setSortDirection]);

  const sortedData = useMemo(
    () => sortArticlesData(articles, sortField, sortDirection),
    [articles, sortDirection, sortField],
  );

  const handleHeaderClick = useCallback(
    (field: ArticleSortField) => {
      if (field === sortField) {
        setSortDirection((prevDirection) =>
          prevDirection === "asc" ? "desc" : "asc",
        );
        return;
      }

      setSortField(field);
      setSortDirection("asc");
    },
    [setSortDirection, setSortField, sortField],
  );

  const activeSortLabel = useMemo(() => {
    const header = SORTABLE_HEADERS.find(({ key }) => key === sortField);
    if (!header) {
      return null;
    }

    return `${header.label} sorted ${
      sortDirection === "asc" ? "ascending" : "descending"
    }`;
  }, [sortDirection, sortField]);

  return (
    <section className="w-full">
      {activeSortLabel ? (
        <p className="sr-only" aria-live="polite">
          {activeSortLabel}
        </p>
      ) : null}
      <ul className="backdrop-blur bg-background border border-meta overflow-hidden rounded shadow-sm w-full">
        <li
          id="table-header"
          className="bg-background-dark hidden grid-cols-4 gap-4 m-0 p-0 text-left text-xs font-semibold uppercase tracking-wide sm:grid"
        >
          {SORTABLE_HEADERS.map(({ key, label }) => {
            const isActive = sortField === key;
            const nextDirection: ArticleSortDirection =
              isActive && sortDirection === "asc" ? "desc" : "asc";

            const indicatorText = isActive
              ? sortDirection === "asc"
                ? "ASC"
                : "DESC"
              : "—";

            const ariaDescription = isActive
              ? `${label}, currently sorted ${
                  sortDirection === "asc" ? "ascending" : "descending"
                }. Activate to switch to ${
                  nextDirection === "asc" ? "ascending" : "descending"
                }.`
              : `${label}, activate to sort ascending.`;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleHeaderClick(key)}
                className={`!bg-transparent m-0 px-3 py-2 text-foreground text-left transition hover:text-primary ${
                  isActive ? "text-primary" : ""
                } w-full`}
                aria-label={ariaDescription}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{label}</span>
                  <span
                    aria-hidden="true"
                    className="bg-background leading-none ml-4 mr-0 my-0 px-2 py-1 rounded-full text-tertiary text-[0.5rem]"
                  >
                    {indicatorText}
                  </span>
                </span>
              </button>
            );
          })}
        </li>
        {sortedData.length === 0 ? (
          <li
            id="table-body-empty"
            className="m-0 px-2 py-3 text-center text-sm"
          >
            No articles found.
          </li>
        ) : (
          sortedData.map((article, index) => {
            const key =
              article.title ??
              article.archive ??
              article.url ??
              `article-${index}`;

            const tags = Array.isArray(article.tags)
              ? article.tags.join(", ")
              : article.tags ?? "—";

            return (
              <li
                key={key}
                id="table-body-row"
                className="grid sm:gap-4 border-t border-meta m-0 p-0 text-sm sm:grid-cols-4"
              >
                <div className="bg-background-dark flex flex-col gap-1 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide sm:hidden">
                    Title
                  </span>
                  <span className="font-medium">
                    {article.url ? (
                      <a
                        className="transition underline hover:text-primary"
                        href={article.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {article.title ?? "Untitled"}
                      </a>
                    ) : (
                      article.title ?? "Untitled"
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-1 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide sm:hidden">
                    Creator
                  </span>
                  <span className="text-stone-300">
                    {article.creator ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide sm:hidden">
                    Site
                  </span>
                  <span className="text-stone-300">{article.site ?? "—"}</span>
                </div>
                <div className="flex flex-col gap-1 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide sm:hidden">
                    Tags
                  </span>
                  <span className="text-stone-300">{tags || "—"}</span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
