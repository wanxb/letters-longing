import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExcerptCard } from "@/components/excerpts/ExcerptCard";
import { LetterCard } from "@/components/letters/LetterCard";
import { getExcerptsByRelation, getLettersByRelation, getTags } from "@/lib/content/data";

const relationMap: Record<string, string> = {
  love: "爱情",
  family: "亲情",
  friendship: "友情",
  condolence: "慰问"
};

export function generateStaticParams() {
  return Object.keys(relationMap).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const name = relationMap[params.slug];
  if (!name) return {};
  return {
    title: `${name}书信表达`,
    description: `按${name}关系整理的书信开头、结尾、公开信和专题。`
  };
}

export default function RelationPage({ params }: { params: { slug: string } }) {
  const relation = relationMap[params.slug];
  if (!relation) notFound();

  const excerpts = getExcerptsByRelation(relation);
  const letters = getLettersByRelation(relation);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="mb-3 text-sm font-medium text-seal-700">Relations</p>
      <h1 className="font-serif text-4xl font-semibold text-ink-950 sm:text-5xl">{relation}书信表达</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-800">按关系组织开头、结尾和公开信，先帮助你找到合适的语气。</p>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-ink-950">相关短句</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {excerpts.map((excerpt) => (
            <ExcerptCard excerpt={excerpt} key={excerpt.id} />
          ))}
        </div>
      </section>

      {letters.length ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-ink-950">相关信件</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {letters.map((letter) => (
              <LetterCard letter={letter} key={letter.id} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
