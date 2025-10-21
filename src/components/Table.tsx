"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";

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
  pageSizeOptions?: ReadonlyArray<number>;
  initialPageSize?: number;
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

const DEFAULT_PAGE_SIZE_OPTIONS = Object.freeze([25, 50, 100]);

function normalizePageSizeOptions(
  options?: ReadonlyArray<number>,
): readonly number[] {
  const fallback = DEFAULT_PAGE_SIZE_OPTIONS;

  if (!options || options.length === 0) {
    return fallback;
  }

  const uniqueSorted = Array.from(
    new Set(
      options
        .map((option) => Math.trunc(option))
        .filter((option) => option > 0 && Number.isFinite(option)),
    ),
  ).sort((a, b) => a - b);

  return uniqueSorted.length > 0 ? uniqueSorted : fallback;
}

function resolveInitialPageSize(
  initial: number | undefined,
  options: readonly number[],
): number {
  if (typeof initial === "number") {
    const normalized = Math.trunc(initial);
    if (options.includes(normalized)) {
      return normalized;
    }
  }

  return options[0] ?? DEFAULT_PAGE_SIZE_OPTIONS[0];
}

export function Table({
  articles,
  initialSortField,
  initialSortDirection,
  pageSizeOptions,
  initialPageSize,
}: TableProps) {
  const pageSizeSelectId = useId();
  const searchInputId = useId();

  const [searchTerm, setSearchTerm] = usePersistentState<string>(
    "bookmarks-table:search",
    "",
  );

  const normalizedSearchTerm = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);

  const normalizedPageSizeOptions = useMemo(
    () => normalizePageSizeOptions(pageSizeOptions),
    [pageSizeOptions],
  );

  const resolvedInitialPageSize = useMemo(
    () => resolveInitialPageSize(initialPageSize, normalizedPageSizeOptions),
    [initialPageSize, normalizedPageSizeOptions],
  );

  const [sortField, setSortField] = usePersistentState<ArticleSortField>(
    "bookmarks-table:sort-field",
    initialSortField,
  );
  const [sortDirection, setSortDirection] = usePersistentState<ArticleSortDirection>(
    "bookmarks-table:sort-direction",
    initialSortDirection,
  );
  const [pageSize, setPageSize] = usePersistentState<number>(
    "bookmarks-table:page-size",
    resolvedInitialPageSize,
  );
  const [currentPage, setCurrentPage] = usePersistentState<number>(
    "bookmarks-table:page",
    1,
  );
  const previousInitialSortFieldRef = useRef(initialSortField);
  const previousInitialSortDirectionRef = useRef(initialSortDirection);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearchTerm, setCurrentPage]);

  useEffect(() => {
    setPageSize((current) => {
      if (!Number.isFinite(current)) {
        return resolvedInitialPageSize;
      }

      const normalized = Math.max(1, Math.trunc(current));
      if (!normalizedPageSizeOptions.includes(normalized)) {
        return resolvedInitialPageSize;
      }

      return normalized;
    });
  }, [normalizedPageSizeOptions, resolvedInitialPageSize, setPageSize]);

  useEffect(() => {
    if (previousInitialSortFieldRef.current === initialSortField) {
      return;
    }

    previousInitialSortFieldRef.current = initialSortField;
    setSortField((current) =>
      current === initialSortField ? current : initialSortField,
    );
  }, [initialSortField, setSortField]);

  useEffect(() => {
    if (previousInitialSortDirectionRef.current === initialSortDirection) {
      return;
    }

    previousInitialSortDirectionRef.current = initialSortDirection;
    setSortDirection((current) =>
      current === initialSortDirection ? current : initialSortDirection,
    );
  }, [initialSortDirection, setSortDirection]);

  const sortedData = useMemo(
    () => sortArticlesData(articles, sortField, sortDirection),
    [articles, sortDirection, sortField],
  );

  const filteredData = useMemo(() => {
    if (normalizedSearchTerm === "") {
      return sortedData;
    }

    return sortedData.filter((article) => {
      const haystack = [
        article.title,
        article.creator,
        article.site,
        Array.isArray(article.tags) ? article.tags.join(", ") : article.tags,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return haystack.some((value) => value.includes(normalizedSearchTerm));
    });
  }, [normalizedSearchTerm, sortedData]);

  const computedPageSize = normalizedPageSizeOptions.includes(pageSize)
    ? pageSize
    : resolvedInitialPageSize;
  const safePageSize = Math.max(
    1,
    Math.trunc(
      Number.isFinite(computedPageSize)
        ? computedPageSize
        : resolvedInitialPageSize,
    ),
  );

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const effectivePage = Number.isFinite(currentPage)
    ? Math.min(Math.max(Math.trunc(currentPage), 1), totalPages)
    : 1;

  useEffect(() => {
    setCurrentPage((current) => {
      if (!Number.isFinite(current)) {
        return 1;
      }

      const normalized = Math.max(1, Math.trunc(current));
      if (normalized > totalPages) {
        return totalPages;
      }

      return normalized;
    });
  }, [setCurrentPage, totalPages]);

  const paginatedData = useMemo(() => {
    if (totalItems === 0) {
      return [] as ArticleRow[];
    }

    const start = (effectivePage - 1) * safePageSize;
    const end = start + safePageSize;
    return filteredData.slice(start, end);
  }, [effectivePage, filteredData, safePageSize, totalItems]);

  const pageStart = totalItems === 0 ? 0 : (effectivePage - 1) * safePageSize + 1;
  const pageEnd = totalItems === 0 ? 0 : Math.min(effectivePage * safePageSize, totalItems);
  const canGoPrevious = effectivePage > 1;
  const canGoNext = effectivePage < totalPages;
  const showPaginationControls = totalItems > 0;

  const handleHeaderClick = useCallback(
    (field: ArticleSortField) => {
      setCurrentPage(1);

      if (field === sortField) {
        setSortDirection((prevDirection) =>
          prevDirection === "asc" ? "desc" : "asc",
        );
        return;
      }

      setSortField(field);
      setSortDirection("asc");
    },
    [setCurrentPage, setSortDirection, setSortField, sortField],
  );

  const handlePageSizeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const numericValue = Number(event.target.value);
      const nextSize = normalizedPageSizeOptions.find(
        (option) => option === numericValue,
      );

      if (typeof nextSize === "number") {
        setPageSize(nextSize);
        setCurrentPage(1);
      }
    },
    [normalizedPageSizeOptions, setCurrentPage, setPageSize],
  );

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (!Number.isFinite(prev)) {
        return 1;
      }

      const normalized = Math.max(1, Math.trunc(prev));
      return Math.max(1, normalized - 1);
    });
  }, [setCurrentPage]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (!Number.isFinite(prev)) {
        return Math.min(totalPages, 1);
      }

      const normalized = Math.max(1, Math.trunc(prev));
      return Math.min(totalPages, normalized + 1);
    });
  }, [setCurrentPage, totalPages]);

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
      <form
        role="search"
        className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor={searchInputId} className="sr-only">
          Search articles
        </label>
        <input
          id={searchInputId}
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search articles"
          className="bg-background border border-meta flex-1 px-3 py-2 rounded text-foreground text-base focus:border-solid hover:border-solid"
          autoComplete="off"
        />
        {searchTerm ? (
          <button
            type="button"
            className="border border-meta m-0 px-3 py-2 rounded text-sm transition focus:!bg-primary hover:!bg-primary"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </button>
        ) : null}
      </form>
      {activeSortLabel ? (
        <p className="sr-only" aria-live="polite">
          {activeSortLabel}
        </p>
      ) : null}
      <ul
        className={`backdrop-blur bg-background border border-meta overflow-hidden shadow-sm w-full ${
          showPaginationControls ? "rounded-t" : "rounded"
        }`}
      >
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
                    className="bg-background leading-none ml-4 mr-0 my-0 px-2 py-1 rounded-full text-meta text-[0.5rem]"
                  >
                    {indicatorText}
                  </span>
                </span>
              </button>
            );
          })}
        </li>
        {totalItems === 0 ? (
          <li
            id="table-body-empty"
            className="m-0 px-2 py-3 text-center text-sm"
          >
            {normalizedSearchTerm
              ? `No articles found for "${searchTerm.trim()}".`
              : "No articles found."}
          </li>
        ) : (
          paginatedData.map((article, index) => {
            const absoluteIndex = (effectivePage - 1) * safePageSize + index;
            const key =
              article.title ??
              article.archive ??
              article.url ??
              `article-${absoluteIndex}`;

            const tags = Array.isArray(article.tags)
              ? article.tags.join(", ")
              : article.tags ?? "—";

            return (
              <li
                key={key}
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
      {showPaginationControls ? (
        <nav
          aria-label="Pagination"
          className="bg-background-dark border border-meta border-t-0 flex flex-col gap-3 rounded-b px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="m-0 p-0 text-meta whitespace-nowrap">
            {pageStart}-{pageEnd} of {totalItems}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor={pageSizeSelectId} className="text-meta sr-only">
              Rows per page
            </label>
            <select
              id={pageSizeSelectId}
              value={computedPageSize}
              onChange={handlePageSizeChange}
              className="bg-background border border-meta px-2 py-1 text-foreground text-sm"
            >
              {normalizedPageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full">
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={!canGoPrevious}
                className="border border-meta m-0 px-3 py-1 rounded text-sm transition w-24 focus:!bg-primary hover:!bg-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <p className="m-0 p-0 text-meta">
                <span className="sr-only">Page </span>
                {effectivePage} of {totalPages}
              </p>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={!canGoNext}
                className="border border-meta m-0 px-3 py-1 rounded text-sm transition w-24 focus:!bg-primary hover:!bg-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </nav>
      ) : null}
    </section>
  );
}
