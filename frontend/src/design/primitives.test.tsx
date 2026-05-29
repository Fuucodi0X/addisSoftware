import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { DesignSystemProvider } from "./DesignSystemProvider";
import { Flex, Grid, Heading, Inline, Stack, Text } from "./primitives";

const renderWithTheme = (ui: ReactNode) => render(<DesignSystemProvider>{ui}</DesignSystemProvider>);

describe("design primitives", () => {
  it("maps layout gaps through the token space scale", () => {
    renderWithTheme(
      <>
        <Flex data-testid="flex" gap={8}>
          <span>one</span>
          <span>two</span>
        </Flex>
        <Grid data-testid="grid" columnGap={6} rowGap={4}>
          <span>one</span>
          <span>two</span>
        </Grid>
        <Stack data-testid="stack" gap={5}>
          <span>one</span>
          <span>two</span>
        </Stack>
        <Inline data-testid="inline" gap={3}>
          <span>one</span>
          <span>two</span>
        </Inline>
      </>
    );

    expect(getComputedStyle(screen.getByTestId("flex")).gap).toBe("24px");
    expect(getComputedStyle(screen.getByTestId("grid")).columnGap).toBe("16px");
    expect(getComputedStyle(screen.getByTestId("grid")).rowGap).toBe("8px");
    expect(getComputedStyle(screen.getByTestId("stack")).gap).toBe("12px");
    expect(getComputedStyle(screen.getByTestId("inline")).gap).toBe("6px");
  });

  it("keeps responsive gap values available for primitive composition", () => {
    const { container } = renderWithTheme(
      <Flex data-testid="responsive-flex" gap={[3, 6]}>
        <span>one</span>
        <span>two</span>
      </Flex>
    );

    const styleText = Array.from(container.ownerDocument.querySelectorAll("style"))
      .map((styleElement) => styleElement.textContent)
      .join("\n");

    expect(getComputedStyle(screen.getByTestId("responsive-flex")).gap).toBe("6px");
    expect(styleText).toContain("@media screen and (min-width: 520px)");
    expect(styleText).toContain("gap:16px");
  });

  it("renders semantic text variants without leaking style props to the DOM", () => {
    renderWithTheme(
      <Text data-testid="song-count-label" tone="muted" variant="label">
        24 Songs
      </Text>
    );

    const label = screen.getByTestId("song-count-label");
    const labelStyles = getComputedStyle(label);

    expect(label.tagName).toBe("P");
    expect(label.getAttribute("tone")).toBeNull();
    expect(label.getAttribute("variant")).toBeNull();
    expect(labelStyles.fontWeight).toBe("850");
    expect(labelStyles.textTransform).toBe("uppercase");
  });

  it("renders semantic heading hierarchy through the as prop", () => {
    renderWithTheme(
      <Heading as="h1" data-testid="page-heading" tone="accent" variant="page">
        Song Library
      </Heading>
    );

    const heading = screen.getByRole("heading", { level: 1, name: "Song Library" });
    const headingStyles = getComputedStyle(heading);

    expect(heading).toBe(screen.getByTestId("page-heading"));
    expect(heading.getAttribute("tone")).toBeNull();
    expect(heading.getAttribute("variant")).toBeNull();
    expect(headingStyles.fontWeight).toBe("950");
    expect(headingStyles.lineHeight).toBe("1.04");
  });
});
