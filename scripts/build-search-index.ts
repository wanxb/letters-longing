import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(root, path), "utf8")) as T;
}

const letters = readJson<Array<Record<string, any>>>("data/letters.json").filter((item) => item.publishStatus === "published");
const excerpts = readJson<Array<Record<string, any>>>("data/excerpts.json").filter((item) => item.publishStatus === "published");
const topics = readJson<Array<Record<string, any>>>("data/topics.json").filter((item) => item.publishStatus === "published");

const items = [
  ...excerpts.map((excerpt) => ({
    id: excerpt.id,
    type: "excerpt",
    title: excerpt.originalText,
    description: excerpt.plainExplanation,
    url: `/excerpts/${excerpt.id}`,
    language: excerpt.language,
    relation: excerpt.relationTags?.[0],
    tags: [...(excerpt.relationTags ?? []), ...(excerpt.emotionTags ?? [])],
    text: [excerpt.originalText, excerpt.translationText, excerpt.plainExplanation, excerpt.usageScene, ...(excerpt.relationTags ?? []), ...(excerpt.emotionTags ?? [])]
      .filter(Boolean)
      .join(" ")
  })),
  ...letters.map((letter) => ({
    id: letter.id,
    type: "letter",
    title: letter.title,
    description: letter.summary,
    url: `/letters/${letter.slug}`,
    language: letter.language,
    relation: letter.relationship,
    tags: letter.tags ?? [],
    text: [letter.title, letter.author, letter.recipient, letter.summary, letter.background, ...(letter.tags ?? [])].filter(Boolean).join(" ")
  })),
  ...topics.map((topic) => ({
    id: topic.id,
    type: "topic",
    title: topic.title,
    description: topic.description,
    url: `/topics/${topic.slug}`,
    tags: topic.tags ?? [],
    text: [topic.title, topic.description, topic.body, ...(topic.tags ?? [])].filter(Boolean).join(" ")
  }))
];

const target = join(root, "public/search-index.json");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(items, null, 2)}\n`, "utf8");
console.log(`Built search index with ${items.length} items.`);
