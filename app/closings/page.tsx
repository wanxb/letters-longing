import type { Metadata } from "next";
import { ExcerptExplorer } from "@/components/filters/ExcerptExplorer";
import { Section } from "@/components/ui/Section";
import { getPublishedExcerpts } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "结尾短句",
  description: "整理公开书信里的结尾句，支持搜索、筛选和复制。"
};

export default function ClosingsPage() {
  return (
    <Section eyebrow="Closings" title="结尾短句" description="先找署名前的分寸、敬意和余韵，再回到全文语境。">
      <ExcerptExplorer excerpts={getPublishedExcerpts("closing")} />
    </Section>
  );
}
