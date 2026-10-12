import type { Metadata } from "next";
// Fonts are bundled from the `geist` package (self-hosted), so builds and
// offline devices never depend on fetching from Google Fonts.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "KIDDO — Learn, Play, Discover",
  description: "KIDDO is a children's adaptive learning platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
