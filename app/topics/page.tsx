import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { getPublishedTopics } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "专题",
  description: "围绕书信开头、结尾、慰问和情感表达整理的专题内容。"
};

export default function TopicsPage() {
  return (
    <Section eyebrow="Topics" title="专题" description="用更完整的语境理解一句话如何成立。">
      <div className="grid gap-4 md:grid-cols-2">
        {getPublishedTopics().map((topic) => (
          <Link className="focus-ring rounded-md bg-white p-5 shadow-soft ring-1 ring-ink-950/10 transition hover:-translate-y-0.5 hover:ring-moss-700/40" href={`/topics/${topic.slug}`} key={topic.id}>
            <span className="rounded-md bg-gold-100 px-2.5 py-1 text-xs font-black text-gold-700">专题</span>
            <h2 className="font-serif text-2xl font-semibold text-ink-950">{topic.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-650">{topic.description}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
