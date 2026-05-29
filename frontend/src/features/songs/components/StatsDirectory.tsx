import styled from "@emotion/styled";
import { Disc } from "lucide-react";
import { Box, Heading, Inline } from "../../../design/primitives";
import type { SongLibraryStats } from "../../../store/songsSlice";
import { CountPill } from "../../../ui/CountPill";
import type { SongStatsAdapters } from "../statsAdapters";

type StatsDirectoryTab = "artists" | "albums";

interface StatsDirectoryProps {
  activeSubTab: StatsDirectoryTab;
  adapters: SongStatsAdapters;
  onSubTabChange: (tab: StatsDirectoryTab) => void;
  stats: SongLibraryStats;
}

export const StatsDirectory = ({ activeSubTab, adapters, onSubTabChange, stats }: StatsDirectoryProps) => (
  <>
    <DirectoryHeader>
      <DirectoryHeading as="h3" variant="card">
        {activeSubTab === "artists" ? "Artist Inventory Directory" : "Album Volume Directory"}
      </DirectoryHeading>
      <TabSwitch>
        <button type="button" onClick={() => onSubTabChange("artists")} data-active={activeSubTab === "artists"}>
          Artists ({stats.artists.length})
        </button>
        <button type="button" onClick={() => onSubTabChange("albums")} data-active={activeSubTab === "albums"}>
          Albums ({stats.songsByAlbum.length})
        </button>
      </TabSwitch>
    </DirectoryHeader>

    <DirectoryTable>
      <thead>
        {activeSubTab === "artists" ? (
          <tr>
            <th>Artist Name</th>
            <th>Albums Count</th>
            <th>Songs Contributed</th>
          </tr>
        ) : (
          <tr>
            <th>Album Title</th>
            <th>Songs Segment</th>
          </tr>
        )}
      </thead>
      <tbody>
        {activeSubTab === "artists"
          ? stats.artists.map((artist) => (
              <tr key={artist.artist}>
                <td>
                  <MiniAvatar as="span">{artist.artist.charAt(0)}</MiniAvatar>
                  {artist.artist}
                </td>
                <td>{artist.albums}</td>
                <td>
                  <CountPill>{artist.songs} Songs</CountPill>
                </td>
              </tr>
            ))
          : adapters.albumEntries.map(([album, count]) => (
              <tr key={album}>
                <td>
                  <AlbumIcon as="span">
                    <Disc size={14} />
                  </AlbumIcon>
                  {album}
                </td>
                <td>
                  <CountPill>{count} Songs</CountPill>
                </td>
              </tr>
            ))}
      </tbody>
    </DirectoryTable>
  </>
);

const DirectoryHeader = styled(Inline)`
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--app-border);
  padding-bottom: 12px;
`;

const DirectoryHeading = styled(Heading)`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const TabSwitch = styled(Inline)`
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.md}px;
  background: var(--app-panel-subtle);
  padding: 3px;

  button {
    border: 0;
    border-radius: ${({ theme }) => theme.radii.sm}px;
    background: transparent;
    color: var(--app-muted);
    padding: 6px 10px;
    font-size: 0.65rem;
    font-weight: 950;
    text-transform: uppercase;
  }

  button[data-active="true"] {
    background: var(--app-panel);
    color: var(--app-text);
    box-shadow: var(--app-shadow-soft);
  }
`;

const DirectoryTable = styled.table`
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.lg}px;
  border-spacing: 0;
  color: var(--app-text-secondary);
  font-size: 0.76rem;

  th {
    background: var(--app-panel-subtle);
    color: var(--app-muted);
    padding: 11px 14px;
    text-align: left;
    font-size: 0.58rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  td {
    border-top: 1px solid var(--app-panel-subtle);
    padding: 11px 14px;
    font-weight: 800;
  }

  th:not(:first-of-type),
  td:not(:first-of-type) {
    text-align: right;
  }
`;

const MiniAvatar = styled(Box)`
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
  margin-right: 9px;
  border-radius: ${({ theme }) => theme.radii.full}px;
  background: var(--app-inverse);
  color: var(--app-inverse-text);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 950;
`;

const AlbumIcon = styled(Box)`
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
  margin-right: 9px;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background: var(--app-album-icon-background);
  color: var(--app-album-icon-text);
`;
