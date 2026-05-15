import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navItems = [
  { href: "/openings", label: "启笺" },
  { href: "/closings", label: "收笔" },
  { href: "/relations/love", label: "情谊" },
  { href: "/letters", label: "书信" },
  { href: "/topics", label: "专题" }
];

export const metadata: Metadata = {
  title: {
    default: "尺素 Letters & Longing",
    template: "%s | 尺素"
  },
  description: "尺素整理公开书信、书信短句与表达专题。",
  metadataBase: new URL("https://letters-longing.pages.dev")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="sticky top-0 z-30 border-b border-ink-950/10 bg-paper-50/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <Link className="focus-ring inline-flex shrink-0 items-baseline gap-2 rounded-md whitespace-nowrap" href="/">
              <span className="font-serif text-2xl font-semibold text-ink-950">尺素</span>
              <span className="hidden text-xs uppercase tracking-[0.18em] text-ink-600 sm:inline">Letters & Longing</span>
            </Link>
            <nav aria-label="主导航" className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm font-medium text-ink-650">
              {navItems.map((item) => (
                <Link
                  className="focus-ring whitespace-nowrap rounded-full px-2.5 py-2 transition hover:bg-white hover:text-ink-950 sm:px-3"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-paper-200 bg-ink-950 text-paper-150">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-7 text-sm sm:px-6 lg:px-8">
            <p className="font-serif text-base text-white">尺素</p>
            <Link className="focus-ring rounded-md underline underline-offset-4 hover:text-white" href="/about">
              关于
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
