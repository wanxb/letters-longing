"use client";

import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { Excerpt, ExcerptType } from "@/lib/types";
import { useState } from "react";

const typeLabel: Record<ExcerptType, string> = {
  opening: "开头",
  closing: "结尾",
  body: "信中句"
};

const typeAccent: Record<ExcerptType, string> = {
  opening: "bg-moss-100 text-moss-700",
  closing: "bg-seal-100 text-seal-700",
  body: "bg-gold-100 text-gold-700"
};

export function ExcerptCard({ excerpt }: { excerpt: Excerpt }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(excerpt.translationText ? `${excerpt.originalText}\n${excerpt.translationText}` : excerpt.originalText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className="grid min-h-full gap-5 rounded-md bg-white p-4 shadow-soft ring-1 ring-ink-950/10 transition hover:-translate-y-0.5 hover:ring-moss-700/40 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-md px-2.5 py-1 text-xs font-black ${typeAccent[excerpt.type]}`}>{typeLabel[excerpt.type]}</span>
        <span className="rounded-md bg-paper-100 px-2.5 py-1 text-xs font-bold uppercase text-ink-650">{excerpt.language}</span>
      </div>

      <div>
        <blockquote className="text-balance font-serif text-2xl font-semibold leading-snug text-ink-950">{excerpt.originalText}</blockquote>
        {excerpt.translationText ? <p className="mt-4 text-sm leading-6 text-ink-650">{excerpt.translationText}</p> : null}
        <p className="mt-4 text-sm leading-6 text-ink-650">{excerpt.plainExplanation}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[...excerpt.relationTags, ...excerpt.emotionTags].slice(0, 4).map((tag) => (
          <span className="rounded-md bg-paper-50 px-2.5 py-1 text-xs font-semibold text-ink-650 ring-1 ring-ink-950/10" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <button
          aria-label="复制短句"
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-moss-700 px-3 text-sm font-bold text-white transition hover:bg-ink-800"
          onClick={copyText}
          type="button"
        >
          {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
          {copied ? "已复制" : "复制"}
        </button>
        <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-bold text-moss-700 transition hover:bg-moss-100" href={`/excerpts/${excerpt.id}`}>
          详情
          <ExternalLink aria-hidden="true" size={15} />
        </Link>
      </div>
    </article>
  );
}
