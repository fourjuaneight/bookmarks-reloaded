export const resolveHref = (baseUrl: string, href: string) =>
  href.startsWith("http") ? href : `${baseUrl}/${href.replace(/^\//, "")}`;
