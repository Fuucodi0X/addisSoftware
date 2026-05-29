import styled from "@emotion/styled";
import { ChevronDown, Edit, Filter, Search, Trash2, X } from "lucide-react";
import { useState, type FocusEvent, type WheelEvent } from "react";
import { Box, Flex, Grid, Heading, Inline, Stack, Text } from "../../../design/primitives";
import type { Song } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { CachedArtworkImage } from "./CachedArtworkImage";

type SongLoadStatus = "idle" | "loading" | "succeeded" | "failed";
const limitOptions = [5, 8, 15, 25, 50];

interface SongCatalogViewProps {
  activeSongId: string | null;
  fallbackArtwork: string;
  genre: string;
  genres: string[];
  isFiltered: boolean;
  isPlaying: boolean;
  items: Song[];
  limit: number;
  onDeleteSong: (song: Song) => void;
  onEditSong: (song: Song) => void;
  onGenreChange: (genre: string) => void;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onSelectSong: (song: Song) => void;
  page: number;
  searchText: string;
  startItem: number;
  status: SongLoadStatus;
  totalItems: number;
  totalPages: number;
}

export const SongCatalogView = ({
  activeSongId,
  fallbackArtwork,
  genre,
  genres,
  isFiltered,
  isPlaying,
  items,
  limit,
  onDeleteSong,
  onEditSong,
  onGenreChange,
  onLimitChange,
  onPageChange,
  onSearchChange,
  onSelectSong,
  page,
  searchText,
  startItem,
  status,
  totalItems,
  totalPages
}: SongCatalogViewProps) => {
  const [isLimitMenuOpen, setIsLimitMenuOpen] = useState(false);
  const endItem = Math.min(page * limit, totalItems);
  const emptyRows = Math.max(0, 5 - items.length);
  const pageNumbers = Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index + 1);
  const selectedLimit = limitOptions.includes(limit) ? limit : limitOptions[1];

  const closeLimitMenuOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsLimitMenuOpen(false);
    }
  };

  const chooseLimit = (nextLimit: number) => {
    setIsLimitMenuOpen(false);

    if (nextLimit !== limit) {
      onLimitChange(nextLimit);
    }
  };

  const handleGenreWheel = (event: WheelEvent<HTMLDivElement>) => {
    const rail = event.currentTarget;

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    if (rail.scrollWidth <= rail.clientWidth) {
      return;
    }

    rail.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  return (
    <CatalogCard
      as="section"
      bg="var(--app-panel)"
      border="1px solid var(--app-border)"
      borderRadius="xl"
      boxShadow="var(--app-shadow-soft)"
      minWidth={0}
      overflow="hidden"
    >
      <CatalogHeader alignItems="center" as="header" gap={7} justifyContent="space-between" p={7}>
        <Stack>
          <CatalogTitle as="h2" variant="card">
            Song Catalog
          </CatalogTitle>
          <CatalogTelemetry as="span" variant="caption" tone="muted">
            Telemetry: {startItem}-{endItem} of {totalItems} indexed Songs
          </CatalogTelemetry>
        </Stack>
        <Controls alignItems="center" gap={6} minWidth={0}>
          <SearchShell as="label" gap={4}>
            <Search size={15} />
            <input
              id="catalog-search-input"
              type="search"
              aria-label="Search Songs"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search Songs..."
            />
            {searchText ? (
              <ClearSearchButton
                type="button"
                aria-label="Clear search"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSearchChange("")}
              >
                <X size={13} />
              </ClearSearchButton>
            ) : null}
          </SearchShell>
          <Divider bg="var(--app-border)" height={7} width="1px" />
          <GenreControls flex="1 1 0%" gap={4} minWidth={0}>
            <Filter size={15} />
            <strong>Genres:</strong>
            <GenreScroller flex="1 1 0%" gap={3} maxWidth="100%" minWidth={0} width="100%" onWheel={handleGenreWheel}>
              {["All", ...genres].map((genreName) => (
                <GenreButton
                  id={`filter-genre-pill-${genreName}`}
                  key={genreName}
                  type="button"
                  $active={(genreName === "All" && !genre) || genre === genreName}
                  onClick={() => onGenreChange(genreName)}
                >
                  {genreName}
                </GenreButton>
              ))}
            </GenreScroller>
          </GenreControls>
        </Controls>
      </CatalogHeader>

      <TableShell minWidth={0} overflow="hidden">
        <Table aria-label="Song Catalog">
          <CatalogColumnGroup>
            <col className="title-column" />
            <col className="album-column" />
            <col className="genre-column" />
            <col className="duration-column" />
            <col className="actions-column" />
          </CatalogColumnGroup>
          <thead>
            <tr>
              <th># Title</th>
              <th>Album</th>
              <th>Genre Category</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyTableText as="div" tone="muted" variant="supporting">
                    {isFiltered ? "No Songs match your query in this scope." : "No Songs have been added yet."}
                  </EmptyTableText>
                </td>
              </tr>
            ) : (
              items.map((song, index) => {
                const isSelected = activeSongId === song.id;

                return (
                  <SongRow key={song.id} $selected={isSelected} onClick={() => onSelectSong(song)}>
                    <td>
                      <TitleCell>
                        <IndexCell>
                          {isSelected && isPlaying ? (
                            <Equalizer aria-label="Selected Song">
                              <span />
                              <span />
                              <span />
                            </Equalizer>
                          ) : (
                            (page - 1) * limit + index + 1
                          )}
                        </IndexCell>
                        <Artwork
                          src={song.artworkUrl ?? fallbackArtwork}
                          alt={`${song.album} artwork`}
                          referrerPolicy="no-referrer"
                        />
                        <TitleText>
                          <strong>{song.title}</strong>
                          <span>{song.artist}</span>
                          <MobileMetadata>
                            {song.artist}
                            <MetadataDot aria-hidden="true">•</MetadataDot>
                            {song.genre}
                            <MetadataDot aria-hidden="true">•</MetadataDot>
                            {song.duration}
                          </MobileMetadata>
                        </TitleText>
                      </TitleCell>
                    </td>
                    <td>{song.album}</td>
                    <td>
                      <GenreLabel>{song.genre}</GenreLabel>
                    </td>
                    <td>
                      <DurationText>{song.duration}</DurationText>
                    </td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <RowActions>
                        <Button
                          id={`edit-song-btn-${song.id}`}
                          type="button"
                          size="sm"
                          title="Edit Song"
                          variant="ghost"
                          onClick={() => onEditSong(song)}
                        >
                          <Edit size={15} />
                          <ActionText>Edit</ActionText>
                        </Button>
                        <Button
                          id={`del-song-btn-${song.id}`}
                          type="button"
                          size="sm"
                          title="Delete Song"
                          tone="danger"
                          variant="ghost"
                          onClick={() => onDeleteSong(song)}
                        >
                          <Trash2 size={15} />
                          <ActionText>Del</ActionText>
                        </Button>
                      </RowActions>
                    </td>
                  </SongRow>
                );
              })
            )}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <EmptyRow key={index}>
                <td colSpan={5} />
              </EmptyRow>
            ))}
          </tbody>
        </Table>
      </TableShell>

      <Pagination alignItems="flex-end" as="footer" flexWrap="wrap" gap={6} justifyContent="space-between">
        <PaginationNavigation alignItems="flex-start" gap={4} justifyContent="flex-start" minWidth={0}>
          <PaginationSummary as="span" variant="supporting" tone="muted">
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> Songs
          </PaginationSummary>
          <PageControls gap={3}>
            <Button type="button" size="sm" variant="outline" disabled={page <= 1 || status === "loading"} onClick={() => onPageChange(page - 1)}>
              Prev
            </Button>
            {pageNumbers.map((pageNumber) => (
              <PageNumber
                key={pageNumber}
                type="button"
                size="sm"
                variant={pageNumber === page ? "solid" : "outline"}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PageNumber>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page >= totalPages || status === "loading"}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </PageControls>
        </PaginationNavigation>
        <LimitControl gap={3} minWidth={0} onBlur={closeLimitMenuOnBlur}>
          <LimitMenuButton
            aria-label={`Songs per page, ${selectedLimit}`}
            aria-expanded={isLimitMenuOpen}
            aria-haspopup="listbox"
            disabled={status === "loading"}
            type="button"
            onClick={() => setIsLimitMenuOpen((isOpen) => !isOpen)}
          >
            <strong>{selectedLimit}</strong>
            <ChevronDown size={14} />
          </LimitMenuButton>
          {isLimitMenuOpen ? (
            <LimitMenu role="listbox" aria-label="Songs per page">
              {limitOptions.map((option) => (
                <LimitOption
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={option === selectedLimit}
                  data-active={option === selectedLimit}
                  onClick={() => chooseLimit(option)}
                >
                  {option}
                </LimitOption>
              ))}
            </LimitMenu>
          ) : null}
        </LimitControl>
      </Pagination>
    </CatalogCard>
  );
};

