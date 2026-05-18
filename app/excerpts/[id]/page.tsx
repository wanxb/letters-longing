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
    <article className="sentence-grid bg-paper-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-md bg-white p-5 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-8">
          <p className="mb-4 inline-flex rounded-md bg-moss-100 px-3 py-1 text-xs font-black text-moss-700">{excerpt.type === "opening" ? "开头短句" : excerpt.type === "closing" ? "结尾短句" : "信中句"}</p>
          <h1 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-6xl">{excerpt.originalText}</h1>
          {excerpt.translationText ? <p className="mt-5 max-w-3xl text-xl leading-8 text-ink-650">{excerpt.translationText}</p> : null}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-ink-950/10">
            <h2 className="text-sm font-black uppercase text-moss-700">解释</h2>
            <p className="mt-3 leading-7 text-ink-650">{excerpt.plainExplanation}</p>
          </div>
          <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-ink-950/10">
            <h2 className="text-sm font-black uppercase text-seal-700">使用场景</h2>
            <p className="mt-3 leading-7 text-ink-650">{excerpt.usageScene}</p>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap gap-2">
          {[...excerpt.relationTags, ...excerpt.emotionTags, excerpt.language].map((tag) => (
            <span className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-ink-650 shadow-soft ring-1 ring-ink-950/10" key={tag}>
              {tag}
            </span>
          ))}
        </section>

        <section className="mt-6 rounded-md bg-white p-5 text-sm leading-6 text-ink-650 shadow-soft ring-1 ring-ink-950/10">
          <h2 className="text-sm font-black uppercase text-ink-950">来源</h2>
          {letter ? (
            <p className="mt-3">
              摘自{" "}
              <Link className="focus-ring rounded-md font-bold text-moss-700 underline underline-offset-4" href={`/letters/${letter.slug}`}>
                {letter.title}
              </Link>
              。
            </p>
          ) : null}
          <p className="mt-3">{source?.licenseNote ?? "来源信息待补充。"}</p>
        </section>

        {related.length ? (
          <section className="mt-8">
            <h2 className="font-serif text-3xl font-semibold text-ink-950">相关短句</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <ExcerptCard excerpt={item} key={item.id} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
