"use client";

import Link from "next/link";
import { Copy } from "lucide-react";
import type { Excerpt } from "@/lib/types";
import { useState } from "react";

export function ExcerptCard({ excerpt }: { excerpt: Excerpt }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(excerpt.translationText ? `${excerpt.originalText}\n${excerpt.translationText}` : excerpt.originalText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className="group flex min-h-full flex-col rounded-[8px] border border-paper-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-moss-700/25 hover:shadow-soft sm:p-6">
      <div className="mb-6 flex flex-wrap gap-2">
        {[...excerpt.relationTags, ...excerpt.emotionTags].slice(0, 3).map((tag) => (
          <span className="rounded-full bg-moss-100 px-3 py-1 text-xs font-medium text-moss-700" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <blockquote className="font-serif text-2xl leading-snug text-ink-950 sm:text-[1.65rem]">{excerpt.originalText}</blockquote>
      {excerpt.translationText ? <p className="mt-5 text-sm leading-6 text-ink-650">{excerpt.translationText}</p> : null}
      <p className="mt-5 text-sm leading-6 text-ink-800">{excerpt.plainExplanation}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
        <button
          aria-label="复制短句"
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-paper-50 transition hover:bg-ink-800"
          onClick={copyText}
          type="button"
        >
          <Copy aria-hidden="true" size={16} />
          {copied ? "已复制" : "复制"}
        </button>
        <Link className="focus-ring rounded-full px-4 py-2 text-sm font-semibold text-seal-700 hover:bg-seal-100" href={`/excerpts/${excerpt.id}`}>
          读语境
        </Link>
      </div>
    </article>
  );
}
