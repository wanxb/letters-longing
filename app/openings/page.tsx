import type { Metadata } from "next";
import { ExcerptExplorer } from "@/components/filters/ExcerptExplorer";
import { Section } from "@/components/ui/Section";
import { getPublishedExcerpts } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "启笺",
  description: "整理公开书信里的开篇句，支持搜索、筛选和复制。"
};

export default function OpeningsPage() {
  return (
    <Section eyebrow="Openings" title="启笺" description="信的第一句，要先把语气放轻。">
      <ExcerptExplorer excerpts={getPublishedExcerpts("opening")} />
    </Section>
  );
}
