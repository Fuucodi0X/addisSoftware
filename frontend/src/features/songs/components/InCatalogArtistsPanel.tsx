import styled from "@emotion/styled";
import { Award } from "lucide-react";
import { Box, Grid, Inline, Stack, Text } from "../../../design/primitives";
import type { SongLibraryStats } from "../../../store/songsSlice";

interface InCatalogArtistsPanelProps {
  artists: SongLibraryStats["artists"];
  onShowStats: () => void;
}

export const InCatalogArtistsPanel = ({ artists, onShowStats }: InCatalogArtistsPanelProps) => (
  <ArtistPanel as="section" borderRadius="xl" boxShadow="var(--app-shadow-soft)" minHeight="240px" minWidth={0} p={7}>
    <PanelHeader alignItems="center" justifyContent="space-between" gap={5} mb={6}>
      <PanelTitle as="h2" variant="label">
        <Award size={16} />
        In-Catalog Artists
      </PanelTitle>
      <TextButton id="switch-stats-btn" type="button" onClick={onShowStats}>
        See More Analytics &gt;
      </TextButton>
    </PanelHeader>
    <ArtistList gap={5}>
      {artists.length > 0 ? (
        artists.slice(0, 4).map((artist, index) => (
          <ArtistRow key={artist.artist} gap={5} p={4}>
            <Avatar $tone={index}>{artist.artist.charAt(0).toUpperCase()}</Avatar>
            <Box minWidth={0}>
              <ArtistName>{artist.artist}</ArtistName>
              <ArtistMeta as="span" variant="caption" tone="muted">
                {artist.albums} album record{artist.albums === 1 ? "" : "s"}
              </ArtistMeta>
            </Box>
            <CountPill>
              {artist.songs} Song{artist.songs === 1 ? "" : "s"}
            </CountPill>
          </ArtistRow>
        ))
      ) : (
        <EmptyText tone="muted" variant="supporting">
          No artists index populated yet.
        </EmptyText>
      )}
    </ArtistList>
  </ArtistPanel>
);

const ArtistPanel = styled(Stack)`
  border: 1px solid var(--app-border);
  background: var(--app-panel);

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 20px;
  }
`;

const PanelHeader = styled(Inline)`
  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
`;

const PanelTitle = styled(Text)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]}px;
  color: var(--app-text);
  letter-spacing: 0.06em;

  svg {
    color: var(--app-brand);
  }
`;

const TextButton = styled.button`
  border: 0;
  background: transparent;
  color: var(--app-muted);
  font-size: 0.65rem;
  font-weight: 800;
  white-space: nowrap;

  &:hover {
    color: var(--app-brand);
  }
`;

const ArtistList = styled(Grid)``;

const ArtistRow = styled(Grid)`
  align-items: center;
  grid-template-columns: auto minmax(0, 1fr) auto;
  border: 1px solid var(--app-panel-subtle);
  border-radius: ${({ theme }) => theme.radii.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: ${({ theme }) => theme.space[4]}px;

    > span:last-of-type {
      grid-column: 3;
      justify-self: end;
    }
  }
`;

const ArtistName = styled(Text)`
  display: block;
  color: var(--app-inverse);
  font-size: 0.78rem;
  font-weight: 850;
`;

const ArtistMeta = styled(Text)`
  font-size: 0.65rem;
  font-weight: 700;
`;

const Avatar = styled.div<{ $tone: number }>`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.full}px;
  font-size: 0.74rem;
  font-weight: 950;
  background: ${({ $tone }) =>
    ["var(--app-avatar-bg-1)", "var(--app-avatar-bg-2)", "var(--app-avatar-bg-3)", "var(--app-avatar-bg-4)"][
      $tone % 4
    ]};
  color: ${({ $tone }) =>
    ["var(--app-avatar-fg-1)", "var(--app-avatar-fg-2)", "var(--app-avatar-fg-3)", "var(--app-avatar-fg-4)"][
      $tone % 4
    ]};
`;

const CountPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full}px;
  background: var(--app-inverse);
  color: var(--app-inverse-text);
  padding: 5px 9px;
  font-size: 0.64rem;
  font-weight: 900;
  white-space: nowrap;
`;

const EmptyText = styled(Text)`
  font-size: 0.78rem;
  font-weight: 650;
  font-style: italic;
`;
