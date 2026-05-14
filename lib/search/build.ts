import { getPublishedExcerpts, getPublishedLetters, getPublishedTopics } from "@/lib/content/data";
import type { SearchItem } from "@/lib/types";

export function buildSearchItems(): SearchItem[] {
  const excerptItems = getPublishedExcerpts().map((excerpt) => ({
    id: excerpt.id,
    type: "excerpt" as const,
    title: excerpt.originalText,
    description: excerpt.plainExplanation,
    url: `/excerpts/${excerpt.id}`,
    language: excerpt.language,
    relation: excerpt.relationTags[0],
    tags: [...excerpt.relationTags, ...excerpt.emotionTags],
    text: [
      excerpt.originalText,
      excerpt.translationText,
      excerpt.plainExplanation,
      excerpt.usageScene,
      ...excerpt.relationTags,
      ...excerpt.emotionTags
    ]
      .filter(Boolean)
      .join(" ")
  }));

  const letterItems = getPublishedLetters().map((letter) => ({
    id: letter.id,
    type: "letter" as const,
    title: letter.title,
    description: letter.summary,
    url: `/letters/${letter.slug}`,
    language: letter.language,
    relation: letter.relationship,
    tags: letter.tags,
    text: [letter.title, letter.author, letter.recipient, letter.summary, letter.background, ...letter.tags].filter(Boolean).join(" ")
  }));

  const topicItems = getPublishedTopics().map((topic) => ({
    id: topic.id,
    type: "topic" as const,
    title: topic.title,
    description: topic.description,
    url: `/topics/${topic.slug}`,
    tags: topic.tags,
    text: [topic.title, topic.description, topic.body, ...topic.tags].join(" ")
  }));

  return [...excerptItems, ...letterItems, ...topicItems];
}
