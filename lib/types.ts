export type PublishStatus = "published" | "draft";

export type CopyrightStatus = "PublicDomain" | "OpenLicensed" | "Quotation" | "SiteCuration";

export type ExcerptType = "opening" | "closing" | "body";

export type Excerpt = {
  id: string;
  type: ExcerptType;
  originalText: string;
  translationText?: string;
  plainExplanation: string;
  language: string;
  relationTags: string[];
  emotionTags: string[];
  usageScene: string;
  letterId?: string;
  sourceId: string;
  copyrightStatus: CopyrightStatus;
  qualityScore: number;
  isFeatured: boolean;
  publishStatus: PublishStatus;
};

export type Letter = {
  id: string;
  slug: string;
  title: string;
  author: string;
  recipient?: string;
  relationship: string;
  writtenDate?: string;
  writtenYear?: number;
  language: string;
  era?: string;
  summary: string;
  background?: string;
  originalText: string;
  translationText?: string;
  sourceId: string;
  copyrightStatus: CopyrightStatus;
  tags: string[];
  qualityScore: number;
  isFeatured: boolean;
  publishStatus: PublishStatus;
};

export type Source = {
  id: string;
  name: string;
  url?: string;
  sourceType: "PublicArchive" | "OpenLicense" | "Book" | "SiteCuration";
  copyrightStatus: CopyrightStatus;
  licenseNote: string;
  allowFullText: boolean;
  allowExcerpt: boolean;
};

export type Tag = {
  id: string;
  slug: string;
  name: string;
  type: "relation" | "emotion" | "language" | "topic";
};

export type Topic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  relatedExcerptIds: string[];
  relatedLetterIds: string[];
  publishStatus: PublishStatus;
};

export type SearchItem = {
  id: string;
  type: "excerpt" | "letter" | "topic";
  title: string;
  description: string;
  url: string;
  language?: string;
  relation?: string;
  tags: string[];
  text: string;
};
