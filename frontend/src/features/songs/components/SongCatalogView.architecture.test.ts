import { describe, expect, it } from "vitest";
import catalogSource from "./SongCatalogView.tsx?raw";

describe("SongCatalogView architecture", () => {
  it("composes simple catalog control wrappers through shared primitives", () => {
    expect(catalogSource).toContain('import { Box, Flex, Grid, Heading, Inline, Stack, Text } from "../../../design/primitives";');
    expect(catalogSource).toContain("const CatalogCard = styled(Box)");
    expect(catalogSource).toContain("const CatalogHeader = styled(Flex)");
    expect(catalogSource).toContain("const CatalogTitle = styled(Heading)");
    expect(catalogSource).toContain("const CatalogTelemetry = styled(Text)");
    expect(catalogSource).toContain("const Controls = styled(Flex)");
    expect(catalogSource).toContain("const SearchShell = styled(Inline)");
    expect(catalogSource).toContain("const Divider = styled(Box)");
    expect(catalogSource).toContain("const GenreControls = styled(Inline)");
    expect(catalogSource).toContain("const GenreScroller = styled(Flex)");
    expect(catalogSource).toContain("const EmptyTableText = styled(Text)");
    expect(catalogSource).toContain("const Pagination = styled(Flex)");
    expect(catalogSource).toContain("const PaginationSummary = styled(Text)");
    expect(catalogSource).toContain("const PaginationNavigation = styled(Stack)");
    expect(catalogSource).toContain("const LimitControl = styled(Inline)");
    expect(catalogSource).toContain("const LimitMenu = styled(Grid)");
    expect(catalogSource).toContain("const PageControls = styled(Inline)");
  });

  it("keeps complex table internals and behavior-specific controls local", () => {
    expect(catalogSource).toContain("const Table = styled.table");
    expect(catalogSource).toContain("const SongRow = styled.tr");
    expect(catalogSource).toContain("const GenreButton = styled.button");
    expect(catalogSource).toContain("const LimitMenuButton = styled.button");
  });

  it("keeps compact catalog genre chips visible instead of clipped", () => {
    expect(catalogSource).toContain("const SearchShell = styled(Inline)");
    expect(catalogSource).toContain('flexWrap: "nowrap"');
    expect(catalogSource).toContain("const GenreControls = styled(Inline)");
    expect(catalogSource).toContain('overflow: "visible"');
    expect(catalogSource).toContain("const GenreScroller = styled(Flex)");
    expect(catalogSource).toContain('flexWrap: "wrap"');
  });
});
