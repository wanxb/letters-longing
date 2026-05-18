"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Excerpt } from "@/lib/types";
import { ExcerptCard } from "@/components/excerpts/ExcerptCard";

export function ExcerptExplorer({ excerpts }: { excerpts: Excerpt[] }) {
  const [query, setQuery] = useState("");
  const [relation, setRelation] = useState("全部");

  const relations = useMemo(() => ["全部", ...Array.from(new Set(excerpts.flatMap((excerpt) => excerpt.relationTags)))], [excerpts]);

  const filtered = excerpts.filter((excerpt) => {
    const matchesRelation = relation === "全部" || excerpt.relationTags.includes(relation);
    const haystack = [excerpt.originalText, excerpt.translationText, excerpt.plainExplanation, excerpt.usageScene, ...excerpt.relationTags, ...excerpt.emotionTags]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesRelation && haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
      <aside className="rounded-md bg-white p-4 shadow-soft ring-1 ring-ink-950/10 lg:sticky lg:top-24 lg:self-start">
        <label className="block">
          <span className="mb-2 block text-sm font-black text-ink-950">关键词</span>
          <span className="relative block">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" size={18} />
            <input
              className="focus-ring min-h-12 w-full rounded-md border border-ink-950/10 bg-paper-50 py-2 pl-10 pr-3 text-base text-ink-950 placeholder:text-ink-600"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索原文、解释、标签"
              type="search"
              value={query}
            />
          </span>
        </label>

        <div className="mt-5">
          <p className="mb-2 text-sm font-black text-ink-950">关系</p>
          <div className="flex flex-wrap gap-2">
            {relations.map((item) => (
              <button
                className={`focus-ring min-h-10 rounded-md border px-3 text-sm font-bold transition ${
                  relation === item ? "border-moss-700 bg-moss-700 text-white" : "border-ink-950/10 bg-white text-ink-650 hover:border-moss-700 hover:text-ink-950"
                }`}
                key={item}
                onClick={() => setRelation(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 border-t border-ink-950/10 pt-4 text-sm font-semibold text-ink-650">{filtered.length} 条短句</p>
      </aside>

      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((excerpt) => (
            <ExcerptCard excerpt={excerpt} key={excerpt.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-white p-6 text-sm font-semibold leading-6 text-ink-650 shadow-soft ring-1 ring-ink-950/10">没有找到匹配短句。可以清空关键词，或切换关系筛选。</div>
      )}
    </div>
  );
}
