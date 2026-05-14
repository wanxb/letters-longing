import { readFileSync } from "node:fs";
import { join } from "node:path";

type Source = {
  id: string;
  name: string;
  url?: string;
};

const sources = JSON.parse(readFileSync(join(process.cwd(), "data/sources.json"), "utf8")) as Source[];

async function main() {
  const failures: string[] = [];
  const warnings: string[] = [];

  for (const source of sources) {
    if (!source.url) continue;
    try {
      let response = await fetch(source.url, { method: "HEAD" });
      if (!response.ok || response.status === 405) {
        response = await fetch(source.url, { method: "GET" });
      }
      if (!response.ok) {
        failures.push(`${source.id} ${source.name}: ${response.status}`);
      }
    } catch (error) {
      warnings.push(`${source.id} ${source.name}: ${(error as Error).message}`);
    }
  }

  if (failures.length) {
    console.error("Source link check failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log("Source link check passed.");
  }

  if (warnings.length) {
    console.warn("Source link check warnings:");
    for (const warning of warnings) console.warn(`- ${warning}`);
  }
}

main();