const CatalogCard = styled(Box)(({ theme }) => ({
  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    borderRadius: theme.radii.lg
  }
}));

const CatalogHeader = styled(Flex)(({ theme }) => ({
  borderBottom: `1px solid ${theme.colors.border.subtle}`,

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    alignItems: "stretch",
    flexDirection: "column",
    gap: theme.space[5],
    padding: theme.space[6]
  },

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    padding: theme.space[5]
  }
}));

const CatalogTitle = styled(Heading)`
  color: var(--app-inverse);
  font-size: ${({ theme }) => theme.fontSizes.md};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const CatalogTelemetry = styled(Text)`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Controls = styled(Flex)(({ theme }) => ({

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    alignItems: "stretch",
    flexDirection: "column",
    width: "100%"
  }
}));

const SearchShell = styled(Inline)(({ theme }) => ({
  background: theme.colors.surface.panelSubtle,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.full,
  color: theme.colors.text.muted,
  flexWrap: "nowrap",
  height: theme.space[10],
  padding: `0 ${theme.space[6]}px`,
  width: theme.space[12] * 3 + theme.space[9],

  input: {
    background: "transparent",
    border: 0,
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    minWidth: 0,
    outline: 0,
    width: "100%"
  },

  "input::-webkit-search-cancel-button": {
    display: "none"
  },

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    width: "100%"
  }
}));

