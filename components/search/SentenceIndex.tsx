"use client";

import Link from "next/link";
import { ArrowRight, Check, Copy, Filter, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Excerpt, ExcerptType } from "@/lib/types";

const typeLabel: Record<ExcerptType, string> = {
  opening: "开头",
  closing: "结尾",
  body: "信中句"
};

const typeDescription: Record<ExcerptType, string> = {
  opening: "先把称谓、距离和语气放对。",
  closing: "用最后一句留下分寸和余韵。",
  body: "在正文里表达说明、思念、道歉或劝慰。"
};

const typeAccent: Record<ExcerptType, string> = {
  opening: "bg-moss-100 text-moss-700",
  closing: "bg-seal-100 text-seal-700",
  body: "bg-gold-100 text-gold-700"
};

const typeFilters: Array<{ label: string; value: "all" | ExcerptType }> = [
  { label: "全部", value: "all" },
  { label: "开头", value: "opening" },
  { label: "结尾", value: "closing" },
  { label: "信中句", value: "body" }
];

const spotlightTypes = ["opening", "closing"] as const;

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function languageLabel(language: string) {
  if (language.toLowerCase().startsWith("en")) return "英文";
  if (language.toLowerCase().startsWith("zh")) return "中文";
  return language.toUpperCase();
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-l border-ink-950/15 pl-4">
      <p className="text-2xl font-black leading-none text-ink-950 sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase text-ink-600">{label}</p>
    </div>
  );
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      className={`focus-ring min-h-11 rounded-md border px-3 text-sm font-bold transition ${
        active ? "border-moss-700 bg-moss-700 text-white" : "border-ink-950/10 bg-white text-ink-650 hover:border-moss-700 hover:text-ink-950"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function SentenceRow({ copied, excerpt, index, onCopy }: { copied: boolean; excerpt: Excerpt; index: number; onCopy: () => void }) {
  return (
    <article className="group grid gap-4 border-t border-ink-950/10 py-6 first:border-t-0 md:grid-cols-[84px_minmax(0,1fr)_150px] md:py-7">
      <div className="flex items-center gap-3 md:block">
        <span className="font-mono text-xs font-bold text-ink-600">{String(index + 1).padStart(3, "0")}</span>
        <span className={`inline-flex rounded-md px-2 py-1 text-xs font-black ${typeAccent[excerpt.type]} md:mt-3`}>{typeLabel[excerpt.type]}</span>
      </div>

      <div className="min-w-0">
        <blockquote className="text-balance font-serif text-2xl font-semibold leading-snug text-ink-950 sm:text-3xl">{excerpt.originalText}</blockquote>
        {excerpt.translationText ? <p className="mt-3 max-w-3xl text-base leading-7 text-ink-650">{excerpt.translationText}</p> : null}
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-650">{excerpt.plainExplanation}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[...excerpt.relationTags, ...excerpt.emotionTags].slice(0, 4).map((tag) => (
            <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-ink-650 ring-1 ring-ink-950/10" key={tag}>
              {tag}
            </span>
          ))}
          <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold uppercase text-ink-650 ring-1 ring-ink-950/10">{languageLabel(excerpt.language)}</span>
        </div>
      </div>

      <div className="flex items-start gap-2 md:justify-end">
        <button
          aria-label="复制这条短句"
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-moss-700 px-3 text-sm font-bold text-white transition hover:bg-ink-800"
          onClick={onCopy}
          type="button"
        >
          {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
          {copied ? "已复制" : "复制"}
        </button>
        <Link className="focus-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-bold text-moss-700 transition hover:bg-moss-100" href={`/excerpts/${excerpt.id}`}>
          详情
        </Link>
      </div>
    </article>
  );
}

export function SentenceIndex({ excerpts }: { excerpts: Excerpt[] }) {
  const [activeType, setActiveType] = useState<"all" | ExcerptType>("all");
  const [activeRelation, setActiveRelation] = useState("all");
  const [activeEmotion, setActiveEmotion] = useState("all");
  const [activeLanguage, setActiveLanguage] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [spotlightIndexes, setSpotlightIndexes] = useState<Record<"opening" | "closing", number>>({ opening: 0, closing: 0 });
  const [query, setQuery] = useState("");

  const relationOptions = useMemo(() => unique(excerpts.flatMap((excerpt) => excerpt.relationTags)), [excerpts]);
  const emotionOptions = useMemo(() => unique(excerpts.flatMap((excerpt) => excerpt.emotionTags)), [excerpts]);
  const languageOptions = useMemo(() => unique(excerpts.map((excerpt) => excerpt.language)), [excerpts]);
  const counts = useMemo(
    () => ({
      opening: excerpts.filter((excerpt) => excerpt.type === "opening").length,
      closing: excerpts.filter((excerpt) => excerpt.type === "closing").length,
      body: excerpts.filter((excerpt) => excerpt.type === "body").length
    }),
    [excerpts]
  );

  const filtered = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    return excerpts.filter((excerpt) => {
      const matchesType = activeType === "all" || excerpt.type === activeType;
      const matchesRelation = activeRelation === "all" || excerpt.relationTags.includes(activeRelation);
      const matchesEmotion = activeEmotion === "all" || excerpt.emotionTags.includes(activeEmotion);
      const matchesLanguage = activeLanguage === "all" || excerpt.language === activeLanguage;
      const haystack = [excerpt.originalText, excerpt.translationText, excerpt.plainExplanation, excerpt.usageScene, excerpt.language, ...excerpt.relationTags, ...excerpt.emotionTags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesType && matchesRelation && matchesEmotion && matchesLanguage && (!trimmedQuery || haystack.includes(trimmedQuery));
    });
  }, [activeEmotion, activeLanguage, activeRelation, activeType, excerpts, query]);

  const featuredOpenings = useMemo(() => excerpts.filter((excerpt) => excerpt.type === "opening").slice(0, 3), [excerpts]);
  const featuredClosings = useMemo(() => excerpts.filter((excerpt) => excerpt.type === "closing").slice(0, 3), [excerpts]);
  const bodySamples = useMemo(() => excerpts.filter((excerpt) => excerpt.type === "body").slice(0, 3), [excerpts]);
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

  function refreshSpotlight(type: "opening" | "closing", total: number) {
    if (total <= 1) return;
    setSpotlightIndexes((current) => {
      let next = Math.floor(Math.random() * total);
      if (next === current[type]) next = (next + 1) % total;
      return { ...current, [type]: next };
    });
  }

  const filters = (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-ink-950">搜索短句</span>
        <span className="relative block">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" size={18} />
          <input
            className="focus-ring min-h-12 w-full rounded-md border border-ink-950/10 bg-white py-2 pl-10 pr-3 text-base text-ink-950 placeholder:text-ink-600"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="敬请、Dear、思念、歉意"
            type="search"
            value={query}
          />
        </span>
      </label>

      <div>
        <p className="mb-2 text-sm font-bold text-ink-950">句子位置</p>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <Pill active={activeType === filter.value} key={filter.value} onClick={() => setActiveType(filter.value)}>
              {filter.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-ink-950">关系</p>
        <div className="flex flex-wrap gap-2">
          <Pill active={activeRelation === "all"} onClick={() => setActiveRelation("all")}>
            全部
          </Pill>
          {relationOptions.slice(0, 10).map((relation) => (
            <Pill active={activeRelation === relation} key={relation} onClick={() => setActiveRelation(relation)}>
              {relation}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-ink-950">情绪</p>
        <div className="flex flex-wrap gap-2">
          <Pill active={activeEmotion === "all"} onClick={() => setActiveEmotion("all")}>
            全部
          </Pill>
          {emotionOptions.slice(0, 10).map((emotion) => (
            <Pill active={activeEmotion === emotion} key={emotion} onClick={() => setActiveEmotion(emotion)}>
              {emotion}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-ink-950">语言</p>
        <div className="flex flex-wrap gap-2">
          <Pill active={activeLanguage === "all"} onClick={() => setActiveLanguage("all")}>
            全部
          </Pill>
          {languageOptions.map((language) => (
            <Pill active={activeLanguage === language} key={language} onClick={() => setActiveLanguage(language)}>
              {languageLabel(language)}
            </Pill>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-950/10 pt-5">
        <span className="text-sm font-semibold text-ink-650">{filtered.length} 条结果</span>
        <button
          className="focus-ring min-h-11 rounded-md px-3 text-sm font-bold text-seal-700 transition hover:bg-seal-100 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasActiveFilters}
          onClick={clearFilters}
          type="button"
        >
          清空
        </button>
      </div>
    </div>
  );

  return (
    <div className="sentence-grid bg-paper-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_360px] lg:items-stretch">
          <div className="flex min-h-[420px] flex-col justify-between rounded-md bg-white p-6 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md bg-moss-100 px-3 py-2 text-xs font-black uppercase text-moss-700">
                <Sparkles aria-hidden="true" size={15} />
                Short sentences first
              </p>
              <h1 className="mt-6 text-balance font-serif text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">收藏那些曾经需要跋山涉水，才能抵达一个人心里的话。</h1>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <Metric label="开头" value={counts.opening} />
              <Metric label="结尾" value={counts.closing} />
              <Metric label="信中句" value={counts.body} />
            </div>
          </div>

          <div className="grid gap-4">
            {spotlightTypes.map((type) => {
              const href = type === "opening" ? "/openings" : "/closings";
              const samples = type === "opening" ? featuredOpenings : featuredClosings;
              const sample = samples[spotlightIndexes[type] % Math.max(samples.length, 1)];
              return (
                <article className="group flex min-h-[200px] flex-col justify-between rounded-md bg-white p-5 shadow-soft ring-1 ring-ink-950/10 transition hover:-translate-y-0.5 hover:ring-moss-700/40" key={type}>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded-md px-3 py-1 text-xs font-black ${typeAccent[type]}`}>{typeLabel[type]}</span>
                      <div className="flex items-center gap-1">
                        <button
                          aria-label={`随机刷新${typeLabel[type]}内容`}
                          className="focus-ring grid min-h-10 min-w-10 place-items-center rounded-md text-ink-650 transition hover:bg-paper-100 hover:text-moss-700"
                          onClick={() => refreshSpotlight(type, samples.length)}
                          type="button"
                        >
                          <RefreshCw aria-hidden="true" size={16} />
                        </button>
                        <Link aria-label={`查看全部${typeLabel[type]}`} className="focus-ring grid min-h-10 min-w-10 place-items-center rounded-md text-ink-650 transition hover:bg-paper-100 hover:text-moss-700" href={href}>
                          <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" size={18} />
                        </Link>
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-semibold leading-6 text-ink-650">{typeDescription[type]}</p>
                  </div>
                  <p className="mt-5 line-clamp-3 font-serif text-2xl font-semibold leading-snug text-ink-950">{sample?.originalText}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-md bg-white p-5 shadow-soft ring-1 ring-ink-950/10">{filters}</div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md bg-white p-4 shadow-soft ring-1 ring-ink-950/10 lg:hidden">
            <div>
              <p className="text-sm font-black text-ink-950">短句筛选</p>
              <p className="mt-1 text-sm text-ink-650">{filtered.length} 条结果</p>
            </div>
            <button className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-moss-700 px-3 text-sm font-bold text-white" onClick={() => setIsFilterOpen(true)} type="button">
              <Filter aria-hidden="true" size={16} />
              筛选
            </button>
          </div>

          <div className="rounded-md bg-paper-100 p-4 ring-1 ring-ink-950/10 sm:p-6">
            <div className="mb-2 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-sm font-black uppercase text-moss-700">Sentence queue</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold text-ink-950">可复制的短句</h2>
              </div>
              <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-3 text-sm font-bold text-ink-950 ring-1 ring-ink-950/10 transition hover:bg-moss-100" href="/letters">
                完整信件
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>

            <div className="mt-5 rounded-md bg-paper-50 px-4 shadow-soft ring-1 ring-ink-950/10 sm:px-6">
              {filtered.slice(0, 80).map((excerpt, index) => (
                <SentenceRow copied={copiedId === excerpt.id} excerpt={excerpt} index={index} key={excerpt.id} onCopy={() => copyExcerpt(excerpt)} />
              ))}
              {filtered.length === 0 ? <p className="py-12 text-center text-sm font-semibold text-ink-650">没有找到匹配短句。试试“敬请”“Dear”“歉意”。</p> : null}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {bodySamples.map((excerpt) => (
              <Link className="focus-ring rounded-md bg-white p-4 shadow-soft ring-1 ring-ink-950/10 transition hover:-translate-y-0.5 hover:ring-gold-700/40" href={`/excerpts/${excerpt.id}`} key={excerpt.id}>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${typeAccent.body}`}>信中句</span>
                <p className="mt-4 line-clamp-4 font-serif text-xl font-semibold leading-snug text-ink-950">{excerpt.originalText}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="短句筛选" aria-modal="true">
          <button aria-label="关闭筛选" className="absolute inset-0 bg-moss-700/30" onClick={() => setIsFilterOpen(false)} type="button" />
          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-md bg-paper-50 p-4 shadow-editorial">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xl font-black text-ink-950">短句筛选</p>
              <button aria-label="关闭筛选" className="focus-ring grid min-h-11 min-w-11 place-items-center rounded-md bg-white text-ink-950 ring-1 ring-ink-950/10" onClick={() => setIsFilterOpen(false)} type="button">
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            {filters}
          </div>
        </div>
      ) : null}
    </div>
  );
}
