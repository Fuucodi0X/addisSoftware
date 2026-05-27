import styled from "@emotion/styled";
import { Activity, AlertCircle, BarChart2, Disc, Layers, Music, Tag, User } from "lucide-react";
import { useMemo, useState } from "react";
import type { SongLibraryStats } from "../../../store/songsSlice";
import { getStatsAdapters, type SongStatsAdapters } from "../statsAdapters";

interface StatsDashboardProps {
  error: string | null;
  onBack: () => void;
  stats: SongLibraryStats;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const StatsDashboard = ({ error, onBack, stats, status }: StatsDashboardProps) => {
  const adapters = useMemo(() => getStatsAdapters(stats), [stats]);

  if (status === "loading") {
    return (
      <StatsShell>
        <LoadingBlock>
          <Spinner />
          <p>Calculating catalog telemetry...</p>
        </LoadingBlock>
      </StatsShell>
    );
  }

  if (status === "failed") {
    return (
      <ErrorBanner>
        <AlertCircle size={20} />
        <div>
          <strong>Unable to load statistics</strong>
          <p>{error}</p>
        </div>
      </ErrorBanner>
    );
  }

  return <StatsSummary adapters={adapters} onBack={onBack} stats={stats} />;
};

interface StatsSummaryProps {
  adapters: SongStatsAdapters;
  onBack: () => void;
  stats: SongLibraryStats;
}

const StatsSummary = ({ adapters, onBack, stats }: StatsSummaryProps) => {
  const [activeSubTab, setActiveSubTab] = useState<"artists" | "albums">("artists");

  return (
    <StatsShell id="datadoor-container">
      <StatsTopBar>
        <div>
          <h2>KPI Metrics Summary</h2>
          <p>Catalogue-level Song, Artist, Album, and Genre distribution.</p>
        </div>
        <SecondaryAction type="button" onClick={onBack}>
          Back to Catalog
        </SecondaryAction>
      </StatsTopBar>
      <StatsGrid>
        <StatsOverview id="datadoor-overview-pane">
          <MetricGrid>
            <MetricCard>
              <span>Songs</span>
              <Music size={16} />
              <strong>{stats.totals.songs}</strong>
              <small>Indexed records</small>
            </MetricCard>
            <MetricCard>
              <span>Artists</span>
              <User size={16} />
              <strong>{stats.totals.artists}</strong>
              <small>Credited names</small>
            </MetricCard>
            <MetricCard>
              <span>Albums</span>
              <Disc size={16} />
              <strong>{stats.totals.albums}</strong>
              <small>Album names</small>
            </MetricCard>
            <MetricCard>
              <span>Genres</span>
              <Tag size={16} />
              <strong>{stats.totals.genres}</strong>
              <small>Classifications</small>
            </MetricCard>
          </MetricGrid>

          <Distribution>
            <DistributionHeader>
              <strong>Songs Classification by Genre</strong>
              <span>Spectrum Distribution</span>
            </DistributionHeader>
            <StackedBar>
              {adapters.genreEntries.length > 0 ? (
                adapters.genreEntries.map(([genre, count], index) => (
                  <StackSegment
                    key={genre}
                    title={`${genre}: ${count} Songs`}
                    style={{
                      width: `${stats.totals.songs > 0 ? (count / stats.totals.songs) * 100 : 0}%`,
                      background: segmentColors[index % segmentColors.length]
                    }}
                  />
                ))
              ) : (
                <EmptyText>No genres classified in this session</EmptyText>
              )}
            </StackedBar>
            <LegendGrid>
              {adapters.genreEntries.map(([genre, count], index) => (
                <LegendItem key={genre}>
                  <span style={{ background: segmentColors[index % segmentColors.length] }} />
                  <strong>{genre}</strong>
                  <em>{count}</em>
                </LegendItem>
              ))}
            </LegendGrid>
          </Distribution>

          <RatioList>
            <RatioRow>
              <BarChart2 size={15} />
              <span>Songs per Artist</span>
              <strong>{adapters.averageSongsPerArtist}</strong>
            </RatioRow>
            <RatioRow>
              <Layers size={15} />
              <span>Songs per Album</span>
              <strong>{adapters.averageSongsPerAlbum}</strong>
            </RatioRow>
            <RatioRow>
              <Activity size={15} />
              <span>Albums per Artist</span>
              <strong>{adapters.averageAlbumsPerArtist}</strong>
            </RatioRow>
          </RatioList>
        </StatsOverview>

        <StatsDetails id="datadoor-analytics-pane">
          <DominantCard>
            <span>Dominant Sector</span>
            <Activity size={16} />
            <h3>Main Catalog Genre</h3>
            <strong>
              {adapters.topGenre?.genre ?? "N/A"}{" "}
              <em>({adapters.topGenre?.songs ?? 0} Song{adapters.topGenre?.songs === 1 ? "" : "s"})</em>
            </strong>
            {adapters.topArtist ? (
              <TopArtist>
                <span>Most Represented Artist</span>
                <strong>
                  {adapters.topArtist.artist} <em>({adapters.topArtist.songs} indexed Songs)</em>
                </strong>
              </TopArtist>
            ) : null}
          </DominantCard>

          <DirectoryHeader>
            <h3>{activeSubTab === "artists" ? "Artist Inventory Directory" : "Album Volume Directory"}</h3>
            <TabSwitch>
              <button
                type="button"
                onClick={() => setActiveSubTab("artists")}
                data-active={activeSubTab === "artists"}
              >
                Artists ({stats.artists.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab("albums")}
                data-active={activeSubTab === "albums"}
              >
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
                        <MiniAvatar>{artist.artist.charAt(0)}</MiniAvatar>
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
                        <AlbumIcon>
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
        </StatsDetails>
      </StatsGrid>
    </StatsShell>
  );
};

const segmentColors = [
  "var(--app-chart-segment-1)",
  "var(--app-chart-segment-2)",
  "var(--app-chart-segment-3)",
  "var(--app-chart-segment-4)",
  "var(--app-chart-segment-5)",
  "var(--app-chart-segment-6)"
];

const BaseAction = styled.button`
  min-height: 36px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.full}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px 16px;
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: transform 150ms ease, background 150ms ease, color 150ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SecondaryAction = styled(BaseAction)`
  background: var(--app-inverse);
  color: var(--app-panel-subtle);
`;

const StatsShell = styled.section`
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.xl}px;
  background: var(--app-panel);
  padding: 28px;
  box-shadow: var(--app-shadow-soft);
`;

const StatsTopBar = styled.header`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;

