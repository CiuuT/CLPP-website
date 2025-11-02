import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "China Law & Policy Portal",
  description:
    "A searchable collection of English-language academic papers on Chinese law and policy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900`}
      >
        {/* Navigation bar */}
        <header className="border-b bg-zinc-50">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              China Law & Policy Portal
            </Link>
            <div className="flex gap-5 text-sm">
              <Link href="/articles" className="hover:underline">
                Articles
              </Link>
              <Link href="/search" className="hover:underline">
                Search
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-zinc-600">
            © {new Date().getFullYear()} China Law & Policy Portal. Built with
            Next.js & Tailwind CSS.
          </div>
        </footer>
      </body>
    </html>
  );
}

