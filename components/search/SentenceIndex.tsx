"use client";

import Link from "next/link";
import { Check, Copy, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Excerpt, ExcerptType } from "@/lib/types";

const typeLabel: Record<ExcerptType, string> = {
  opening: "启笺",
  closing: "收笔",
  body: "正文"
};

const typeFilters: Array<{ label: string; value: "all" | ExcerptType }> = [
  { label: "全部", value: "all" },
  { label: "启笺", value: "opening" },
  { label: "收笔", value: "closing" },
  { label: "正文", value: "body" }
];

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function languageLabel(language: string) {
  if (language.toLowerCase().startsWith("en")) return "英文";
  if (language.toLowerCase().startsWith("zh")) return "中文";
  return language.toUpperCase();
}

type FilterButtonProps<T extends string> = {
  active: boolean;
  label: string;
  onClick: () => void;
  value: T;
};

function FilterButton<T extends string>({ active, label, onClick }: FilterButtonProps<T>) {
  return (
    <button
      className={`focus-ring min-h-10 rounded-full px-4 text-sm font-semibold transition ${
        active ? "bg-ink-950 text-white" : "border border-paper-200 bg-white text-ink-650 hover:border-paper-300 hover:text-ink-950"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function SentenceIndex({ excerpts }: { excerpts: Excerpt[] }) {
  const [activeType, setActiveType] = useState<"all" | ExcerptType>("all");
  const [activeRelation, setActiveRelation] = useState("all");
  const [activeEmotion, setActiveEmotion] = useState("all");
  const [activeLanguage, setActiveLanguage] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [query, setQuery] = useState("");

  const relationOptions = useMemo(() => unique(excerpts.flatMap((excerpt) => excerpt.relationTags)), [excerpts]);
  const emotionOptions = useMemo(() => unique(excerpts.flatMap((excerpt) => excerpt.emotionTags)), [excerpts]);
  const languageOptions = useMemo(() => unique(excerpts.map((excerpt) => excerpt.language)), [excerpts]);

  const filtered = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    return excerpts.filter((excerpt) => {
      const matchesType = activeType === "all" || excerpt.type === activeType;
      const matchesRelation = activeRelation === "all" || excerpt.relationTags.includes(activeRelation);
      const matchesEmotion = activeEmotion === "all" || excerpt.emotionTags.includes(activeEmotion);
      const matchesLanguage = activeLanguage === "all" || excerpt.language === activeLanguage;
      const haystack = [
        excerpt.originalText,
        excerpt.translationText,
        excerpt.plainExplanation,
        excerpt.usageScene,
        excerpt.language,
        ...excerpt.relationTags,
        ...excerpt.emotionTags
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesType && matchesRelation && matchesEmotion && matchesLanguage && (!trimmedQuery || haystack.includes(trimmedQuery));
    });
  }, [activeEmotion, activeLanguage, activeRelation, activeType, excerpts, query]);

  const hasActiveFilters = activeType !== "all" || activeRelation !== "all" || activeEmotion !== "all" || activeLanguage !== "all" || query.trim().length > 0;

  function clearFilters() {
    setActiveType("all");
    setActiveRelation("all");
    setActiveEmotion("all");
    setActiveLanguage("all");
    setQuery("");
  }

  async function copyExcerpt(excerpt: Excerpt) {
    await navigator.clipboard.writeText(excerpt.translationText ? `${excerpt.originalText}\n${excerpt.translationText}` : excerpt.originalText);
    setCopiedId(excerpt.id);
    window.setTimeout(() => setCopiedId(null), 1500);
  }

  const filterControls = (
    <>
      <label className="relative block">
        <span className="sr-only">查询句子</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-600" size={18} />
        <input
          className="focus-ring min-h-11 w-full rounded-full border border-paper-200 bg-white py-2 pl-11 pr-4 text-base text-ink-950 placeholder:text-ink-600"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="查询：思念、Dear、慰问"
          type="search"
          value={query}
        />
      </label>

      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">分类</p>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((filter) => (
              <FilterButton active={activeType === filter.value} key={filter.value} label={filter.label} onClick={() => setActiveType(filter.value)} value={filter.value} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">关系</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={activeRelation === "all"} label="全部" onClick={() => setActiveRelation("all")} value="all" />
            {relationOptions.map((relation) => (
              <FilterButton active={activeRelation === relation} key={relation} label={relation} onClick={() => setActiveRelation(relation)} value={relation} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">情绪</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={activeEmotion === "all"} label="全部" onClick={() => setActiveEmotion("all")} value="all" />
            {emotionOptions.map((emotion) => (
              <FilterButton active={activeEmotion === emotion} key={emotion} label={emotion} onClick={() => setActiveEmotion(emotion)} value={emotion} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">语言</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={activeLanguage === "all"} label="全部" onClick={() => setActiveLanguage("all")} value="all" />
            {languageOptions.map((language) => (
              <FilterButton active={activeLanguage === language} key={language} label={languageLabel(language)} onClick={() => setActiveLanguage(language)} value={language} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-paper-200 pt-4 text-sm text-ink-600">
        <span>{filtered.length} 条结果</span>
        <button
          className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full px-3 font-semibold text-seal-700 transition hover:bg-seal-100 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasActiveFilters}
          onClick={clearFilters}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={15} />
          清空
        </button>
      </div>
    </>
  );

  return (
    <section className="min-h-[calc(100dvh-72px)] bg-paper-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <main>
          <div className="mb-6 border-b border-paper-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss-700">Letters & Longing</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl font-semibold leading-tight text-ink-950 sm:text-5xl">句库台</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-ink-650">打开就是句子。按关系、情绪、分类筛选，复制后再回到语境。</p>
              </div>
              <div className="w-full space-y-3 lg:hidden">
                <label className="relative block">
                  <span className="sr-only">查询句子</span>
                  <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-600" size={18} />
                  <input
                    className="focus-ring min-h-11 w-full rounded-full border border-paper-200 bg-white py-2 pl-11 pr-4 text-base text-ink-950 placeholder:text-ink-600"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="查询：思念、Dear、慰问"
                    type="search"
                    value={query}
                  />
                </label>
                <button
                  className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-paper-200 bg-white px-4 text-sm font-semibold text-ink-950 shadow-soft"
                  onClick={() => setIsFilterOpen(true)}
                  type="button"
                >
                  <SlidersHorizontal aria-hidden="true" size={17} />
                  分类与筛选
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-paper-200">
            {filtered.map((excerpt, index) => (
              <article className="grid gap-4 py-8 lg:grid-cols-[76px_minmax(0,1fr)]" key={excerpt.id}>
                <div className="flex items-center gap-3 text-sm text-ink-600 lg:block">
                  <span className="font-serif text-2xl text-paper-300">{String(index + 1).padStart(2, "0")}</span>
                  <span className="lg:mt-3 lg:block">{typeLabel[excerpt.type]}</span>
                </div>

                <div>
                  <blockquote className="max-w-4xl font-serif text-3xl font-semibold leading-tight text-ink-950 sm:text-4xl">{excerpt.originalText}</blockquote>
                  {excerpt.translationText ? <p className="mt-4 max-w-3xl text-base leading-7 text-ink-800">{excerpt.translationText}</p> : null}
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-650">{excerpt.plainExplanation}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {[...excerpt.relationTags, ...excerpt.emotionTags].slice(0, 4).map((tag) => (
                      <span className="rounded-full bg-moss-100 px-3 py-1 text-xs font-medium text-moss-700" key={tag}>
                        {tag}
                      </span>
                    ))}
                    <span className="rounded-full bg-paper-100 px-3 py-1 text-xs font-medium uppercase text-ink-600">{excerpt.language}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      aria-label="复制这条句子"
                      className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full bg-ink-950 px-4 text-sm font-semibold text-white transition hover:bg-ink-800"
                      onClick={() => copyExcerpt(excerpt)}
                      type="button"
                    >
                      {copiedId === excerpt.id ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
                      {copiedId === excerpt.id ? "已复制" : "复制"}
                    </button>
                    <Link className="focus-ring inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold text-seal-700 transition hover:bg-seal-100" href={`/excerpts/${excerpt.id}`}>
                      语境
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 ? <p className="py-16 text-center text-sm text-ink-600">没有找到匹配句子。可以清空筛选，或试试“Dear”“敬意”“爱情”。</p> : null}
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5 border-l border-paper-200 pl-6">{filterControls}</div>
        </aside>
      </div>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="筛选与查询">
          <button className="absolute inset-0 cursor-default bg-ink-950/35" aria-label="关闭筛选" onClick={() => setIsFilterOpen(false)} type="button" />
          <div className="absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto rounded-t-[8px] bg-paper-50 p-4 shadow-editorial">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-serif text-2xl font-semibold text-ink-950">筛选与查询</p>
              <button className="focus-ring grid min-h-11 min-w-11 place-items-center rounded-full border border-paper-200 bg-white text-ink-950" aria-label="关闭筛选" onClick={() => setIsFilterOpen(false)} type="button">
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="space-y-5">{filterControls}</div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
