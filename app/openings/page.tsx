import type { Metadata } from "next";
import { ExcerptExplorer } from "@/components/filters/ExcerptExplorer";
import { Section } from "@/components/ui/Section";
import { getPublishedExcerpts } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "开头短句",
  description: "整理公开书信里的开篇句，支持搜索、筛选和复制。"
};

export default function OpeningsPage() {
  return (
    <Section eyebrow="Openings" title="开头短句" description="优先处理称谓、距离和入题方式；完整信件只是语境。">
      <ExcerptExplorer excerpts={getPublishedExcerpts("opening")} />
    </Section>
  );
}