const ClearSearchButton = styled.button(({ theme }) => ({
  alignItems: "center",
  background: theme.colors.border.default,
  border: 0,
  borderRadius: theme.radii.full,
  color: theme.colors.text.secondary,
  display: "inline-flex",
  flex: `0 0 ${theme.space[7]}px`,
  height: theme.space[7],
  justifyContent: "center",
  padding: 0,
  width: theme.space[7],

  "&:hover": {
    background: theme.colors.border.strong,
    color: theme.colors.text.primary
  }
}));

const Divider = styled(Box)(({ theme }) => ({

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    display: "none"
  }
}));

const GenreControls = styled(Inline)(({ theme }) => ({
  color: theme.colors.text.muted,
  flexWrap: "nowrap",
  overflow: "hidden",

  strong: {
    color: theme.colors.text.muted,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.black,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: theme.space[3],
    overflow: "visible"
  }
}));

const GenreScroller = styled(Flex)(({ theme }) => ({
  flexWrap: "nowrap",
  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "none",
  touchAction: "pan-x",
  WebkitOverflowScrolling: "touch",

  "&::-webkit-scrollbar": {
    display: "none"
  },

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    flex: "1 1 100%",
    flexWrap: "wrap",
    overflow: "visible",
    touchAction: "auto",
    width: "100%"
  }
}));

const GenreButton = styled.button<{ $active?: boolean }>(({ theme, $active }) => ({
  background: $active ? theme.colors.brand.primary : theme.colors.surface.panelSubtle,
  border: 0,
  borderRadius: theme.radii.full,
  color: $active ? theme.colors.brand.onPrimary : theme.colors.text.secondary,
  flex: "0 0 auto",
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.black,
  padding: `${theme.space[3]}px ${theme.space[5]}px`,
  textTransform: "uppercase",
  whiteSpace: "nowrap"
}));

const TableShell = Box;

const Table = styled.table(({ theme }) => ({
  borderCollapse: "collapse",
  color: theme.colors.text.secondary,
  fontSize: theme.fontSizes.sm,
  tableLayout: "fixed",
  width: "100%",

  th: {
    background: theme.colors.surface.panelSubtle,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    color: theme.colors.text.muted,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.black,
    letterSpacing: "0.11em",
    padding: `${theme.space[6]}px ${theme.space[7]}px`,
    textAlign: "left",
    textTransform: "uppercase"
  },

  td: {
    borderBottom: `1px solid ${theme.colors.surface.panelSubtle}`,
    padding: `${theme.space[6]}px ${theme.space[7]}px`
  },

  "th:last-of-type, td:last-of-type": {
    textAlign: "right"
  },

  "td:not(:first-of-type)": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  [`@media (max-width: ${theme.breakpoints[3]})`]: {
    "th:nth-of-type(3), td:nth-of-type(3), th:nth-of-type(4), td:nth-of-type(4)": {
      display: "none"
    },

    "th, td": {
      padding: theme.space[6]
    }
  },

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    display: "block",

    colgroup: {
      display: "none"
    },

    thead: {
      display: "none"
    },

    tbody: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      width: "100%"
    },

    tr: {
      alignItems: "center",
      borderBottom: `1px solid ${theme.colors.surface.panelSubtle}`,
      display: "grid",
      gridTemplateColumns: `minmax(0, 1fr) minmax(${theme.space[12]}px, auto)`,
      minWidth: 0,
      overflow: "hidden",
      width: "100%"
    },

    "tbody tr:last-of-type": {
      borderBottom: 0
    },

    "td:first-of-type": {
      minWidth: 0
    },

    "td:first-of-type, td:last-of-type": {
      borderBottom: 0,
      display: "block",
      padding: `${theme.space[5]}px ${theme.space[4]}px`,
      textAlign: "left"
    },

    "td:last-of-type": {
      minWidth: 0,
      textAlign: "right"
    },

    "td[colspan]": {
      gridColumn: "1 / -1"
    },

    "td:nth-of-type(2), td:nth-of-type(3), td:nth-of-type(4)": {
      display: "none"
    },

    "td:not(:first-of-type)": {
      overflow: "visible",
      textOverflow: "clip",
      whiteSpace: "normal"
    }
  }
}));

