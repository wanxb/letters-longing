"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { SearchItem } from "@/lib/types";

const typeLabel: Record<SearchItem["type"], string> = {
  excerpt: "短句",
  letter: "书信",
  topic: "专题"
};

export function SearchPanel({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        threshold: 0.36,
        keys: ["title", "description", "text", "tags"]
      }),
    [items]
  );

  const results = query.trim() ? fuse.search(query.trim()).slice(0, 5).map((result) => result.item) : items.slice(0, 3);

  return (
    <div className="rounded-[8px] border border-paper-300 bg-[#fffdf8] p-4 shadow-editorial">
      <label className="sr-only" htmlFor="site-search">
        搜索
      </label>
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-600" size={18} />
        <input
          className="focus-ring min-h-12 w-full rounded-full border border-paper-300 bg-paper-50 py-3 pl-11 pr-4 text-base text-ink-950 placeholder:text-ink-600"
          id="site-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索：思念、Dear、慰问"
          type="search"
          value={query}
        />
      </div>
      <div className="mt-4 divide-y divide-paper-200" role="list">
        {results.length ? (
          results.map((item) => (
            <Link className="focus-ring block rounded-md py-3 transition first:pt-1 hover:bg-paper-50" href={item.url} key={`${item.type}-${item.id}`}>
              <span className="text-xs font-medium text-seal-700">{typeLabel[item.type]}</span>
              <span className="mt-1 block font-medium text-ink-950">{item.title}</span>
              <span className="mt-1 line-clamp-2 block text-sm leading-6 text-ink-600">{item.description}</span>
            </Link>
          ))
        ) : (
          <p className="rounded-md bg-paper-50 p-3 text-sm text-ink-600">没有找到结果。试试“问候”“感谢”“英文”。</p>
        )}
      </div>
    </div>
  );
}
