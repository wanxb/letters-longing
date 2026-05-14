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

export function getPublishedExcerpts(type?: ExcerptType) {
  return excerpts
    .filter((excerpt) => excerpt.publishStatus === "published")
    .filter((excerpt) => (type ? excerpt.type === type : true))
    .sort((a, b) => b.qualityScore - a.qualityScore);
}

export function getPublishedLetters() {
  return letters.filter((letter) => letter.publishStatus === "published").sort((a, b) => b.qualityScore - a.qualityScore);
}

export function getPublishedTopics() {
  return topics.filter((topic) => topic.publishStatus === "published");
}

export function getTags() {
  return tags;
}

export function getSources() {
  return sources;
}

export function getExcerptById(id: string) {
  return getPublishedExcerpts().find((excerpt) => excerpt.id === id);
}

export function getLetterBySlug(slug: string) {
  return getPublishedLetters().find((letter) => letter.slug === slug);
}

export function getLetterById(id: string) {
  return getPublishedLetters().find((letter) => letter.id === id);
}

export function getTopicBySlug(slug: string) {
  return getPublishedTopics().find((topic) => topic.slug === slug);
}

export function getSourceById(id: string) {
  return sources.find((source) => source.id === id);
}

export function getRelatedExcerpts(excerpt: Excerpt, limit = 3) {
  const tagsToMatch = new Set([...excerpt.relationTags, ...excerpt.emotionTags]);

  return getPublishedExcerpts()
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
  return getPublishedExcerpts().filter((excerpt) => excerpt.relationTags.includes(relation));
}

export function getLettersByRelation(relation: string) {
  return getPublishedLetters().filter((letter) => letter.relationship === relation || letter.tags.includes(relation));
}
