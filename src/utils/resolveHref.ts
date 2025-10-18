export const resolveHref = (baseUrl: string, href: string) =>
  href.startsWith("http") || href.startsWith("mailto:")
    ? href
    : `${baseUrl}/${href.replace(/^\//, "")}`;