import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { createApp } from "../src/app";

const app = createApp();
const document = app.getOpenAPI31Document({
  openapi: "3.1.0",
  info: {
    title: "Ody Restaurant API",
    version: "1.0.0",
  },
});

const outPath = resolve(
  import.meta.dirname,
  "../../../openapi.json",
);
writeFileSync(outPath, JSON.stringify(document, null, 2));
console.log(`Wrote OpenAPI spec to ${outPath}`);
