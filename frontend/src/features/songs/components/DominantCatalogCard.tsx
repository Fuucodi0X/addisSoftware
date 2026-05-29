import styled from "@emotion/styled";
import { Activity } from "lucide-react";
import { Box, Heading, Text } from "../../../design/primitives";
import type { SongStatsAdapters } from "../statsAdapters";

interface DominantCatalogCardProps {
  adapters: SongStatsAdapters;
}

export const DominantCatalogCard = ({ adapters }: DominantCatalogCardProps) => (
  <DominantCard>
    <DominantLabel as="span" variant="label">
      Dominant Sector
    </DominantLabel>
    <Activity size={16} />
    <DominantHeading as="h3" variant="card" tone="muted">
      Main Catalog Genre
    </DominantHeading>
    <strong>
      {adapters.topGenre?.genre ?? "N/A"}{" "}
      <em>
        ({adapters.topGenre?.songs ?? 0} Song{adapters.topGenre?.songs === 1 ? "" : "s"})
      </em>
    </strong>
    {adapters.topArtist ? (
      <TopArtist>
        <DominantLabel as="span" variant="label">
          Most Represented Artist
        </DominantLabel>
        <strong>
          {adapters.topArtist.artist} <em>({adapters.topArtist.songs} indexed Songs)</em>
        </strong>
      </TopArtist>
    ) : null}
  </DominantCard>
);

const DominantCard = styled(Box)`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: var(--app-inverse);
  color: var(--app-inverse-text);
  padding: 20px;

  > svg {
    position: absolute;
    top: 20px;
    right: 20px;
    color: var(--app-analytics-accent);
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

const DominantLabel = styled(Text)`
  color: var(--app-analytics-highlight);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
`;

const DominantHeading = styled(Heading)`
  margin: 14px 0 3px;
  font-size: 0.72rem;
  text-transform: uppercase;
`;

const TopArtist = styled(Box)`
  margin-top: 14px;
  border-top: 1px solid var(--app-border-strong);
  padding-top: 12px;
`;
