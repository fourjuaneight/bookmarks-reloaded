"use client";

import { useEffect, useState, type HTMLAttributes } from "react";

const toDateHex = (value: Date): string => {
  const isoDate = value.toISOString().replace(/T.*/g, "");
  const matches = isoDate.match(/\d{2,4}/g);

  if (!matches) {
    return "";
  }

  return matches
    .map(Number)
    .map((chunk) => chunk.toString(16))
    .join("");
};

type SiteTitleProps = HTMLAttributes<HTMLSpanElement>;

export function SiteTitle({ ...spanProps }: SiteTitleProps) {
  const [dateHex, setDateHex] = useState("");

  useEffect(() => {
    setDateHex(toDateHex(new Date()));
  }, []);

  return (
    <span
      {...spanProps}
      id="site-title"
      className="overflow-hidden relative whitespace-nowrap"
      aria-hidden="true"
      data-loaded={dateHex ? "true" : "false"}
      data-text={dateHex || undefined}
    >
      {dateHex}
    </span>
  );
}
