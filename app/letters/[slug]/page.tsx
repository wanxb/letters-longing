import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExcerptCard } from "@/components/excerpts/ExcerptCard";
import { getLetterBySlug, getPublishedExcerpts, getPublishedLetters, getSourceById } from "@/lib/content/data";

export function generateStaticParams() {
  return getPublishedLetters().map((letter) => ({ slug: letter.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const letter = getLetterBySlug(params.slug);
  if (!letter) return {};

  return {
    title: `${letter.title} - ${letter.author}`,
    description: letter.summary
  };
}

export default function LetterDetailPage({ params }: { params: { slug: string } }) {
  const letter = getLetterBySlug(params.slug);
  if (!letter) notFound();

  const source = getSourceById(letter.sourceId);
  const excerpts = getPublishedExcerpts().filter((excerpt) => excerpt.letterId === letter.id);

  return (
    <article className="sentence-grid bg-paper-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-md bg-white p-5 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-8">
          <p className="mb-4 inline-flex rounded-md bg-moss-100 px-3 py-1 text-xs font-black text-moss-700">{letter.relationship}</p>
          <h1 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-6xl">{letter.title}</h1>
          <p className="mt-4 text-base font-semibold text-ink-650">
            {letter.author}
            {letter.recipient ? ` 写给 ${letter.recipient}` : ""} · {letter.writtenDate ?? "时间不详"}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-650">{letter.summary}</p>
        </section>

        {letter.background ? (
          <section className="mt-6 rounded-md bg-white p-5 shadow-soft ring-1 ring-ink-950/10">
            <h2 className="text-sm font-black uppercase text-moss-700">背景</h2>
            <p className="mt-3 leading-7 text-ink-650">{letter.background}</p>
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="font-serif text-3xl font-semibold text-ink-950">原文</h2>
          <div className="mt-4 whitespace-pre-line rounded-md bg-white p-5 font-serif text-xl leading-9 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-6">{letter.originalText}</div>
        </section>

        {letter.translationText ? (
          <section className="mt-8">
            <h2 className="font-serif text-3xl font-semibold text-ink-950">本站整理译文</h2>
            <div className="mt-4 whitespace-pre-line rounded-md bg-paper-100 p-5 text-base leading-8 text-ink-650 shadow-soft ring-1 ring-ink-950/10 sm:p-6">{letter.translationText}</div>
          </section>
        ) : null}

        {excerpts.length ? (
          <section className="mt-8">
            <h2 className="font-serif text-3xl font-semibold text-ink-950">这封信里的短句</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {excerpts.map((excerpt) => (
                <ExcerptCard excerpt={excerpt} key={excerpt.id} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-md bg-white p-5 text-sm leading-6 text-ink-650 shadow-soft ring-1 ring-ink-950/10">
          <h2 className="text-sm font-black uppercase text-ink-950">来源与版权</h2>
          <p className="mt-3">{source?.licenseNote ?? "来源信息待补充。"}</p>
          {source?.url ? (
            <a className="focus-ring mt-3 inline-block rounded-md font-bold text-moss-700 underline underline-offset-4" href={source.url} rel="noreferrer" target="_blank">
              查看来源
            </a>
          ) : null}
        </section>
      </div>
    </article>
  );
}
