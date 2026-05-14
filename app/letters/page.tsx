import type { Metadata } from "next";
import { LetterCard } from "@/components/letters/LetterCard";
import { Section } from "@/components/ui/Section";
import { getPublishedLetters } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "世界书信馆",
  description: "浏览公版公开信与本站整理的书信背景、短句和来源说明。"
};

export default function LettersPage() {
  const letters = getPublishedLetters();

  return (
    <Section eyebrow="Letters" title="世界书信馆" description="先从少量可信来源开始，逐步扩展到更多语言、时代和关系。">
      <div className="grid gap-5 lg:grid-cols-2">
        {letters.map((letter) => (
          <LetterCard letter={letter} key={letter.id} />
        ))}
      </div>
    </Section>
  );
}
