import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExcerptCard } from "@/components/excerpts/ExcerptCard";
import { getExcerptById, getLetterById, getPublishedExcerpts, getRelatedExcerpts, getSourceById } from "@/lib/content/data";

export function generateStaticParams() {
  return getPublishedExcerpts().map((excerpt) => ({ id: excerpt.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const excerpt = getExcerptById(params.id);
  if (!excerpt) return {};

  return {
    title: `${excerpt.originalText} - 书信短句`,
    description: excerpt.plainExplanation
  };
}

export default function ExcerptDetailPage({ params }: { params: { id: string } }) {
  const excerpt = getExcerptById(params.id);
  if (!excerpt) notFound();

  const letter = excerpt.letterId ? getLetterById(excerpt.letterId) : undefined;
  const source = getSourceById(excerpt.sourceId);
  const related = getRelatedExcerpts(excerpt);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="mb-3 text-sm font-medium text-seal-700">{excerpt.type === "opening" ? "开头" : excerpt.type === "closing" ? "结尾" : "正文佳句"}</p>
      <h1 className="font-serif text-4xl font-semibold leading-tight text-ink-950 sm:text-5xl">{excerpt.originalText}</h1>
      {excerpt.translationText ? <p className="mt-5 text-xl leading-8 text-ink-600">{excerpt.translationText}</p> : null}

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-paper-200 bg-white p-5">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">白话解释</h2>
          <p className="mt-3 leading-7 text-ink-800">{excerpt.plainExplanation}</p>
        </div>
        <div className="rounded-lg border border-paper-200 bg-white p-5">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">适用场景</h2>
          <p className="mt-3 leading-7 text-ink-800">{excerpt.usageScene}</p>
        </div>
      </section>

      <section className="mt-8 flex flex-wrap gap-2">
        {[...excerpt.relationTags, ...excerpt.emotionTags, excerpt.language].map((tag) => (
          <span className="rounded-full bg-paper-100 px-3 py-1 text-sm text-ink-600" key={tag}>
            {tag}
          </span>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-paper-200 bg-white p-5 text-sm leading-6 text-ink-600">
        <h2 className="font-serif text-xl font-semibold text-ink-950">来源</h2>
        {letter ? (
          <p className="mt-3">
            摘自{" "}
            <Link className="focus-ring rounded-md underline underline-offset-4" href={`/letters/${letter.slug}`}>
              {letter.title}
            </Link>
            。
          </p>
        ) : null}
        <p className="mt-3">{source?.licenseNote ?? "来源信息待补充。"}</p>
      </section>

      {related.length ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">相关短句</h2>
          <div className="mt-5 grid gap-5">
            {related.map((item) => (
              <ExcerptCard excerpt={item} key={item.id} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
