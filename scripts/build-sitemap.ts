import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const siteUrl = "https://letters-longing.pages.dev";

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(root, path), "utf8")) as T;
}

const letters = readJson<Array<Record<string, any>>>("data/letters.json").filter((item) => item.publishStatus === "published");
const excerpts = readJson<Array<Record<string, any>>>("data/excerpts.json").filter((item) => item.publishStatus === "published");
const topics = readJson<Array<Record<string, any>>>("data/topics.json").filter((item) => item.publishStatus === "published");

const paths = [
  "/",
  "/openings",
  "/closings",
  "/letters",
  "/topics",
  "/about",
  ...letters.map((letter) => `/letters/${letter.slug}`),
  ...excerpts.map((excerpt) => `/excerpts/${excerpt.id}`),
  ...topics.map((topic) => `/topics/${topic.slug}`)
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
  .map((path) => `  <url><loc>${siteUrl}${path.endsWith("/") ? path : `${path}/`}</loc></url>`)
  .join("\n")}\n</urlset>\n`;

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public/sitemap.xml"), xml, "utf8");
writeFileSync(join(root, "public/robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, "utf8");
console.log(`Built sitemap with ${paths.length} URLs.`);