  h2 {
    margin: 0;
    color: var(--app-analytics-accent);
    font-size: 0.78rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  p {
    margin: 5px 0 0;
    color: var(--app-text-secondary);
    font-size: 0.84rem;
    font-weight: 650;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: start;
  gap: 34px;

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr;
  }
`;

const StatsOverview = styled.section`
  display: grid;
  align-content: start;
  gap: 24px;
`;

const StatsDetails = styled.section`
  display: grid;
  gap: 24px;
  align-content: start;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
`;

const MetricCard = styled.div`
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: var(--app-panel-subtle);
  padding: 16px;

  span {
    color: var(--app-muted);
    font-size: 0.62rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  svg {
    float: right;
    color: var(--app-analytics-accent);
  }

  strong {
    display: block;
    color: var(--app-text);
    font-family: "JetBrains Mono", monospace;
    font-size: 1.55rem;
    font-weight: 950;
  }

  small {
    color: var(--app-muted);
    font-size: 0.62rem;
    font-weight: 750;
  }
`;

const Distribution = styled.div`
  display: grid;
  gap: 12px;
`;

const DistributionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--app-text-secondary);
  font-size: 0.66rem;
  font-weight: 900;
  text-transform: uppercase;
`;

const StackedBar = styled.div`
  min-height: 18px;
  overflow: hidden;
  display: flex;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background: var(--app-panel-subtle);
`;

const StackSegment = styled.div`
  min-width: 2px;
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
`;

const LegendItem = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--app-panel-subtle);
  padding-bottom: 6px;
  color: var(--app-text-secondary);
  font-size: 0.68rem;
  font-weight: 800;

  span {
    width: 10px;
    height: 10px;
    border-radius: ${({ theme }) => theme.radii.xs}px;
  }

  em {
    color: var(--app-muted);
    font-style: normal;
    font-family: "JetBrains Mono", monospace;
  }
`;

const RatioList = styled.div`
  display: grid;
  gap: 10px;
  border-top: 1px solid var(--app-border);
  padding-top: 18px;
`;

const RatioRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.md}px;
  background: var(--app-panel-subtle);
  padding: 10px;
  color: var(--app-text-secondary);
  font-size: 0.76rem;
  font-weight: 800;

  strong {
    border: 1px solid var(--app-border);
    border-radius: ${({ theme }) => theme.radii.sm}px;
    background: var(--app-panel);
    color: var(--app-text);
    padding: 3px 8px;
    font-family: "JetBrains Mono", monospace;
  }
`;

const DominantCard = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: var(--app-inverse);
  color: var(--app-inverse-text);
  padding: 20px;

  > span {
    color: var(--app-analytics-highlight);
    font-size: 0.62rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  > svg {
    position: absolute;
    top: 20px;
    right: 20px;
    color: var(--app-analytics-accent);
  }

  h3 {
    margin: 14px 0 3px;
    color: var(--app-muted);
    font-size: 0.72rem;
    text-transform: uppercase;
  }

  strong {
    display: block;
    font-size: 1rem;
  }

  em {
    color: var(--app-border-strong);
    font-size: 0.72rem;
    font-style: normal;
    font-weight: 600;
  }
`;

const TopArtist = styled.div`
  margin-top: 14px;
  border-top: 1px solid var(--app-border-strong);
  padding-top: 12px;
`;

const DirectoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--app-border);
  padding-bottom: 12px;

  h3 {
    margin: 0;
    color: var(--app-text);
    font-size: 0.9rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const TabSwitch = styled.div`
  display: flex;
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

const MiniAvatar = styled.span`
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

const AlbumIcon = styled.span`
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
  margin-right: 9px;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background: var(--app-album-icon-background);
  color: var(--app-album-icon-text);
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

const LoadingBlock = styled.div`
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: var(--app-text-secondary);
  font-size: 0.84rem;
  font-weight: 800;

  p {
    margin: 0;
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--app-border);
  border-top-color: var(--app-brand);
  border-radius: ${({ theme }) => theme.radii.full}px;
  animation: spin 800ms linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid var(--app-brand-border);
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: var(--app-brand-soft);
  color: var(--app-brand-hover);
  padding: 16px;

  p {
    margin: 3px 0 0;
    color: var(--app-brand);
    font-size: 0.78rem;
  }
`;
