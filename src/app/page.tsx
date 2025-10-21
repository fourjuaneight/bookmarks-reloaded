import { getArticlesCached } from "@/utils/database";
import {
  DEFAULT_ARTICLE_SORT_DIRECTION,
  DEFAULT_ARTICLE_SORT_FIELD,
} from "@/utils/articles";
import Intro from "./intro";
import { Table } from "@/components/Table";

export default async function Home() {
  const articles = await getArticlesCached({
    sortBy: DEFAULT_ARTICLE_SORT_FIELD,
    sortDirection: DEFAULT_ARTICLE_SORT_DIRECTION,
  });

  return (
    <>
      <h1
        className="col-start-2 flex gap-2 items-center justify-between mb-8 mt-0 w-full text-5xl font-bold sm:text-5xl"
        data-line="slim"
      >
        <span className="font-mdNichrome">Bookmarks (Reloaded)</span>
        <p className="bg-background leading-none ml-4 mr-0 my-0 px-2 py-1 rounded-full text-sm text-tertiary">
          {articles.length}
          <span className="sr-only"> in total.</span>
        </p>
      </h1>
      <p>
        As we collect bookmarks, we quickly recognize that many online artifacts
        have vanished. Links break, content evaporates—so, is stuff online worth
        saving? No idea. But I&apos;m a digital hoarder, so here&apos;s my hoard of
        links. Enjoy!
      </p>
      <Table
        articles={articles}
        initialSortField={DEFAULT_ARTICLE_SORT_FIELD}
        initialSortDirection={DEFAULT_ARTICLE_SORT_DIRECTION}
      />
      <Intro />
    </>
  );
}

export const revalidate = 3600;
