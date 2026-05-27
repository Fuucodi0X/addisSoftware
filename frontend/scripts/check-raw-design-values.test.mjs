import { describe, expect, it } from "vitest";
import { reportFindings, scanDesignValues } from "./check-raw-design-values.mjs";

describe("check-raw-design-values", () => {
  it("accepts feature styles that are governed by theme tokens and CSS variables", () => {
    const findings = scanDesignValues(`
      const Panel = styled.section(({ theme }) => ({
        background: theme.colors.surface.panel,
        borderRadius: theme.radii.xl,
        boxShadow: theme.effects.shadows.soft,
        color: "var(--app-text)",
        [\`@media (max-width: \${theme.breakpoints[1]})\`]: {
          borderRadius: theme.radii.lg
        }
      }));
    `);

    expect(findings).toEqual([]);
  });

  it("flags raw hex colors, one-off breakpoints, arbitrary shadows, and hardcoded radii", () => {
    const findings = scanDesignValues(`
      const Panel = styled.section({
        color: "#123456",
        "@media (max-width: 820px)": { display: "block" },
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.22)",
        borderRadius: "18px"
      });
    `);

    expect(findings.map((finding) => finding.rule.name)).toEqual([
      "raw hex color",
      "arbitrary media breakpoint",
      "arbitrary shadow",
      "one-off radius"
    ]);
  });

  it("reports feature-code findings with file, line, rule, and remediation text", () => {
    const findings = scanDesignValues('const color = "#fff";', "/repo/frontend/src/features/songs/Example.tsx");
    const report = reportFindings(findings, "/repo");

    expect(report).toContain("frontend/src/features/songs/Example.tsx:1 raw hex color");
    expect(report).toContain("Move raw colors into theme tokens or reusable UI internals.");
  });
});
