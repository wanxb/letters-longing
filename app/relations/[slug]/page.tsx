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
    <div className="sentence-grid bg-paper-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="rounded-md bg-white p-5 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-8">
        <p className="mb-4 inline-flex rounded-md bg-moss-100 px-3 py-1 text-xs font-black text-moss-700">Relations</p>
        <h1 className="font-serif text-4xl font-semibold sm:text-6xl">{relation}书信表达</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-650">按关系组织开头、结尾和信中句，先帮助你找到合适的语气。</p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-3xl font-semibold text-ink-950">相关短句</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {excerpts.map((excerpt) => (
            <ExcerptCard excerpt={excerpt} key={excerpt.id} />
          ))}
        </div>
      </section>

      {letters.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-3xl font-semibold text-ink-950">完整信件语境</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {letters.map((letter) => (
              <LetterCard letter={letter} key={letter.id} />
            ))}
          </div>
        </section>
      ) : null}
      </div>
    </div>
  );
}
