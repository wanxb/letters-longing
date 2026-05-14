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
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="mb-3 text-sm font-medium text-seal-700">{letter.relationship}</p>
      <h1 className="font-serif text-4xl font-semibold leading-tight text-ink-950 sm:text-5xl">{letter.title}</h1>
      <p className="mt-4 text-base text-ink-600">
        {letter.author}
        {letter.recipient ? ` 写给 ${letter.recipient}` : ""} · {letter.writtenDate ?? "时间不详"}
      </p>
      <p className="mt-6 text-lg leading-8 text-ink-800">{letter.summary}</p>

      {letter.background ? (
        <section className="mt-10 rounded-lg border border-paper-200 bg-white p-5">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">背景</h2>
          <p className="mt-3 leading-7 text-ink-800">{letter.background}</p>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-ink-950">原文</h2>
        <div className="mt-4 whitespace-pre-line rounded-lg border border-paper-200 bg-white p-6 font-serif text-xl leading-9 text-ink-950">{letter.originalText}</div>
      </section>

      {letter.translationText ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">本站整理译文</h2>
          <div className="mt-4 whitespace-pre-line rounded-lg border border-paper-200 bg-paper-100 p-6 text-base leading-8 text-ink-800">{letter.translationText}</div>
        </section>
      ) : null}

      {excerpts.length ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">相关短句</h2>
          <div className="mt-5 grid gap-5">
            {excerpts.map((excerpt) => (
              <ExcerptCard excerpt={excerpt} key={excerpt.id} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 rounded-lg border border-paper-200 bg-white p-5 text-sm leading-6 text-ink-600">
        <h2 className="font-serif text-xl font-semibold text-ink-950">来源与版权</h2>
        <p className="mt-3">{source?.licenseNote ?? "来源信息待补充。"}</p>
        {source?.url ? (
          <a className="focus-ring mt-3 inline-block rounded-md underline underline-offset-4" href={source.url} rel="noreferrer" target="_blank">
            查看来源
          </a>
        ) : null}
      </section>
    </article>
  );
}
