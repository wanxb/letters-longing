"use client";

import { useMemo, useState } from "react";
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
    <div className="space-y-6">
      <div className="rounded-[8px] border border-paper-200 bg-white p-4 shadow-soft sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink-800">关键词</span>
            <input
              className="focus-ring min-h-12 w-full rounded-full border border-paper-200 bg-paper-50 px-4 text-base text-ink-950 placeholder:text-ink-600"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索原文、解释、标签"
              type="search"
              value={query}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink-800">关系</span>
            <select
              className="focus-ring min-h-12 w-full rounded-full border border-paper-200 bg-paper-50 px-4 text-base text-ink-950"
              onChange={(event) => setRelation(event.target.value)}
              value={relation}
            >
              {relations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {filtered.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((excerpt) => (
            <ExcerptCard excerpt={excerpt} key={excerpt.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] border border-paper-200 bg-white p-6 text-sm leading-6 text-ink-600">
          没有找到匹配短句。可以清空关键词，或切换关系筛选。
        </div>
      )}
    </div>
  );
}
