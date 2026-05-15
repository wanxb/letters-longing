import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

type CopyrightStatus = "PublicDomain" | "OpenLicensed" | "Quotation" | "SiteCuration";
type ExcerptType = "opening" | "closing" | "body";

type Source = {
  id: string;
  name: string;
  url?: string;
  sourceType: "PublicArchive" | "OpenLicense" | "Book" | "SiteCuration";
  copyrightStatus: CopyrightStatus;
  licenseNote: string;
  allowFullText: boolean;
  allowExcerpt: boolean;
};

type Excerpt = {
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
  publishStatus: "published" | "draft";
};

type CorpusSource = Source & {
  language: "zh" | "en";
  relationTags: string[];
  baseEmotionTags: string[];
  rawUrl?: string;
  maxItems?: number;
};

const root = process.cwd();
const targetCount = Number(process.argv.find((arg) => arg.startsWith("--target="))?.split("=")[1] ?? 1200);
const shouldMerge = process.argv.includes("--merge");

const corpusSources: CorpusSource[] = [
  {
    id: "source-004",
    name: "维基文库：与妻书",
    url: "https://zh.wikisource.org/zh-hans/%E4%B8%8E%E5%A6%BB%E4%B9%A6",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "林觉民原作已进入公有领域，维基文库页面说明作者逝世超过100年。",
    allowFullText: true,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["爱情"],
    baseEmotionTags: ["诀别", "热烈"],
    maxItems: 80
  },
  {
    id: "source-005",
    name: "维基文库：禀父书（林觉民）",
    url: "https://zh.wikisource.org/wiki/%E7%A8%9F%E7%88%B6%E6%9B%B8_%28%E6%9E%97%E8%A6%BA%E6%B0%91%29",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "林觉民写给父亲的诀别书，作者逝世超过100年，属于公有领域。",
    allowFullText: true,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["亲情"],
    baseEmotionTags: ["诀别", "敬意"],
    maxItems: 30
  },
  {
    id: "source-006",
    name: "维基文库：曾国藩家书/1",
    url: "https://zh.wikisource.org/zh-hans/%E6%9B%BE%E5%9C%8B%E8%97%A9%E5%AE%B6%E6%9B%B8/1",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "曾国藩家书公版整理文本，本站用于传统家书语气与短句摘录。",
    allowFullText: true,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["亲情", "训诫"],
    baseEmotionTags: ["诚恳", "敬意"],
    maxItems: 220
  },
  {
    id: "source-011",
    name: "维基文库：曾国藩家书/2",
    url: "https://zh.wikisource.org/zh-hans/%E6%9B%BE%E5%9C%8B%E8%97%A9%E5%AE%B6%E6%9B%B8/2",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "曾国藩家书第二章，公版整理文本，本站用于家书、劝诫、处世短句摘录。",
    allowFullText: true,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["亲情", "训诫"],
    baseEmotionTags: ["诚恳", "克制"],
    maxItems: 260
  },
  {
    id: "source-012",
    name: "维基文库：曾国藩家书/3",
    url: "https://zh.wikisource.org/zh-hans/%E6%9B%BE%E5%9C%8B%E8%97%A9%E5%AE%B6%E6%9B%B8/3",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "曾国藩家书第三章，公版整理文本，本站用于修身、治家与鼓励类短句摘录。",
    allowFullText: true,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["亲情", "训诫"],
    baseEmotionTags: ["诚恳", "温柔"],
    maxItems: 260
  },
  {
    id: "source-007",
    name: "维基文库：诫子书",
    url: "https://zh.wikisource.org/zh-hans/%E8%AA%A1%E5%AD%90%E6%9B%B8",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "诸葛亮《诫子书》为古代公版文本，适合整理为训诫、劝学类书信短句。",
    allowFullText: true,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["训诫"],
    baseEmotionTags: ["克制", "敬意"],
    maxItems: 20
  },
  {
    id: "source-009",
    name: "维基文库：与元九书",
    url: "https://zh.wikisource.org/zh-hans/%E8%88%87%E5%85%83%E4%B9%9D%E6%9B%B8",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "白居易写给元稹的文学书信，古代公版文本，本站用于友情、文学往还语气摘录。",
    allowFullText: false,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["友情"],
    baseEmotionTags: ["诚恳", "怅惘"],
    maxItems: 160
  },
  {
    id: "source-013",
    name: "维基文库：与韩荆州书",
    url: "https://zh.wikisource.org/zh-hans/%E8%88%87%E9%9F%93%E8%8D%8A%E5%B7%9E%E6%9B%B8",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "李白《与韩荆州书》为唐代公版文本，本站用于荐书、陈情、敬意类表达摘录。",
    allowFullText: false,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["公开信"],
    baseEmotionTags: ["敬意", "热烈"],
    maxItems: 120
  },
  {
    id: "source-008",
    name: "维基文库：与令娴女士等书",
    url: "https://zh.wikisource.org/zh-hans/%E4%B8%8E%E4%BB%A4%E5%A8%B4%E5%A5%B3%E5%A3%AB%E7%AD%89%E4%B9%A6",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "梁启超书信，维基文库作者页标注 Author-PD-old-80，本站仅做节选、解释和索引。",
    allowFullText: false,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["亲情", "公开信"],
    baseEmotionTags: ["诚恳", "克制"],
    maxItems: 160
  },
  {
    id: "source-001",
    name: "Wikisource: Letters of Jane Austen, Part 1, Letter 1",
    url: "https://en.wikisource.org/wiki/The_Novels_and_Letters_of_Jane_Austen/Volume_11/Letters_of_Jane_Austen%2C_Part_1/Letter_1",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "英文维基文库公版书信文本，本站用于书信资料整理、中文释义与短句摘录。",
    allowFullText: true,
    allowExcerpt: true,
    language: "en",
    relationTags: ["亲情", "友情"],
    baseEmotionTags: ["亲近", "温柔"],
    maxItems: 80
  },
  {
    id: "source-002",
    name: "Project Gutenberg: The Letters of Robert Browning and Elizabeth Barrett Barrett",
    url: "https://www.gutenberg.org/ebooks/16182",
    rawUrl: "https://www.gutenberg.org/ebooks/16182.txt.utf-8",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "Project Gutenberg 公版文本，本站用于书信信息整理与短句摘录。",
    allowFullText: true,
    allowExcerpt: true,
    language: "en",
    relationTags: ["爱情", "友情"],
    baseEmotionTags: ["倾慕", "诚恳"],
    maxItems: 360
  },
  {
    id: "source-003",
    name: "Wikisource: Life and Works of Abraham Lincoln, Volume 8, Bixby, Mrs.",
    url: "https://en.wikisource.org/wiki/Life_and_Works_of_Abraham_Lincoln/Volume_8/Bixby,_Mrs.",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "英文维基文库公版文本，本站提供中文整理和语境说明。",
    allowFullText: true,
    allowExcerpt: true,
    language: "en",
    relationTags: ["慰问"],
    baseEmotionTags: ["敬意", "克制"],
    maxItems: 30
  },
  {
    id: "source-010",
    name: "维基文库：De Profundis (Wilde, 1915) / Four Letters Written from Reading Prison",
    url: "https://en.wikisource.org/wiki/De_Profundis_%28Wilde%2C_1915%29/Four_Letters_Written_from_Reading_Prison",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "英文维基文库公版版本，本站仅摘录短句并提供中文说明。",
    allowFullText: false,
    allowExcerpt: true,
    language: "en",
    relationTags: ["友情"],
    baseEmotionTags: ["克制", "诚恳"],
    maxItems: 120
  },
  {
    id: "source-014",
    name: "维基文库：儿童新尺牍",
    url: "https://zh.wikisource.org/zh-hans/%E5%85%92%E7%AB%A5%E6%96%B0%E5%B0%BA%E7%89%98",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "1929 年民国儿童书信课本，维基文库公版文本，适合批量整理传统称呼、问安、结尾格式。",
    allowFullText: false,
    allowExcerpt: true,
    language: "zh",
    relationTags: ["亲情", "友情"],
    baseEmotionTags: ["问候", "敬意"],
    maxItems: 360
  },
  {
    id: "source-015",
    name: "Project Gutenberg: How to Write Letters",
    url: "https://www.gutenberg.org/ebooks/22222",
    rawUrl: "https://www.gutenberg.org/ebooks/22222.txt.utf-8",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "Project Gutenberg 公版英文书信写作手册，本站用于英文开头、结尾和礼貌表达摘录。",
    allowFullText: false,
    allowExcerpt: true,
    language: "en",
    relationTags: ["公开信", "友情"],
    baseEmotionTags: ["敬意", "诚恳"],
    maxItems: 220
  },
  {
    id: "source-016",
    name: "Project Gutenberg: The New Century Standard Letter-Writer",
    url: "https://www.gutenberg.org/ebooks/56911",
    rawUrl: "https://www.gutenberg.org/ebooks/56911.txt.utf-8",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "Project Gutenberg 公版英文书信范本与写作手册，本站用于英文开头、结尾和常用书信用语摘录。",
    allowFullText: false,
    allowExcerpt: true,
    language: "en",
    relationTags: ["公开信", "友情"],
    baseEmotionTags: ["诚恳", "敬意"],
    maxItems: 260
  },
  {
    id: "source-017",
    name: "Project Gutenberg: Putnam's Phrase Book",
    url: "https://www.gutenberg.org/ebooks/48441",
    rawUrl: "https://www.gutenberg.org/ebooks/48441.txt.utf-8",
    sourceType: "PublicArchive",
    copyrightStatus: "PublicDomain",
    licenseNote: "Project Gutenberg 公版短语手册，本站仅抽取与书信结尾、礼貌表达相关的短句。",
    allowFullText: false,
    allowExcerpt: true,
    language: "en",
    relationTags: ["公开信"],
    baseEmotionTags: ["诚恳", "敬意"],
    maxItems: 160
  }
];

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(root, path), "utf8")) as T;
}

