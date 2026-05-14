import { readFileSync } from "node:fs";
import { join } from "node:path";

type RecordWithId = { id: string; publishStatus?: string };

const root = process.cwd();

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(root, path), "utf8")) as T;
}

function assertUnique(items: RecordWithId[], label: string, key: "id" | "slug" = "id") {
  const seen = new Set<string>();
  for (const item of items as Array<RecordWithId & { slug?: string }>) {
    const value = key === "id" ? item.id : item.slug;
    if (!value) throw new Error(`${label} has missing ${key}`);
    if (seen.has(value)) throw new Error(`${label} has duplicate ${key}: ${value}`);
    seen.add(value);
  }
}

function assertRequired(value: unknown, message: string) {
  if (value === undefined || value === null || value === "") {
    throw new Error(message);
  }
}

const letters = readJson<Array<Record<string, any>>>("data/letters.json");
const excerpts = readJson<Array<Record<string, any>>>("data/excerpts.json");
const sources = readJson<Array<Record<string, any>>>("data/sources.json");
const tags = readJson<Array<Record<string, any>>>("data/tags.json");
const topics = readJson<Array<Record<string, any>>>("data/topics.json");

assertUnique(letters as RecordWithId[], "letters");
assertUnique(letters as RecordWithId[], "letters", "slug");
assertUnique(excerpts as RecordWithId[], "excerpts");
assertUnique(sources as RecordWithId[], "sources");
assertUnique(tags as RecordWithId[], "tags");
assertUnique(topics as RecordWithId[], "topics");
assertUnique(topics as RecordWithId[], "topics", "slug");

const letterIds = new Set(letters.map((letter) => letter.id));
const sourceIds = new Set(sources.map((source) => source.id));
const excerptIds = new Set(excerpts.map((excerpt) => excerpt.id));

for (const letter of letters) {
  if (letter.publishStatus !== "published") continue;
  assertRequired(letter.title, `letter ${letter.id} missing title`);
  assertRequired(letter.author, `letter ${letter.id} missing author`);
  assertRequired(letter.summary, `letter ${letter.id} missing summary`);
  assertRequired(letter.sourceId, `letter ${letter.id} missing sourceId`);
  if (!sourceIds.has(letter.sourceId)) throw new Error(`letter ${letter.id} references missing source ${letter.sourceId}`);
  if (letter.copyrightStatus === "Unknown") throw new Error(`letter ${letter.id} uses Unknown copyrightStatus`);
}

for (const excerpt of excerpts) {
  if (excerpt.publishStatus !== "published") continue;
  assertRequired(excerpt.originalText, `excerpt ${excerpt.id} missing originalText`);
  assertRequired(excerpt.plainExplanation, `excerpt ${excerpt.id} missing plainExplanation`);
  assertRequired(excerpt.usageScene, `excerpt ${excerpt.id} missing usageScene`);
  assertRequired(excerpt.sourceId, `excerpt ${excerpt.id} missing sourceId`);
  if (!sourceIds.has(excerpt.sourceId)) throw new Error(`excerpt ${excerpt.id} references missing source ${excerpt.sourceId}`);
  if (excerpt.letterId && !letterIds.has(excerpt.letterId)) throw new Error(`excerpt ${excerpt.id} references missing letter ${excerpt.letterId}`);
  if (!Array.isArray(excerpt.relationTags) || excerpt.relationTags.length === 0) throw new Error(`excerpt ${excerpt.id} missing relationTags`);
  if (!Array.isArray(excerpt.emotionTags) || excerpt.emotionTags.length === 0) throw new Error(`excerpt ${excerpt.id} missing emotionTags`);
  if (excerpt.copyrightStatus === "Unknown") throw new Error(`excerpt ${excerpt.id} uses Unknown copyrightStatus`);
}

for (const topic of topics) {
  if (topic.publishStatus !== "published") continue;
  assertRequired(topic.title, `topic ${topic.id} missing title`);
  assertRequired(topic.description, `topic ${topic.id} missing description`);
  for (const id of topic.relatedExcerptIds ?? []) {
    if (!excerptIds.has(id)) throw new Error(`topic ${topic.id} references missing excerpt ${id}`);
  }
  for (const id of topic.relatedLetterIds ?? []) {
    if (!letterIds.has(id)) throw new Error(`topic ${topic.id} references missing letter ${id}`);
  }
}

console.log("Data validation passed.");
