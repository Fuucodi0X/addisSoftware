import styled from "@emotion/styled";
import { Award } from "lucide-react";
import type { SongLibraryStats } from "../../../store/songsSlice";

interface InCatalogArtistsPanelProps {
  artists: SongLibraryStats["artists"];
  onShowStats: () => void;
}

export const InCatalogArtistsPanel = ({ artists, onShowStats }: InCatalogArtistsPanelProps) => (
  <ArtistPanel>
    <PanelHeader>
      <PanelTitle>
        <Award size={16} />
        In-Catalog Artists
      </PanelTitle>
      <TextButton id="switch-stats-btn" type="button" onClick={onShowStats}>
        See More Analytics &gt;
      </TextButton>
    </PanelHeader>
    <ArtistList>
      {artists.length > 0 ? (
        artists.slice(0, 4).map((artist, index) => (
          <ArtistRow key={artist.artist}>
            <Avatar $tone={index}>{artist.artist.charAt(0).toUpperCase()}</Avatar>
            <div>
              <strong>{artist.artist}</strong>
              <span>
                {artist.albums} album record{artist.albums === 1 ? "" : "s"}
              </span>
            </div>
            <CountPill>
              {artist.songs} Song{artist.songs === 1 ? "" : "s"}
            </CountPill>
          </ArtistRow>
        ))
      ) : (
        <EmptyText>No artists index populated yet.</EmptyText>
      )}
    </ArtistList>
  </ArtistPanel>
);

const ArtistPanel = styled.section`
  min-width: 0;
  min-height: 240px;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.xl}px;
  background: var(--app-panel);
  padding: 22px;
  box-shadow: var(--app-shadow-soft);

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    border-radius: ${({ theme }) => theme.radii.xl}px;
    padding: 20px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
`;

const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--app-text);
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: uppercase;
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

const ArtistList = styled.div`
  display: grid;
  gap: 10px;
`;

const ArtistRow = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 9px;
  border: 1px solid var(--app-panel-subtle);
  border-radius: ${({ theme }) => theme.radii.md}px;

  strong {
    display: block;
    color: var(--app-inverse);
    font-size: 0.78rem;
  }

  span {
    color: var(--app-muted);
    font-size: 0.65rem;
    font-weight: 700;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: ${({ theme }) => theme.space[4]}px;

    > span:last-of-type {
      grid-column: 3;
      justify-self: end;
    }
  }
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

const EmptyText = styled.p`
  margin: 0;
  color: var(--app-muted);
  font-size: 0.78rem;
  font-weight: 650;
  font-style: italic;
`;
