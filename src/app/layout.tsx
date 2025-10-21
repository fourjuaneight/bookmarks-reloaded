import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NoiseBackground from "@/components/NoiseBackground";

import "./reset.css";
import "./globals.css";

const criticalCss = readFileSync(
  path.join(process.cwd(), "src/app/critical.css"),
  "utf8",
);

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const mdNichrome = localFont({
  variable: "--font-md-nichrome",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/MD_Nichrome-Black-subset.woff2",
      style: "normal",
      weight: "900",
    },
    {
      path: "../../public/fonts/MD_Nichrome-Black-subset.woff",
      style: "normal",
      weight: "900",
    },
    {
      path: "../../public/fonts/MD_Nichrome-Dark-subset.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../../public/fonts/MD_Nichrome-Dark-subset.woff",
      style: "normal",
      weight: "500",
    },
  ],
});

export const metadata: Metadata = {
  title: "Clever Laziness Bookmarks",
  description: "This is where I keep the stuff I hoard online.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style
          id="critical-css"
          dangerouslySetInnerHTML={{ __html: criticalCss }}
        />
      </head>
      <body
        className={`${inter.variable} ${mdNichrome.variable} antialiased`}
        data-party="false"
      >
        <Header siteTitle={metadata.title as string} />
        <main className="grid relative w-full">
          <div className="col-start-2 flex flex-col items-start justify-start row-start-2 w-full">
            {children}
          </div>
        </main>
        <Footer siteTitle={metadata.title as string} />
        <NoiseBackground />
        <Analytics/>
        <SpeedInsights />
      </body>
    </html>
  );
}
