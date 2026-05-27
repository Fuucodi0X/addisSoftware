import styled from "@emotion/styled";
import { Edit, Filter, Search, Trash2, X } from "lucide-react";
import type { Song } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";

type SongLoadStatus = "idle" | "loading" | "succeeded" | "failed";

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
  const endItem = Math.min(page * limit, totalItems);
  const emptyRows = Math.max(0, 5 - items.length);
  const pageNumbers = Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index + 1);

  return (
    <CatalogCard>
      <CatalogHeader>
        <div>
          <h2>Song Catalog</h2>
          <span>
            Telemetry: {startItem}-{endItem} of {totalItems} indexed Songs
          </span>
        </div>
        <Controls>
          <SearchShell>
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
          <Divider />
          <GenreControls>
            <Filter size={15} />
            <strong>Genres:</strong>
            <GenreScroller>
              {["All", ...genres].slice(0, 6).map((genreName) => (
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

      <TableShell>
        <Table aria-label="Song Catalog">
          <CatalogColumnGroup>
            <col className="title-column" />
            <col className="artist-column" />
            <col className="genre-column" />
            <col className="duration-column" />
            <col className="actions-column" />
          </CatalogColumnGroup>
          <thead>
            <tr>
              <th># Title</th>
              <th>Artist Name</th>
              <th>Genre Category</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyTableText>
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
                          <span>{song.album}</span>
                          <MobileMetadata>
                            {song.album}
                            <MetadataDot aria-hidden="true">•</MetadataDot>
                            {song.genre}
                            <MetadataDot aria-hidden="true">•</MetadataDot>
                            {song.duration}
                          </MobileMetadata>
                        </TitleText>
                      </TitleCell>
                    </td>
                    <td>{song.artist}</td>
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

      <Pagination>
        <span>
          Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> Songs
        </span>
        <PageControls>
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
      </Pagination>
    </CatalogCard>
  );
};

const CatalogCard = styled.section(({ theme }) => ({
  background: theme.colors.surface.panel,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.xl,
  boxShadow: theme.effects.shadows.soft,
  minWidth: 0,
  overflow: "hidden",

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    borderRadius: theme.radii.lg
  }
}));

const CatalogHeader = styled.header(({ theme }) => ({
  alignItems: "center",
  borderBottom: `1px solid ${theme.colors.border.subtle}`,
  display: "flex",
  gap: theme.space[7],
  justifyContent: "space-between",
  padding: theme.space[7],

  h2: {
    color: theme.colors.surface.inverse,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.black,
    letterSpacing: "0.05em",
    margin: 0,
    textTransform: "uppercase"
  },

  span: {
    color: theme.colors.text.muted,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: "0.04em",
    textTransform: "uppercase"
  },

  [`@media (max-width: ${theme.breakpoints[2]})`]: {
    alignItems: "flex-start",
    flexDirection: "column"
  }
}));

const Controls = styled.div(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  gap: theme.space[6],
  minWidth: 0,

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    alignItems: "stretch",
    flexDirection: "column",
    width: "100%"
  }
}));

const SearchShell = styled.label(({ theme }) => ({
  alignItems: "center",
  background: theme.colors.surface.panelSubtle,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.full,
  color: theme.colors.text.muted,
  display: "flex",
  gap: theme.space[4],
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

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
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

const Divider = styled.div(({ theme }) => ({
  background: theme.colors.border.default,
  height: theme.space[7],
  width: "1px",

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    display: "none"
  }
}));

const GenreControls = styled.div(({ theme }) => ({
  alignItems: "center",
  color: theme.colors.text.muted,
  display: "flex",
  gap: theme.space[4],
  minWidth: 0,

  strong: {
    color: theme.colors.text.muted,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.black,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    alignItems: "flex-start",
    flexWrap: "wrap"
  }
}));

const GenreScroller = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.space[3],
  maxWidth: "100%",
  minWidth: 0,
  overflowX: "auto"
}));

const GenreButton = styled.button<{ $active?: boolean }>(({ theme, $active }) => ({
  background: $active ? theme.colors.brand.primary : theme.colors.surface.panelSubtle,
  border: 0,
  borderRadius: theme.radii.full,
  color: $active ? theme.colors.brand.onPrimary : theme.colors.text.secondary,
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.black,
  padding: `${theme.space[3]}px ${theme.space[5]}px`,
  textTransform: "uppercase",
  whiteSpace: "nowrap"
}));

const TableShell = styled.div({
  overflowX: "auto"
});

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
    minWidth: theme.space[13] * 10,

    "th:nth-of-type(3), td:nth-of-type(3), th:nth-of-type(4), td:nth-of-type(4)": {
      display: "none"
    },

    "th, td": {
      padding: theme.space[6]
    }
  },

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    "th:nth-of-type(2), td:nth-of-type(2)": {
      display: "none"
    }
  }
}));

const CatalogColumnGroup = styled.colgroup({
  ".title-column": {
    width: "36%"
  },
  ".artist-column": {
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
  }
});

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
  }
}));

const IndexCell = styled.span(({ theme }) => ({
  color: theme.colors.text.muted,
  display: "inline-flex",
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.medium,
  justifyContent: "center",
  width: theme.space[8]
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

const Artwork = styled.img(({ theme }) => ({
  background: theme.colors.surface.panelSubtle,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.md,
  flexShrink: 0,
  height: theme.space[10],
  objectFit: "cover",
  width: theme.space[10]
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

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    gap: theme.space[1]
  }
}));

const ActionText = styled.span(({ theme }) => ({
  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    display: "none"
  }
}));

const EmptyTableText = styled.div(({ theme }) => ({
  color: theme.colors.text.muted,
  fontWeight: theme.fontWeights.medium,
  padding: theme.space[8],
  textAlign: "center"
}));

const EmptyRow = styled.tr(({ theme }) => ({
  height: theme.space[10]
}));

const Pagination = styled.footer(({ theme }) => ({
  alignItems: "center",
  background: theme.colors.surface.panelSubtle,
  borderTop: `1px solid ${theme.colors.border.default}`,
  color: theme.colors.text.muted,
  display: "flex",
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  gap: theme.space[6],
  justifyContent: "space-between",
  padding: `${theme.space[6]}px ${theme.space[7]}px`,

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    alignItems: "stretch",
    flexDirection: "column"
  }
}));

const PageControls = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.space[3]
}));

const PageNumber = styled(Button)(({ theme }) => ({
  minWidth: theme.space[9],
  paddingInline: theme.space[4]
}));
