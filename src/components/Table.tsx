import { ArticleRow } from "@/utils/database";

interface TableProps {
  articles: ArticleRow[];
}

export function Table({ articles }: TableProps) {
  return (
    <div className="w-full">
      <ul className="bg-background w-full overflow-hidden rounded border border-stone-200/60 shadow-sm backdrop-blur">
        <li className="bg-background-dark hidden grid-cols-4 gap-4 m-0 p-0 text-left text-xs font-semibold uppercase tracking-wide sm:grid">
          <span className="px-3 py-2">Title</span>
          <span className="px-3 py-2">Creator</span>
          <span className="px-3 py-2">Site</span>
          <span className="px-3 py-2">Tags</span>
        </li>
        {articles.length === 0 ? (
          <li className="m-0 px-2 py-3 text-center text-sm">
            No articles found.
          </li>
        ) : (
          articles.map((article, index) => {
            const key =
              (article.id ? String(article.id) : null) ??
              article.archive ??
              article.url ??
              `article-${index}`;

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
    </div>
  );
}