const CatalogColumnGroup = styled.colgroup(({ theme }) => ({
  ".title-column": {
    width: "36%"
  },
  ".album-column": {
    width: "16%"
  },
  ".genre-column": {
    width: "18%"
  },
  ".duration-column": {
    width: "12%"
  },
  ".actions-column": {
    width: "18%"
  },

  [`@media (max-width: ${theme.breakpoints[3]})`]: {
    ".title-column": {
      width: "54%"
    },
    ".album-column": {
      width: "24%"
    },
    ".genre-column, .duration-column": {
      display: "none"
    },
    ".actions-column": {
      width: "22%"
    }
  }
}));

const SongRow = styled.tr<{ $selected?: boolean }>(({ theme, $selected }) => ({
  background: $selected ? theme.colors.selection.row : theme.colors.surface.panel,
  transition: "background 150ms ease",

  "&:hover": {
    background: $selected ? theme.colors.selection.rowHover : theme.colors.surface.panelSubtle
  }
}));

const TitleCell = styled.div(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  gap: theme.space[6],
  minWidth: theme.space[12] * 3 + theme.space[9],

  [`@media (max-width: ${theme.breakpoints[3]})`]: {
    minWidth: 0
  },

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    gap: theme.space[4]
  }
}));

const IndexCell = styled.span(({ theme }) => ({
  color: theme.colors.text.muted,
  display: "inline-flex",
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.medium,
  justifyContent: "center",
  width: theme.space[8],

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    width: theme.space[6]
  }
}));

const Equalizer = styled.span(({ theme }) => ({
  alignItems: "end",
  display: "inline-flex",
  gap: theme.space[1],
  height: theme.space[6],

  span: {
    animation: "pulse-bar 780ms infinite ease-in-out alternate",
    background: theme.colors.brand.primary,
    borderRadius: theme.radii.full,
    width: theme.space[1]
  },

  "span:nth-of-type(1)": {
    height: theme.space[4]
  },

  "span:nth-of-type(2)": {
    animationDelay: "120ms",
    height: theme.space[6]
  },

  "span:nth-of-type(3)": {
    animationDelay: "240ms",
    height: theme.space[3]
  },

  "@keyframes pulse-bar": {
    from: {
      transform: "scaleY(0.55)"
    },
    to: {
      transform: "scaleY(1)"
    }
  }
}));

const Artwork = styled(CachedArtworkImage)(({ theme }) => ({
  background: theme.colors.surface.panelSubtle,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.md,
  flexShrink: 0,
  height: theme.space[10],
  objectFit: "cover",
  width: theme.space[10],

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    height: theme.space[9],
    width: theme.space[9]
  }
}));

const TitleText = styled.div(({ theme }) => ({
  minWidth: 0,

  strong: {
    color: theme.colors.text.primary,
    display: "block",
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.black,
    maxWidth: `min(${theme.space[13] * 3}px, 42vw)`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  "> span": {
    color: theme.colors.text.muted,
    display: "block",
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.medium,
    maxWidth: `min(${theme.space[13] * 3}px, 42vw)`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  [`@media (max-width: ${theme.breakpoints[3]})`]: {
    "> span": {
      display: "none"
    }
  },

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    strong: {
      maxWidth: "100%"
    }
  }
}));

const GenreLabel = styled.span(({ theme }) => ({
  background: theme.colors.surface.panelSubtle,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.full,
  color: theme.colors.text.secondary,
  display: "inline-flex",
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.black,
  padding: `${theme.space[3]}px ${theme.space[4]}px`,
  textTransform: "uppercase"
}));

const DurationText = styled.span(({ theme }) => ({
  color: theme.colors.text.muted,
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.black
}));

const MobileMetadata = styled.small(({ theme }) => ({
  alignItems: "center",
  color: theme.colors.text.muted,
  display: "none",
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.medium,
  gap: theme.space[3],
  maxWidth: `min(${theme.space[13] * 3}px, 42vw)`,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",

  [`@media (max-width: ${theme.breakpoints[3]})`]: {
    display: "flex"
  },

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    maxWidth: "100%"
  }
}));

