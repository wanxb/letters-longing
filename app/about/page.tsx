import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "了解尺素的内容范围与来源原则。"
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold text-ink-950 sm:text-5xl">关于尺素</h1>
      <p className="mt-6 text-lg leading-8 text-ink-800">尺素是一处书信索引，也是一张慢慢展开的情意地图。</p>
      <section className="mt-10 space-y-4 rounded-[8px] border border-paper-200 bg-white p-6 leading-7 text-ink-800">
        <h2 className="font-serif text-2xl font-semibold text-ink-950">内容原则</h2>
        <p>每一条摘录都应能回到来源，每一段整理都应和原文保持清楚的边界。</p>
        <p>我们更关心语气、出处和使用场景，而不只是收集漂亮句子。</p>
      </section>
    </article>
  );
}
