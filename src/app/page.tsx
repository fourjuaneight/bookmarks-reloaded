import { getArticles } from "@/utils/database";
import Intro from "./intro";

export default async function Home() {
  const articles = await getArticles();

  return (
    <>
      <h1
        className="col-start-2 mb-8 mt-0 w-full text-5xl font-mdNichrome font-bold sm:text-5xl"
        data-line="slim"
      >
        Bookmarks (Reloaded)
      </h1>
      <div className="w-full">
        <ul className="w-full overflow-hidden rounded border border-stone-200/60 bg-white/5 shadow-sm backdrop-blur">
          <li className="hidden grid-cols-4 gap-4 m-0 px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 sm:grid">
            <span>Title</span>
            <span>Creator</span>
            <span>Site</span>
            <span>Tags</span>
          </li>
          {articles.length === 0 ? (
            <li className="m-0 px-2 py-3 text-center text-sm text-stone-500">
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
                  className="grid gap-4 border-t border-stone-200/40 m-0 px-2 py-3 text-sm text-stone-200 sm:grid-cols-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                      Title
                    </span>
                    <span className="font-medium text-stone-100">
                      {article.url ? (
                        <a
                          className="text-sky-300 transition hover:text-sky-200"
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
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                      Creator
                    </span>
                    <span className="text-stone-300">{article.creator ?? "—"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                      Site
                    </span>
                    <span className="text-stone-300">{article.site ?? "—"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
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
      <Intro />
    </>
  );
}
