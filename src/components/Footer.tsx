import { resolveHref } from "@/utils/resolveHref";

type FooterProps = {
  siteTitle: string;
};

const navConfig = {
  homeUrl: process.env.NEXT_PUBLIC_HOME_URL ?? "/",
  ghUrl: process.env.NEXT_PUBLIC_GH_URL ?? "/",
  footer: [
    { label: "Archive", link: "posts" },
    { label: "Reviews", link: "reviews" },
    { label: "Uses", link: "uses" },
    { label: "Following", link: "following" },
  ],
} as const;

export default function Footer({ siteTitle }: FooterProps) {
  const footerLinks = navConfig.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-dark border-0 border-solid border-t-under border-meta grid mt-8 w-full">
      <section className="col-start-2 flex flex-wrap-reverse gap-2 items-center justify-start row-start-2 w-full">
        <nav
          aria-label="Site information"
          className="flex flex-wrap items-center justify-start gap-x-1 ml-0 mr-auto my-0 p-0 w-auto"
        >
          <a
            className="focus:underline hover:underline no-underline m-0 p-1 row-start-1 text-sm whitespace-nowrap"
            href={`${navConfig.ghUrl}/bookmarks-reloaded/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
          >
            &copy; {currentYear} {siteTitle}
          </a>
          <span aria-hidden="true" className="m-0 row-start-1 text-meta text-sm">
            &bull;
          </span>
          <a
            className="focus:underline hover:underline no-underline m-0 p-1 row-start-1 text-sm whitespace-nowrap"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>
        </nav>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-start gap-x-1 ml-0 my-0 -mr-1 p-0 w-auto"
        >
          <ul className="flex flex-wrap items-center justify-start gap-x-1 m-0 list-none p-0">
            {footerLinks.map((item, index) => {
              const href = resolveHref(navConfig.homeUrl, item.link);

              return (
                <li key={item.label} className="flex items-center gap-x-1 m-0 p-0">
                  <a
                    className="focus:underline hover:underline m-0 no-underline p-1 row-start-1 text-sm"
                    data-item={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                  {index < footerLinks.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="m-0 row-start-1 text-meta text-sm"
                    >
                      &bull;
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </section>
    </footer>
  );
}
