import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Letter } from "@/lib/types";

export function LetterCard({ letter }: { letter: Letter }) {
  return (
    <article className="grid gap-5 rounded-[8px] border border-paper-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-seal-700/25 hover:shadow-soft md:grid-cols-[170px_1fr_auto] md:items-start md:p-6">
      <div className="text-sm text-ink-600">
        <p>{letter.writtenDate ?? "时间不详"}</p>
        <p className="mt-1 font-semibold uppercase tracking-[0.12em] text-moss-700">{letter.language}</p>
      </div>
      <div>
        <h3 className="font-serif text-2xl font-semibold leading-tight text-ink-950 sm:text-3xl">
          <Link className="focus-ring rounded-md hover:text-seal-700" href={`/letters/${letter.slug}`}>
            {letter.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-ink-600">
          {letter.author}
          {letter.recipient ? ` 写给 ${letter.recipient}` : ""}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-800">{letter.summary}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:max-w-[190px] md:justify-end">
        {[letter.relationship, ...letter.tags.slice(0, 2)].map((tag) => (
          <span className="rounded-full bg-paper-100 px-3 py-1 text-xs font-medium text-ink-650" key={tag}>
            {tag}
          </span>
        ))}
        <Link className="focus-ring inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold text-seal-700 hover:bg-seal-100" href={`/letters/${letter.slug}`}>
          阅读
          <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </article>
  );
}
