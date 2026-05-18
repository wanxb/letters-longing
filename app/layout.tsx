import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, Brackets, Home, Library, PenLine } from "lucide-react";
import "./globals.css";

const navItems = [
  { href: "/", label: "句库", icon: Home },
  { href: "/openings", label: "开头", icon: Brackets },
  { href: "/closings", label: "结尾", icon: PenLine },
  { href: "/letters", label: "信件", icon: Library },
  { href: "/topics", label: "专题", icon: BookOpenText }
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
        <header className="sticky top-0 z-30 border-b border-ink-950/10 bg-white/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-3 rounded-md whitespace-nowrap" href="/">
              <span className="grid size-9 place-items-center rounded-md bg-moss-700 text-sm font-black text-white">尺</span>
              <span>
                <span className="block text-sm font-bold leading-4 text-ink-950">尺素句库</span>
                <span className="hidden text-xs leading-4 text-ink-600 sm:block">Openings, closings, lines</span>
              </span>
            </Link>
            <nav aria-label="主导航" className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm font-semibold text-ink-650">
              {navItems.map((item) => (
                <Link
                  className="focus-ring inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-md px-2.5 transition hover:bg-paper-100 hover:text-ink-950 sm:px-3"
                  href={item.href}
                  key={item.href}
                >
                  <item.icon aria-hidden="true" size={16} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink-950/10 bg-white text-ink-650">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>短句优先：先找开头，再定结尾，正文与完整信件作为语境补充。</p>
            <Link className="focus-ring rounded-md font-semibold text-ink-950 underline underline-offset-4 hover:text-moss-700" href="/about">
              关于
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
