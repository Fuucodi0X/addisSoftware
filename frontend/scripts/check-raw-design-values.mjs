import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const scriptDirectory = import.meta.url.startsWith("file:")
  ? dirname(fileURLToPath(import.meta.url))
  : join(process.cwd(), "scripts");

export const repoRoot = resolve(scriptDirectory, "../..");
export const featureRoot = join(repoRoot, "frontend/src/features");
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

export const designValueRules = [
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

export const scanDesignValues = (source, filePath = "inline-source.tsx") => {
  const findings = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of designValueRules) {
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

  return findings;
};

export const scanFeatureFiles = (root = featureRoot) =>
  walk(root).flatMap((filePath) => scanDesignValues(readFileSync(filePath, "utf8"), filePath));

export const reportFindings = (findings, root = repoRoot) => {
  if (findings.length === 0) {
    return "No raw design values found in frontend feature code.";
  }

  const output = ["Raw design values found in frontend feature code.", ""];

  for (const finding of findings) {
    output.push(`${relative(root, finding.filePath)}:${finding.line} ${finding.rule.name}`);
    output.push(`  ${finding.text}`);
    output.push(`  ${finding.rule.message}`);
    output.push("");
  }

  return output.join("\n");
};

const runCli = () => {
  const findings = scanFeatureFiles();
  const report = reportFindings(findings);

  if (findings.length > 0) {
    console.error(report);
    process.exit(1);
  }

  console.log(report);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli();
}
