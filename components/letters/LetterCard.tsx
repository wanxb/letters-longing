import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Letter } from "@/lib/types";

export function LetterCard({ letter }: { letter: Letter }) {
  return (
    <article className="grid gap-5 rounded-md bg-white p-5 shadow-soft ring-1 ring-ink-950/10 transition hover:-translate-y-0.5 hover:ring-moss-700/40 md:grid-cols-[150px_1fr] md:p-6">
      <div className="space-y-3 text-sm text-ink-650">
        <p className="font-bold text-ink-950">{letter.writtenDate ?? "时间不详"}</p>
        <p className="inline-flex rounded-md bg-paper-100 px-2.5 py-1 text-xs font-black uppercase text-ink-650">{letter.language}</p>
      </div>
      <div>
        <h2 className="font-serif text-2xl font-semibold leading-tight text-ink-950 sm:text-3xl">
          <Link className="focus-ring rounded-md hover:text-seal-700" href={`/letters/${letter.slug}`}>
            {letter.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm font-semibold text-ink-650">
          {letter.author}
          {letter.recipient ? ` 写给 ${letter.recipient}` : ""}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-650">{letter.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[letter.relationship, ...letter.tags.slice(0, 2)].map((tag) => (
            <span className="rounded-md bg-paper-50 px-2.5 py-1 text-xs font-semibold text-ink-650 ring-1 ring-ink-950/10" key={tag}>
              {tag}
            </span>
          ))}
          <Link className="focus-ring inline-flex min-h-10 items-center gap-1 rounded-md px-3 text-sm font-bold text-moss-700 hover:bg-moss-100" href={`/letters/${letter.slug}`}>
            阅读语境
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
