import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExcerptCard } from "@/components/excerpts/ExcerptCard";
import { LetterCard } from "@/components/letters/LetterCard";
import { SearchPanel } from "@/components/search/SearchPanel";
import { Section } from "@/components/ui/Section";
import { getPublishedExcerpts, getPublishedLetters, getPublishedTopics } from "@/lib/content/data";
import { buildSearchItems } from "@/lib/search/build";

export default function HomePage() {
  const openings = getPublishedExcerpts("opening").slice(0, 2);
  const closings = getPublishedExcerpts("closing").slice(0, 1);
  const letters = getPublishedLetters().slice(0, 3);
  const topics = getPublishedTopics();
  const searchItems = buildSearchItems();
  const featured = openings[0];

  return (
    <>
      <section className="relative min-h-[calc(100dvh-69px)] overflow-hidden border-b border-paper-200 bg-[#f6efe3]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[54%] h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eadfce] blur-3xl" />
          <div className="absolute -left-24 bottom-10 h-56 w-80 rotate-[-10deg] rounded-[8px] border border-paper-200 bg-[#fffdf8]/70 shadow-soft" />
          <div className="absolute -right-24 top-28 h-56 w-80 rotate-[8deg] rounded-[8px] border border-paper-200 bg-[#fffdf8]/70 shadow-soft" />
          <div className="absolute left-[9%] top-[18%] hidden h-28 w-28 rounded-full border border-seal-700/20 lg:block" />
          <div className="absolute left-[10.2%] top-[19.8%] hidden h-20 w-20 rounded-full border border-seal-700/25 lg:block" />
          <div className="absolute left-[16%] top-[23%] hidden h-px w-28 rotate-[-8deg] bg-seal-700/20 lg:block" />
          <div className="absolute left-[16%] top-[25%] hidden h-px w-24 rotate-[-8deg] bg-seal-700/20 lg:block" />
          <div className="absolute left-[16%] top-[27%] hidden h-px w-20 rotate-[-8deg] bg-seal-700/20 lg:block" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100dvh-69px)] max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="z-10 max-w-xl">
              <div className="mb-7 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-seal-700">
                <span className="h-px w-10 bg-seal-700" />
                <span>Letters crossed distance</span>
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-tight text-ink-950 sm:text-6xl lg:text-7xl">
                <span className="block">收藏那些曾经</span>
                <span className="block text-seal-700">跋山涉水</span>
                <span className="block">抵达心里的话</span>
              </h1>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-sm font-medium text-paper-50 transition hover:bg-ink-800" href="/openings">
                  去启笺
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link className="focus-ring inline-flex min-h-11 items-center rounded-full border border-paper-300 bg-[#fffdf8] px-5 py-3 text-sm font-medium text-ink-950 transition hover:bg-white" href="/letters">
                  看书信
                </Link>
              </div>
            </div>

            <div className="relative mx-auto h-[390px] w-full max-w-[620px] sm:h-[520px] lg:h-[620px]">
              <div className="absolute inset-x-6 bottom-6 h-[220px] rounded-[12px] border border-paper-300 bg-[#d7c6ae] shadow-editorial sm:inset-x-8 sm:h-[310px]">
                <div className="absolute inset-x-0 top-0 h-full rounded-[12px] bg-[#e7d8c3]" style={{ clipPath: "polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)" }} />
                <div className="absolute inset-x-0 top-0 h-full rounded-[12px] bg-[#cdb89d]" style={{ clipPath: "polygon(0 0, 50% 60%, 100% 0, 50% 84%)" }} />
              </div>

              <div className="absolute left-1/2 top-0 h-[350px] w-[78%] max-w-[430px] -translate-x-1/2 rotate-[-3deg] overflow-hidden rounded-[10px] border border-paper-200 bg-[#fffdf8] p-5 shadow-editorial sm:h-[470px] sm:p-8">
                <div className="pointer-events-none absolute inset-0 rounded-[10px] border-[10px] border-transparent opacity-60 [border-image:repeating-linear-gradient(45deg,#8b2f2b_0_8px,#fffdf8_8px_14px,#3d5366_14px_22px,#fffdf8_22px_28px)_10]" />
                <div className="absolute inset-x-6 top-24 space-y-6 opacity-70 sm:inset-x-8">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span className="block h-px bg-paper-150" key={index} />
                  ))}
                </div>
                <div className="absolute right-7 top-7 grid h-16 w-12 place-items-center border border-dashed border-seal-700/45 bg-seal-100/60 text-center font-serif text-[9px] uppercase leading-tight tracking-[0.12em] text-seal-700 sm:h-20 sm:w-16">
                  <span>
                    Letter
                    <br />
                    01
                  </span>
                </div>
                <div className="pointer-events-none absolute right-20 top-14 hidden h-20 w-20 rounded-full border border-ink-600/20 sm:block" />
                <div className="pointer-events-none absolute right-[5.8rem] top-[4.25rem] hidden h-14 w-14 rounded-full border border-ink-600/20 sm:block" />
                <div className="pointer-events-none absolute right-28 top-20 hidden h-px w-20 rotate-[-8deg] bg-ink-600/20 sm:block" />
                <div className="pointer-events-none absolute right-28 top-24 hidden h-px w-16 rotate-[-8deg] bg-ink-600/20 sm:block" />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-paper-200 pb-4 pr-16 text-xs uppercase tracking-[0.16em] text-ink-600 sm:pr-24">
                    <span>Daily Opening</span>
                    <span>01</span>
                  </div>
                  {featured ? (
                    <>
                      <blockquote className="mt-8 font-serif text-[1.55rem] leading-tight text-ink-950 sm:text-3xl">{featured.originalText}</blockquote>
                      {featured.translationText ? <p className="mt-5 text-sm leading-6 text-ink-700">{featured.translationText}</p> : null}
                    </>
                  ) : null}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="h-12 w-12 rounded-full border border-seal-700/40 text-center font-serif text-[9px] uppercase leading-[48px] tracking-[0.14em] text-seal-700/70 shadow-[0_0_0_4px_rgba(139,47,43,0.04)]">
                      Chisu
                    </span>
                    {featured ? (
                      <Link className="focus-ring rounded-full border border-paper-300 bg-white px-4 py-2 text-sm text-ink-800 hover:bg-paper-50" href={`/excerpts/${featured.id}`}>
                        语境
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-[55%] hidden max-h-[230px] w-[300px] rotate-[2deg] overflow-hidden rounded-[8px] lg:block">
                <SearchPanel items={searchItems} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-paper-200 bg-paper-50">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["启笺", "寻找第一句的分寸"],
            ["收笔", "让最后一句停得好"],
            ["书信", "回到来源和上下文"]
          ].map(([title, desc], index) => (
            <div className="border-b border-paper-200 py-6 md:border-b-0 md:border-r md:px-6 last:md:border-r-0" key={title}>
              <p className="text-xs text-seal-700">0{index + 1}</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-ink-950">{title}</h2>
              <p className="mt-2 text-sm text-ink-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Excerpts" title="启笺与收笔" description="一句话先要有语境，再谈漂亮。">
        <div className="grid gap-5 lg:grid-cols-3">
          {[...openings, ...closings].map((excerpt) => (
            <ExcerptCard excerpt={excerpt} key={excerpt.id} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Letters" title="公开书信" description="文本、来源和摘录放在同一条阅读路径里。">
        <div className="grid gap-0 border-t border-paper-200">
          {letters.map((letter) => (
            <LetterCard letter={letter} key={letter.id} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Topics" title="专题" description="把表达问题放回具体书信里阅读。">
        <div className="grid gap-5 md:grid-cols-2">
          {topics.map((topic) => (
            <Link className="focus-ring group rounded-[8px] border border-paper-200 bg-paper-50 p-6 transition hover:border-seal-100 hover:bg-white" href={`/topics/${topic.slug}`} key={topic.id}>
              <span className="text-xs uppercase tracking-[0.16em] text-seal-700">Essay</span>
              <h3 className="mt-5 font-serif text-3xl font-semibold leading-tight text-ink-950 group-hover:text-seal-700">{topic.title}</h3>
              <p className="mt-4 text-sm leading-6 text-ink-600">{topic.description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
