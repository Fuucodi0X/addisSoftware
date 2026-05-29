import { describe, expect, it } from "vitest";
import shellSource from "./SongLibraryShell.tsx?raw";

const styledBlockFor = (name: string) => {
  const match = shellSource.match(new RegExp(`const ${name} = styled\\([^)]*\\)` + "`([\\s\\S]*?)`;"));

  if (!match) {
    throw new Error(`Could not find ${name} styled block.`);
  }

  return match[1];
};

describe("SongLibraryShell architecture", () => {
  it("composes stable shell layout through primitives and keeps Emotion for responsive structure", () => {
    expect(shellSource).toContain('import { Flex } from "../../../design/primitives";');
    expect(shellSource).toContain('<Shell alignItems="center"');
    expect(shellSource).toContain('justifyContent="center"');
    expect(shellSource).toContain('p={8}');
    expect(shellSource).toContain('borderRadius="xl"');
    expect(shellSource).toContain('boxShadow="var(--app-shadow-panel)"');
    expect(shellSource).toContain('flexDirection="column"');
    expect(shellSource).toContain('overflowY="auto"');

    expect(styledBlockFor("Shell")).not.toMatch(/\b(?:align-items|justify-content|background|min-height)\s*:/);
    expect(shellSource).not.toContain("const MainPanel = styled");
    expect(styledBlockFor("ScrollPanel")).not.toMatch(/\b(?:flex|overflow-x|overflow-y|min-width)\s*:/);
  });
});