const MetadataDot = styled.span(({ theme }) => ({
  alignItems: "center",
  color: theme.colors.text.muted,
  display: "inline-flex",
  fontSize: "0.8em",
  fontWeight: theme.fontWeights.black,
  justifyContent: "center",
  lineHeight: theme.lineHeights.tight
}));

const RowActions = styled.div(({ theme }) => ({
  display: "inline-flex",
  gap: theme.space[4],
  justifyContent: "flex-end",
  minWidth: 0,

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    gap: theme.space[1],
    justifySelf: "end",

    button: {
      paddingInline: theme.space[3]
    }
  }
}));

const ActionText = styled.span(({ theme }) => ({
  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    display: "none"
  }
}));

const EmptyTableText = styled(Text)(({ theme }) => ({
  fontWeight: theme.fontWeights.medium,
  padding: theme.space[8],
  textAlign: "center"
}));

const EmptyRow = styled.tr(({ theme }) => ({
  height: theme.space[10],

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    display: "none"
  }
}));

const Pagination = styled(Flex)(({ theme }) => ({
  background: theme.colors.surface.panelSubtle,
  borderTop: `1px solid ${theme.colors.border.default}`,
  color: theme.colors.text.muted,
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  rowGap: theme.space[4],
  padding: `${theme.space[6]}px ${theme.space[7]}px`,

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    padding: theme.space[5]
  }
}));

const PaginationSummary = styled(Text)({
  whiteSpace: "nowrap"
});

const PaginationNavigation = styled(Stack)(({ theme }) => ({
  rowGap: theme.space[3]
}));

const LimitControl = styled(Inline)(({ theme }) => ({
  color: theme.colors.text.muted,
  marginLeft: "auto",
  position: "relative"
}));

const LimitMenuButton = styled.button(({ theme }) => ({
  alignItems: "center",
  background: theme.colors.surface.panel,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.lg,
  color: theme.colors.text.primary,
  display: "inline-flex",
  gap: theme.space[2],
  justifyContent: "space-between",
  minHeight: theme.space[9],
  minWidth: theme.space[10] + theme.space[3],
  padding: `0 ${theme.space[3]}px 0 ${theme.space[4]}px`,
  transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",

  strong: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.black
  },

  svg: {
    color: theme.colors.text.muted,
    transition: "transform 150ms ease"
  },

  "&[aria-expanded='true']": {
    borderColor: theme.colors.action.accent,
    boxShadow: theme.colors.focus.shadow
  },

  "&[aria-expanded='true'] svg": {
    transform: "rotate(180deg)"
  },

  "&:hover:not(:disabled)": {
    borderColor: theme.colors.border.strong,
    transform: "translateY(-1px)"
  },

  "&:disabled": {
    color: theme.colors.text.muted,
    cursor: "not-allowed",
    opacity: 0.65
  }
}));

const LimitMenu = styled(Grid)(({ theme }) => ({
  background: theme.colors.surface.panel,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.lg,
  bottom: `calc(100% + ${theme.space[2]}px)`,
  boxShadow: theme.effects.shadows.raised,
  gap: theme.space[1],
  minWidth: theme.space[11],
  padding: theme.space[2],
  position: "absolute",
  right: 0,
  zIndex: 10
}));

const LimitOption = styled.button(({ theme }) => ({
  background: "transparent",
  border: 0,
  borderRadius: theme.radii.md,
  color: theme.colors.text.secondary,
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.black,
  minHeight: theme.space[8],
  padding: `0 ${theme.space[4]}px`,
  textAlign: "left",

  "&:hover": {
    background: theme.colors.surface.panelSubtle,
    color: theme.colors.text.primary
  },

  "&[data-active='true']": {
    background: theme.colors.action.primary,
    color: theme.colors.text.inverse
  }
}));

const PageControls = styled(Inline)(({ theme }) => ({
  marginInline: theme.space[4],

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    flexWrap: "wrap"
  }
}));

const PageNumber = styled(Button)(({ theme }) => ({
  minWidth: theme.space[9],
  paddingInline: theme.space[4]
}));