function writeJson(path: string, value: unknown) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function fetchText(source: CorpusSource) {
  const url = source.rawUrl ?? `${source.url}${source.url?.includes("?") ? "&" : "?"}action=raw`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "letters-longing-corpus-builder/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanText(raw: string, language: string) {
  let text = raw;
  text = text.replace(/\r/g, "\n");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = decodeHtmlEntities(text);
  text = text.replace(/\{\{[\s\S]*?\}\}/g, " ");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, "$1");
  text = text.replace(/\[(?:https?:\/\/[^\s\]]+)\s*([^\]]*)\]/g, "$1");
  text = text.replace(/'{2,5}/g, "");
  text = text.replace(/<ref[\s\S]*?<\/ref>/gi, " ");
  text = text.replace(/<ref[^>]*\/>/gi, " ");
  text = text.replace(/\{\|[\s\S]*?\|\}/g, " ");
  text = text.replace(/__[^_]+__/g, " ");
  text = text.replace(/^\s*[|!].*$/gm, " ");
  text = text.replace(/^[-=*#;:]+/gm, " ");
  text = text.replace(/\s+\[\d+\]/g, "");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n{2,}/g, "\n");

  if (language === "en") {
    const start = text.search(/\*\*\* START OF|Dear|My dear|I /i);
    const end = text.search(/\*\*\* END OF|End of the Project Gutenberg/i);
    if (start > 0) text = text.slice(start);
    if (end > 0) text = text.slice(0, end);
  }

  return text.trim();
}

function splitChinese(text: string) {
  return text
    .split(/(?<=[。！？；：.])|[\n]+/g)
    .map((item) => item.trim())
    .flatMap((item) => splitLongChinese(item))
    .filter(Boolean);
}

function splitLongChinese(text: string) {
  if (text.length <= 80) return [text];
  return text
    .split(/[，、]/g)
    .map((item) => item.trim())
    .filter((item) => item.length >= 4 && item.length <= 80);
}

function splitEnglish(text: string) {
  return text
    .replace(/\n+/g, "\n")
    .split(/(?<=[.!?])\s+|\n+/g)
    .map((item) => item.trim())
    .flatMap((item) => splitLongEnglish(item))
    .filter(Boolean);
}

function splitLongEnglish(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 35) return [text];
  return text
    .split(/[;:]/g)
    .map((item) => item.trim())
    .filter((item) => {
      const count = item.split(/\s+/).filter(Boolean).length;
      return count >= 3 && count <= 35;
    });
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[“”‘’"'\s　，。！？；：,.!?;:—\-–()[\]{}]/g, "")
    .trim();
}

function isGoodCandidate(text: string, language: "zh" | "en") {
  if (!text) return false;
  if (/^(category|file|image|template|public domain|retrieved from|检索自|分类[:：]|注释|编辑|来源|讨论|工具)$/i.test(text)) return false;
  if (/[{}<>|]/.test(text)) return false;
  if (/\bISBN\b|Gutenberg|Wikisource|维基文库|Project Gutenberg|START OF|END OF/i.test(text)) return false;
  if (/^(chapter|reply to|death of|asking a|another letter|general letter|the new century|file which|text enclosed|entered according|distributed proofreading)/i.test(text)) return false;
  if (language === "zh") {
    if (/^[㊀-㊉]/.test(text)) return false;
    if (/(作.+講|意思|解說|註解|本書|圖畫|遊戲|程度|文體語體|白話體|前函|後函|家庭類|學校類|商店類)/.test(text)) return false;
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
    return chineseChars >= 4 && text.length >= 4 && text.length <= 80;
  }

  const words = text.split(/\s+/).filter(Boolean);
  const letters = (text.match(/[A-Za-z]/g) ?? []).length;
  return words.length >= 3 && words.length <= 35 && letters >= 8;
}

function inferType(text: string, language: "zh" | "en"): ExcerptType {
  if (language === "en") {
    if (/^(dear|my dear|dearest|to mrs\.?|to miss|to mr\.?|sir|madam|gentlemen|my lord|my dear sir)\b/i.test(text)) return "opening";
    if (/\b(yours|faithfully yours|sincerely yours|respectfully yours|cordially yours|affectionately|lovingly yours|truly yours|obedient servant|believe me)\b/i.test(text) && text.length <= 120) {
      return "closing";
    }
    return "body";
  }

  if (/(如晤|膝下|足下|大人|钧座|左右|先生|女士|夫人|阁下|卿卿|吾兄|老弟|贤弟|字寄|敬禀|叩禀|白闻|母父亲|祖母父|诸位|吾友)/.test(text) && text.length <= 45) {
    return "opening";
  }
  if (/(敬请|敬祝|专此|顺颂|谨启|谨上|手草|顿首|叩上|乞恕之|伏惟|惟.*图之|不宣|福安|近安|大安|教安|撰安|台安)$/.test(text) || /^幸/.test(text)) return "closing";
  return "body";
}

function inferEmotionTags(text: string, source: CorpusSource) {
  const tags = new Set(source.baseEmotionTags);
  if (/(安|万福|问|hope|dear|kind)/i.test(text)) tags.add("问候");
  if (/(死|永别|泪|grief|loss|bereavement|sorrow)/i.test(text)) tags.add("诀别");
  if (/(谢|感|thanks|thank|grateful)/i.test(text)) tags.add("感谢");
  if (/(敬|尊|respect|honour|honor|sincerely)/i.test(text)) tags.add("敬意");
  if (/(爱|love|beloved|heart|dearest)/i.test(text)) tags.add("温柔");
  if (/(不可|须|当|宜|must|should|ought)/i.test(text)) tags.add("克制");
  return [...tags].slice(0, 3);
}

function explanationFor(type: ExcerptType, language: "zh" | "en") {
  if (type === "opening") return language === "zh" ? "可作为传统书信开头、称谓或入题方式的参考。" : "A usable letter opening, salutation, or first move into the message.";
  if (type === "closing") return language === "zh" ? "可作为传统书信收束、请托或署名前语气的参考。" : "A usable letter closing or sign-off phrase with a clear tone.";
  return language === "zh" ? "可作为书信正文中的情绪、劝告、说明或思念表达参考。" : "A usable sentence for the body of a letter, preserving a clear epistolary tone.";
}

function usageSceneFor(source: CorpusSource, type: ExcerptType) {
  const relation = source.relationTags.join("、");
  if (type === "opening") return `适合${relation}类书信开头、称谓或入题时参考。`;
  if (type === "closing") return `适合${relation}类书信结尾、署名前收束或礼貌请托时参考。`;
  return `适合${relation}类书信正文中表达情绪、说明立场或推进语气时参考。`;
}

function qualityScore(text: string, source: CorpusSource, type: ExcerptType) {
  let score = 72;
  if (source.language === "zh") {
    if (text.length >= 8 && text.length <= 40) score += 10;
    if (/[：？！。；]$/.test(text)) score += 4;
    if (/[吾汝君足下大人父母兄弟书信]/.test(text)) score += 4;
  } else {
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words >= 5 && words <= 22) score += 10;
    if (/[.!?,;:]$/.test(text)) score += 3;
    if (/\b(I|you|your|dear|letter|heart|friend|sincerely|yours)\b/i.test(text)) score += 5;
  }
  if (type !== "body") score += 14;
  if (/^[\d\s.,;:!?-]+$/.test(text)) score -= 40;
  return Math.max(1, Math.min(99, score));
}

