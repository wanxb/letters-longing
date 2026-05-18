import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "了解尺素的内容范围与来源原则。"
};

export default function AboutPage() {
  return (
    <article className="sentence-grid bg-paper-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="rounded-md bg-white p-5 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-8">
        <p className="mb-4 inline-flex rounded-md bg-moss-100 px-3 py-1 text-xs font-black text-moss-700">About</p>
        <h1 className="font-serif text-4xl font-semibold sm:text-6xl">关于尺素句库</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-650">这里先整理可用短句，再用完整信件校准语境。</p>
      </section>
      <section className="mt-6 space-y-4 rounded-md bg-white p-6 leading-7 text-ink-650 shadow-soft ring-1 ring-ink-950/10">
        <h2 className="text-sm font-black uppercase text-moss-700">内容原则</h2>
        <p>每一条摘录都应能回到来源，每一段整理都应和原文保持清楚的边界。</p>
        <p>我们更关心语气、出处和使用场景，而不只是收集漂亮句子。</p>
      </section>
      </div>
    </article>
  );
}
