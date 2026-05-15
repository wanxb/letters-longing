import excerptsData from "@/data/excerpts.json";
import lettersData from "@/data/letters.json";
import sourcesData from "@/data/sources.json";
import tagsData from "@/data/tags.json";
import topicsData from "@/data/topics.json";
import type { Excerpt, ExcerptType, Letter, Source, Tag, Topic } from "@/lib/types";

const excerpts = excerptsData as Excerpt[];
const letters = lettersData as Letter[];
const sources = sourcesData as Source[];
const tags = tagsData as Tag[];
const topics = topicsData as Topic[];

const publishedExcerpts = excerpts.filter((excerpt) => excerpt.publishStatus === "published").sort((a, b) => b.qualityScore - a.qualityScore);
const publishedLetters = letters.filter((letter) => letter.publishStatus === "published").sort((a, b) => b.qualityScore - a.qualityScore);
const publishedTopics = topics.filter((topic) => topic.publishStatus === "published");

const excerptsByType = publishedExcerpts.reduce(
  (groups, excerpt) => {
    groups[excerpt.type].push(excerpt);
    return groups;
  },
  { opening: [], closing: [], body: [] } as Record<ExcerptType, Excerpt[]>
);

const excerptsById = new Map(publishedExcerpts.map((excerpt) => [excerpt.id, excerpt]));
const lettersById = new Map(publishedLetters.map((letter) => [letter.id, letter]));
const lettersBySlug = new Map(publishedLetters.map((letter) => [letter.slug, letter]));
const topicsBySlug = new Map(publishedTopics.map((topic) => [topic.slug, topic]));
const sourcesById = new Map(sources.map((source) => [source.id, source]));

const excerptsByRelation = new Map<string, Excerpt[]>();
for (const excerpt of publishedExcerpts) {
  for (const relation of excerpt.relationTags) {
    const group = excerptsByRelation.get(relation) ?? [];
    group.push(excerpt);
    excerptsByRelation.set(relation, group);
  }
}

const lettersByRelation = new Map<string, Letter[]>();
for (const letter of publishedLetters) {
  const relations = new Set([letter.relationship, ...letter.tags]);
  for (const relation of relations) {
    const group = lettersByRelation.get(relation) ?? [];
    group.push(letter);
    lettersByRelation.set(relation, group);
  }
}

export function getPublishedExcerpts(type?: ExcerptType) {
  return type ? excerptsByType[type] : publishedExcerpts;
}

export function getPublishedLetters() {
  return publishedLetters;
}

export function getPublishedTopics() {
  return publishedTopics;
}

export function getTags() {
  return tags;
}

export function getSources() {
  return sources;
}

export function getExcerptById(id: string) {
  return excerptsById.get(id);
}

export function getLetterBySlug(slug: string) {
  return lettersBySlug.get(slug);
}

export function getLetterById(id: string) {
  return lettersById.get(id);
}

export function getTopicBySlug(slug: string) {
  return topicsBySlug.get(slug);
}

export function getSourceById(id: string) {
  return sourcesById.get(id);
}

export function getRelatedExcerpts(excerpt: Excerpt, limit = 3) {
  const tagsToMatch = new Set([...excerpt.relationTags, ...excerpt.emotionTags]);

  return publishedExcerpts
    .filter((item) => item.id !== excerpt.id)
    .map((item) => ({
      item,
      score: [...item.relationTags, ...item.emotionTags].filter((tag) => tagsToMatch.has(tag)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.qualityScore - a.item.qualityScore)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getExcerptsByRelation(relation: string) {
  return excerptsByRelation.get(relation) ?? [];
}

export function getLettersByRelation(relation: string) {
  return lettersByRelation.get(relation) ?? [];
}
