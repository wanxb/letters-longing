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
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="mb-3 text-sm font-medium text-seal-700">专题</p>
      <h1 className="font-serif text-4xl font-semibold leading-tight text-ink-950 sm:text-5xl">{topic.title}</h1>
      <p className="mt-5 text-lg leading-8 text-ink-800">{topic.description}</p>
      <div className="mt-10 rounded-lg border border-paper-200 bg-white p-6 text-base leading-8 text-ink-800">{topic.body}</div>

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

      {letters.length ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">相关信件</h2>
          <div className="mt-5 grid gap-5">
            {letters.map((letter) => (
              <LetterCard letter={letter} key={letter.id} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
