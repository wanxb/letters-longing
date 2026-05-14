import type { Metadata } from "next";
import { ExcerptExplorer } from "@/components/filters/ExcerptExplorer";
import { Section } from "@/components/ui/Section";
import { getPublishedExcerpts } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "收笔",
  description: "整理公开书信里的结尾句，支持搜索、筛选和复制。"
};

export default function ClosingsPage() {
  return (
    <Section eyebrow="Closings" title="收笔" description="最后一句不必用力，却要留得住分寸。">
      <ExcerptExplorer excerpts={getPublishedExcerpts("closing")} />
    </Section>
  );
}
