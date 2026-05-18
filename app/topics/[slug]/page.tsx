import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExcerptCard } from "@/components/excerpts/ExcerptCard";
import { LetterCard } from "@/components/letters/LetterCard";
import { getExcerptById, getLetterById, getPublishedTopics, getTopicBySlug } from "@/lib/content/data";
import type { Excerpt, Letter } from "@/lib/types";

function isExcerpt(value: Excerpt | undefined): value is Excerpt {
  return Boolean(value);
}

function isLetter(value: Letter | undefined): value is Letter {
  return Boolean(value);
}

export function generateStaticParams() {
  return getPublishedTopics().map((topic) => ({ slug: topic.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topic = getTopicBySlug(params.slug);
  if (!topic) return {};

  return {
    title: topic.title,
    description: topic.description
  };
}

export default function TopicDetailPage({ params }: { params: { slug: string } }) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) notFound();

  const excerpts = topic.relatedExcerptIds.map(getExcerptById).filter(isExcerpt);
  const letters = topic.relatedLetterIds.map(getLetterById).filter(isLetter);

  return (
    <article className="sentence-grid bg-paper-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="rounded-md bg-white p-5 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-8">
        <p className="mb-4 inline-flex rounded-md bg-gold-100 px-3 py-1 text-xs font-black text-gold-700">专题</p>
        <h1 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-6xl">{topic.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-650">{topic.description}</p>
      </section>
      <div className="mt-6 rounded-md bg-white p-6 text-base leading-8 text-ink-650 shadow-soft ring-1 ring-ink-950/10">{topic.body}</div>

      {excerpts.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-3xl font-semibold text-ink-950">相关短句</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {excerpts.map((excerpt) => (
              <ExcerptCard excerpt={excerpt} key={excerpt.id} />
            ))}
          </div>
        </section>
      ) : null}

      {letters.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-3xl font-semibold text-ink-950">相关信件</h2>
          <div className="mt-5 grid gap-4">
            {letters.map((letter) => (
              <LetterCard letter={letter} key={letter.id} />
            ))}
          </div>
        </section>
      ) : null}
      </div>
    </article>
  );
}
