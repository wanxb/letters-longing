import Link from "next/link";
import type { Letter } from "@/lib/types";

export function LetterCard({ letter }: { letter: Letter }) {
  return (
    <article className="grid gap-4 border-b border-paper-200 py-6 last:border-b-0 md:grid-cols-[150px_1fr_auto] md:items-start">
      <div className="text-sm text-ink-600">
        <p>{letter.writtenDate ?? "时间不详"}</p>
        <p className="mt-1">{letter.language.toUpperCase()}</p>
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
      <div className="flex flex-wrap gap-2 md:max-w-[180px] md:justify-end">
        {[letter.relationship, ...letter.tags.slice(0, 2)].map((tag) => (
          <span className="rounded-full border border-paper-200 bg-paper-50 px-3 py-1 text-xs text-ink-600" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
