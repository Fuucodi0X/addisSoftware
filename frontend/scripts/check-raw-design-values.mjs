import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const repoRoot = new URL("../..", import.meta.url).pathname;
const featureRoot = join(repoRoot, "frontend/src/features");
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

const rules = [
  {
    name: "raw hex color",
    pattern: /#[0-9a-fA-F]{3,8}\b/,
    message: "Move raw colors into theme tokens or reusable UI internals."
  },
  {
    name: "arbitrary media breakpoint",
    pattern: /@media[^{\n]*\(\s*(?:min|max)-width\s*:\s*\d+(?:\.\d+)?px\s*\)/,
    message: "Use theme.breakpoints instead of one-off breakpoint literals."
  },
  {
    name: "arbitrary shadow",
    pattern: /(?:boxShadow|box-shadow)\s*:\s*["'`](?!none\b)(?=.*(?:rgba?\(|\d+px))/,
    message: "Use theme.shadows or a reusable UI component variant."
  },
  {
    name: "one-off radius",
    pattern: /(?:borderRadius|border-radius)\s*:\s*(?:["'`]\d+(?:\.\d+)?px|[1-9]\d*)/,
    message: "Use theme.radii instead of one-off radius values."
  }
];

const extensionOf = (filePath) => {
  const match = filePath.match(/\.[^.]+$/);
  return match?.[0] ?? "";
};

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return walk(fullPath);
    }

    return allowedExtensions.has(extensionOf(fullPath)) ? [fullPath] : [];
  });

const findings = [];

for (const filePath of walk(featureRoot)) {
  const source = readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        findings.push({
          filePath,
          line: index + 1,
          rule,
          text: line.trim()
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Raw design values found in frontend feature code.\n");

  for (const finding of findings) {
    console.error(`${relative(repoRoot, finding.filePath)}:${finding.line} ${finding.rule.name}`);
    console.error(`  ${finding.text}`);
    console.error(`  ${finding.rule.message}\n`);
  }

  process.exit(1);
}

console.log("No raw design values found in frontend feature code.");
