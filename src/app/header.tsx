import { resolveHref } from "@/utils/resolveHref";
import { SiteTitle } from "@/components/SiteTitle";

type HeaderProps = {
  siteTitle: string;
};

const navConfig = {
  homeUrl: process.env.NEXT_PUBLIC_HOME_URL ?? "/",
  header: [
    { label: "Posts", link: "posts" },
    { label: "Tags", link: "tags" },
    { label: "About", link: "about" },
  ],
} as const;

export default function Header({ siteTitle }: HeaderProps) {
  return (
    <header className="bg-background-dark border-0 border-solid border-b-under border-meta grid mb-8 w-full">
      <section className="col-start-2 flex items-center justify-between row-start-2 w-full">
        <a
          href={navConfig.homeUrl}
          className="site-name focus:text-primary font-mdNichrome focus:no-underline font-bold hover:text-primary hover:no-underline items-center no-underline relative text-center text-foreground text-2xl w-auto"
          data-line="slim"
          data-underline="true"
          title={siteTitle}
        >
          <SiteTitle />
        </a>
        <nav
          aria-label="Primary navigation"
          className="flex gap-x-3 items-center justify-end w-auto sm:gap-x-4 sm:m-0"
        >
          <ul className="flex items-center justify-end gap-x-3 m-0 list-none p-0 sm:gap-x-4">
            {navConfig.header.map((item) => (
              <li key={item.label} className="flex relative m-0 p-0">
                <a
                  className="focus:no-underline font-mdNichrome font-bold hover:no-underline no-underline relative text-center text-2xl"
                  data-line="slim"
                  data-underline="true"
                  href={resolveHref(navConfig.homeUrl, item.link)}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute bg-primary bottom-0 duration-200 ease-in-out h-1 hidden left-0 transition-all w-0 xs:block"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </header>
  );
}
