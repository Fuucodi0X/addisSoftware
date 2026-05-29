import styled from "@emotion/styled";
import { Play } from "lucide-react";
import { Box, Heading, Inline, Stack, Text } from "../../../design/primitives";
import type { Song } from "../../../store/songsSlice";
import { CachedArtworkImage } from "./CachedArtworkImage";

interface SongHeroPanelProps {
  activeSong: Song | null;
  onSelectFeaturedSong: (song: Song) => void;
}

export const SongHeroPanel = ({ activeSong, onSelectFeaturedSong }: SongHeroPanelProps) => (
  <HeroCard
    as="section"
    justifyContent="space-between"
    borderRadius="xl"
    boxShadow="var(--app-shadow-raised)"
    minHeight="240px"
    minWidth={0}
    overflow="hidden"
    p={9}
    position="relative"
  >
    <Kicker gap={4}>
      <span />
      Curated Song Library
    </Kicker>
    <HeroCopy>
      <HeroTitle as="h1" variant="page">
        Song Library
      </HeroTitle>
      <HeroDescription variant="supporting">
        Your premium interface for managing Song metadata, catalogue statistics, artwork, and duration records.
      </HeroDescription>
    </HeroCopy>
    <HeroActions>
      <PrimaryAction type="button" onClick={() => activeSong && onSelectFeaturedSong(activeSong)}>
        <Play size={14} fill="currentColor" /> Select Featured Song
      </PrimaryAction>
    </HeroActions>
    <HeroImage
      src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=520&auto=format&fit=crop&q=80"
      alt=""
      referrerPolicy="no-referrer"
    />
  </HeroCard>
);

const HeroCard = styled(Stack)`
  color: var(--app-on-brand);
  background: var(--app-hero-background);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--app-hero-overlay);
    z-index: 1;
  }

  > *:not(img) {
    position: relative;
    z-index: 2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    &::after {
      background: var(--app-hero-overlay-compact);
    }
  }
`;

const Kicker = styled(Inline)`
  width: fit-content;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full}px;
  background: var(--app-hero-kicker);
  font-size: 10px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  span {
    width: 7px;
    height: 7px;
    border-radius: ${({ theme }) => theme.radii.full}px;
    background: var(--app-success);
  }
`;

const HeroCopy = styled(Box)`
  max-width: 360px;
`;

const HeroTitle = styled(Heading)`
  margin-bottom: ${({ theme }) => theme.space[4]}px;
  color: var(--app-on-brand);
  font-size: clamp(1.85rem, 3vw, 2.55rem);
  line-height: 1;
`;

const HeroDescription = styled(Text)`
  color: var(--app-hero-copy);
  font-size: 0.78rem;
  line-height: 1.7;
  font-weight: 750;
`;

const HeroImage = styled(CachedArtworkImage)`
  position: absolute;
  inset: 0 0 0 auto;
  width: 46%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) brightness(0.88);
  opacity: var(--app-hero-image-opacity);

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    width: 100%;
    opacity: 0.42;
  }
`;

const HeroActions = styled(Inline)``;

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

const PrimaryAction = styled(BaseAction)`
  background: var(--app-on-brand);
  color: var(--app-on-brand-text);
`;
