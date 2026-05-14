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
      <div className="grid gap-5 md:grid-cols-2">
        {getPublishedTopics().map((topic) => (
          <Link className="focus-ring rounded-lg border border-paper-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5" href={`/topics/${topic.slug}`} key={topic.id}>
            <h2 className="font-serif text-2xl font-semibold text-ink-950">{topic.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">{topic.description}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
