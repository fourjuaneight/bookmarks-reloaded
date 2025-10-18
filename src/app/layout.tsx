import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Inter } from "next/font/google";
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
      <body className={`${inter.variable} antialiased`}>
        <main className="grid relative w-full">
          <div className="col-start-2 flex flex-col items-start justify-start row-start-2 w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
