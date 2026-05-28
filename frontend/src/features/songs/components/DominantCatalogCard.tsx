import styled from "@emotion/styled";
import { Activity } from "lucide-react";
import type { SongStatsAdapters } from "../statsAdapters";

interface DominantCatalogCardProps {
  adapters: SongStatsAdapters;
}

export const DominantCatalogCard = ({ adapters }: DominantCatalogCardProps) => (
  <DominantCard>
    <span>Dominant Sector</span>
    <Activity size={16} />
    <h3>Main Catalog Genre</h3>
    <strong>
      {adapters.topGenre?.genre ?? "N/A"}{" "}
      <em>
        ({adapters.topGenre?.songs ?? 0} Song{adapters.topGenre?.songs === 1 ? "" : "s"})
      </em>
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
);

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
