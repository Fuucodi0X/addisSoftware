import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { DesignSystemProvider } from "../design/DesignSystemProvider";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "./Panel";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmptyState,
  TableHead,
  TableHeaderCell,
  TableRow
} from "./Table";

const renderWithTheme = (ui: ReactNode) => render(<DesignSystemProvider>{ui}</DesignSystemProvider>);

describe("UI components", () => {
  it("renders Panel sections with closed variant and tone props", () => {
    renderWithTheme(
      <Panel aria-label="Catalog panel" tone="accent" variant="outlined">
        <PanelHeader>
          <h2>Song Catalog</h2>
        </PanelHeader>
        <PanelBody>Catalog content</PanelBody>
        <PanelFooter>Panel actions</PanelFooter>
      </Panel>
    );

    const panel = screen.getByRole("region", { name: "Catalog panel" });

    expect(within(panel).getByRole("heading", { name: "Song Catalog" })).toBeTruthy();
    expect(within(panel).getByText("Catalog content")).toBeTruthy();
    expect(within(panel).getByText("Panel actions")).toBeTruthy();
  });

  it("renders Badge labels and counts with semantic tones", () => {
    renderWithTheme(
      <div>
        <Badge tone="accent">Genre</Badge>
        <Badge tone="neutral" variant="outline">
          12 Songs
        </Badge>
      </div>
    );

    expect(screen.getByText("Genre")).toBeTruthy();
    expect(screen.getByText("12 Songs")).toBeTruthy();
  });

  it("renders Button through tokenized variant and tone props", () => {
    renderWithTheme(
      <Button variant="solid" tone="danger">
        Delete Song
      </Button>
    );

    expect(screen.getByRole("button", { name: "Delete Song" })).toBeTruthy();
  });

  it("renders Modal without stale modal class hooks", () => {
    renderWithTheme(
      <Modal title="Edit Song" labelledBy="edit-song-title" onClose={() => undefined}>
        <p>Song form</p>
      </Modal>
    );

    const dialog = screen.getByRole("dialog", { name: "Edit Song" });
    const staleModalNodes = Array.from(document.querySelectorAll("[class]")).filter((node) =>
      Array.from(node.classList).some((className) => className.startsWith("modal-"))
    );

    expect(dialog).toBeTruthy();
    expect(staleModalNodes).toHaveLength(0);
  });

  it("renders responsive Table primitives with labelled cells and empty states", () => {
    renderWithTheme(
      <TableContainer>
        <Table aria-label="Song Catalog" density="compact" responsive="stack">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Song</TableHeaderCell>
              <TableHeaderCell>Genre</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow tone="selected">
              <TableCell dataLabel="Song">Tizita</TableCell>
              <TableCell dataLabel="Genre">Ethio-jazz</TableCell>
            </TableRow>
            <TableEmptyState colSpan={2}>No Songs match the current filters.</TableEmptyState>
          </TableBody>
        </Table>
      </TableContainer>
    );

    const table = screen.getByRole("table", { name: "Song Catalog" });

    expect(within(table).getByRole("columnheader", { name: "Song" })).toBeTruthy();
    expect(within(table).getByText("Tizita").getAttribute("data-label")).toBe("Song");
    expect(within(table).getByText("Ethio-jazz").getAttribute("data-label")).toBe("Genre");
    expect(within(table).getByText("No Songs match the current filters.")).toBeTruthy();
  });
});
