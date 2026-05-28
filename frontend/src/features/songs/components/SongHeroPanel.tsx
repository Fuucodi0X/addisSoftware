import styled from "@emotion/styled";
import { Play } from "lucide-react";
import type { Song } from "../../../store/songsSlice";

interface SongHeroPanelProps {
  activeSong: Song | null;
  onSelectFeaturedSong: (song: Song) => void;
}

export const SongHeroPanel = ({ activeSong, onSelectFeaturedSong }: SongHeroPanelProps) => (
  <HeroCard>
    <Kicker>
      <span />
      Curated Song Library
    </Kicker>
    <HeroCopy>
      <h1>Song Library</h1>
      <p>Your premium interface for managing Song metadata, catalogue statistics, artwork, and duration records.</p>
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

const HeroCard = styled.section`
  min-height: 240px;
  min-width: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radii.xl}px;
  padding: 28px;
  color: var(--app-on-brand);
  background: var(--app-hero-background);
  box-shadow: var(--app-shadow-raised);

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
    min-height: 240px;
    border-radius: ${({ theme }) => theme.radii.xl}px;
    padding: 28px;

    &::after {
      background: var(--app-hero-overlay-compact);
    }
  }
`;

const Kicker = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

const HeroCopy = styled.div`
  max-width: 360px;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(1.85rem, 3vw, 2.55rem);
    line-height: 1;
    font-weight: 950;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: var(--app-hero-copy);
    font-size: 0.78rem;
    line-height: 1.7;
    font-weight: 750;
  }
`;

const HeroImage = styled.img`
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

const HeroActions = styled.div`
  display: flex;
  gap: 12px;
`;

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