function extraFormulaCandidates(source: CorpusSource, cleaned: string) {
  const formulas = new Set<string>();

  if (source.language === "zh") {
    const compact = cleaned.replace(/\s+/g, "");
    const zhMatches = compact.match(/(?:專此|特此|肅此|匆此|謹此|並此)?(?:敬請|敬祝|順請|順頌|即請|即頌|此請|並請|謹請|伏乞)[\u4e00-\u9fff]{1,8}(?:安|祺|福|吉|祉|綏|康|佳|好)/g) ?? [];
    for (const match of zhMatches) formulas.add(match);

    const shortClosings = compact.match(/(?:敬請|順請|即請|此請|敬祝)(?:福安|金安|近安|台安|鈞安|撰安|教安|旅安|暑安|冬安|春安|夏安|秋安|大安|日安)/g) ?? [];
    for (const match of shortClosings) formulas.add(match);

    const addressMatches = compact.match(/[\u4e00-\u9fff]{1,8}(?:大人膝下|先生左右|先生台鑒|女士台鑒|足下|鈞座|閣下|如晤)/g) ?? [];
    for (const match of addressMatches) formulas.add(match);
  } else {
    const enMatches = cleaned.match(/\b(?:Yours|Very|Most|Sincerely|Faithfully|Respectfully|Cordially|Lovingly|Affectionately|Truly|Believe me)[A-Za-z ,.'-]{0,55}(?:yours|servant|friend|sincerely|faithfully|respectfully|cordially|affectionately|lovingly),?/gi) ?? [];
    for (const match of enMatches) {
      const clean = match.replace(/\s+/g, " ").trim();
      if (clean.split(/\s+/).length <= 10) formulas.add(clean);
    }

    const openings = cleaned.match(/\b(?:Dear|My dear|Dearest|Gentlemen|Dear Sir|Dear Madam|My dear Sir)[A-Za-z .,'-]{0,45},/gi) ?? [];
    for (const match of openings) {
      const clean = match.replace(/\s+/g, " ").trim();
      if (clean.split(/\s+/).length <= 10) formulas.add(clean);
    }

    const knownClosings = [
      "Yours truly",
      "Truly yours",
      "Yours very truly",
      "Very truly yours",
      "Yours respectfully",
      "Respectfully yours",
      "Yours very respectfully",
      "Faithfully yours",
      "Cordially yours",
      "Sincerely yours",
      "Yours sincerely",
      "Yours very sincerely",
      "Yours cordially",
      "Yours faithfully",
      "Yours gratefully",
      "Yours affectionately",
      "Very affectionately yours",
      "Yours lovingly",
      "Lovingly yours",
      "Your obedient servant",
      "Your humble servant"
    ];

    const lower = cleaned.toLowerCase();
    for (const closing of knownClosings) {
      if (lower.includes(closing.toLowerCase())) formulas.add(`${closing},`);
    }
  }

  return [...formulas];
}

function nextAutoId(existing: Excerpt[]) {
  let max = 0;
  for (const excerpt of existing) {
    const match = excerpt.id.match(/^ex-auto-(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return max + 1;
}

async function main() {
  const existingExcerpts = readJson<Excerpt[]>("data/excerpts.json");
  const existingSources = readJson<Source[]>("data/sources.json");
  const baseExcerpts = existingExcerpts.filter((item) => !item.id.startsWith("ex-auto-"));
  const seen = new Set(baseExcerpts.map((item) => normalize(item.originalText)));
  const candidates: Excerpt[] = [];

  for (const source of corpusSources) {
    try {
      const raw = await fetchText(source);
      const cleaned = cleanText(raw, source.language);
      const pieces = [...extraFormulaCandidates(source, cleaned), ...(source.language === "zh" ? splitChinese(cleaned) : splitEnglish(cleaned))];
      let sourceCount = 0;

      for (const piece of pieces) {
        const originalText = piece.replace(/\s+/g, source.language === "zh" ? "" : " ").trim();
        const key = normalize(originalText);
        if (seen.has(key) || !isGoodCandidate(originalText, source.language)) continue;

        const type = inferType(originalText, source.language);
        const candidate: Excerpt = {
          id: "pending",
          type,
          originalText,
          plainExplanation: explanationFor(type, source.language),
          language: source.language,
          relationTags: source.relationTags,
          emotionTags: inferEmotionTags(originalText, source),
          usageScene: usageSceneFor(source, type),
          sourceId: source.id,
          copyrightStatus: source.copyrightStatus,
          qualityScore: qualityScore(originalText, source, type),
          isFeatured: false,
          publishStatus: "published"
        };

        if (candidate.qualityScore < 75) continue;
        seen.add(key);
        candidates.push(candidate);
        sourceCount += 1;

        if (source.maxItems && sourceCount >= source.maxItems) break;
      }

      console.log(`${source.id}: collected ${sourceCount}`);
    } catch (error) {
      console.warn(`${source.id}: skipped (${(error as Error).message})`);
    }
  }

  candidates.sort((a, b) => b.qualityScore - a.qualityScore || a.originalText.length - b.originalText.length);

  let id = nextAutoId(existingExcerpts);
  const numbered = candidates.map((candidate) => ({
    ...candidate,
    id: `ex-auto-${String(id++).padStart(4, "0")}`
  }));

  writeJson("data/generated/source-manifest.json", corpusSources);
  writeJson("data/generated/excerpt-candidates.json", numbered);
  console.log(`candidate total: ${numbered.length}`);

  if (!shouldMerge) return;

  const sourceById = new Map(existingSources.map((source) => [source.id, source]));
  for (const source of corpusSources) {
    sourceById.set(source.id, {
      id: source.id,
      name: source.name,
      url: source.url,
      sourceType: source.sourceType,
      copyrightStatus: source.copyrightStatus,
      licenseNote: source.licenseNote,
      allowFullText: source.allowFullText,
      allowExcerpt: source.allowExcerpt
    });
  }

  const needed = Math.max(0, targetCount - baseExcerpts.length);
  const quotaOpenings = Math.min(120, numbered.filter((item) => item.type === "opening").length);
  const quotaClosings = Math.min(120, numbered.filter((item) => item.type === "closing").length);
  const selected: Excerpt[] = [];
  const selectedIds = new Set<string>();

  for (const type of ["opening", "closing"] as ExcerptType[]) {
    const quota = type === "opening" ? quotaOpenings : quotaClosings;
    for (const item of numbered.filter((candidate) => candidate.type === type).slice(0, quota)) {
      if (selected.length >= needed) break;
      selected.push(item);
      selectedIds.add(item.id);
    }
  }

  for (const item of numbered) {
    if (selected.length >= needed) break;
    if (selectedIds.has(item.id)) continue;
    selected.push(item);
    selectedIds.add(item.id);
  }
  writeJson("data/sources.json", [...sourceById.values()].sort((a, b) => a.id.localeCompare(b.id)));
  writeJson("data/excerpts.json", [...baseExcerpts, ...selected]);
  console.log(`merged excerpts: ${baseExcerpts.length + selected.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
