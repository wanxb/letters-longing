import { SentenceIndex } from "@/components/search/SentenceIndex";
import { getPublishedExcerpts } from "@/lib/content/data";

export default function HomePage() {
  return <SentenceIndex excerpts={getPublishedExcerpts()} />;
}
