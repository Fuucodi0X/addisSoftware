import styled from "@emotion/styled";
import { Heart, Pause, Play, RefreshCw, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { Song } from "../../../store/songsSlice";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

interface FocusedSongFooterProps {
  fallbackArtwork: string;
  isAdvancing: boolean;
  isMarked: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  onSelectAdjacentSong: (direction: 1 | -1) => void;
  onToggleAdvancing: () => void;
  onToggleMarked: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onVolumeChange: (volume: number) => void;
  progressPercent: number;
  selectionTime: number;
  song: Song | null;
  volume: number;
}

export const FocusedSongFooter = ({
  fallbackArtwork,
  isAdvancing,
  isMarked,
  isRepeat,
  isShuffle,
  onSelectAdjacentSong,
  onToggleAdvancing,
  onToggleMarked,
  onToggleRepeat,
  onToggleShuffle,
  onVolumeChange,
  progressPercent,
  selectionTime,
  song,
  volume
}: FocusedSongFooterProps) => (
  <FocusedFooter id="playback-footer-player">
    {song ? (
      <>
        <FocusedSongSummary>
          <Artwork
            src={song.artworkUrl ?? fallbackArtwork}
            alt={`${song.album} artwork`}
            referrerPolicy="no-referrer"
          />
          <div>
            <strong id="active-track-name">{song.title}</strong>
            <span id="active-track-artist">
              {song.artist} - {song.genre}
            </span>
          </div>
        </FocusedSongSummary>
        <SelectionControls>
          <SelectionButtons>
            <RoundIcon
              id="shuffle-btn"
              type="button"
              aria-label="Shuffle visible Songs"
              aria-pressed={isShuffle}
              title="Shuffle visible Songs"
              $active={isShuffle}
              onClick={onToggleShuffle}
            >
              <Shuffle size={16} />
            </RoundIcon>
            <RoundIcon id="prev-btn" type="button" title="Previous Song" onClick={() => onSelectAdjacentSong(-1)}>
              <SkipBack size={16} />
            </RoundIcon>
            <PrimaryRoundIcon
              id="play-pause-btn"
              type="button"
              aria-label={isAdvancing ? "Pause local progress" : "Start local progress"}
              aria-pressed={isAdvancing}
              title={isAdvancing ? "Pause local progress" : "Start local progress"}
              onClick={onToggleAdvancing}
            >
              {isAdvancing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </PrimaryRoundIcon>
            <RoundIcon id="next-btn" type="button" title="Next Song" onClick={() => onSelectAdjacentSong(1)}>
              <SkipForward size={16} />
            </RoundIcon>
            <RoundIcon
              id="repeat-btn"
              type="button"
              aria-label="Repeat selected Song"
              aria-pressed={isRepeat}
              title="Repeat selected Song"
              $active={isRepeat}
              onClick={onToggleRepeat}
            >
              <RefreshCw size={16} />
            </RoundIcon>
          </SelectionButtons>
          <Timeline>
            <span>{formatTime(selectionTime)}</span>
            <ProgressTrack>
              <ProgressFill $progress={progressPercent} />
            </ProgressTrack>
            <span>{song.duration}</span>
          </Timeline>
        </SelectionControls>
        <Utilities>
          <RoundIcon
            id="like-btn"
            type="button"
            aria-label="Mark selected Song"
            aria-pressed={isMarked}
            title="Mark selected Song"
            $active={isMarked}
            onClick={onToggleMarked}
          >
            <Heart size={17} fill={isMarked ? "currentColor" : "none"} />
          </RoundIcon>
          <VolumeControl>
            <Volume2 size={17} />
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
            />
          </VolumeControl>
        </Utilities>
      </>
    ) : (
      <EmptyFooter>Select any Song from your Library to focus it.</EmptyFooter>
    )}
  </FocusedFooter>
);

const Artwork = styled.img`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.md}px;
  background: var(--app-panel-subtle);
`;

const FocusedFooter = styled.footer`
  min-height: 86px;
  border-top: 1px solid var(--app-border);
  display: grid;
  grid-template-columns: minmax(200px, 0.9fr) minmax(260px, 1.4fr) minmax(160px, 0.8fr);
  align-items: center;
  gap: 18px;
  background: var(--app-panel);
  padding: 14px 24px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    z-index: 8;
    min-height: 152px;
    gap: 10px;
    padding: 12px 16px;
    box-shadow: var(--app-shadow-raised);
  }
`;

const FocusedSongSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  strong,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: var(--app-text);
    font-size: 0.84rem;
    font-weight: 950;
  }

  span {
    color: var(--app-muted);
    font-size: 0.68rem;
    font-weight: 800;
  }
`;

const SelectionControls = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
`;

const SelectionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    gap: 12px;
  }
`;

const RoundIcon = styled.button<{ $active?: boolean }>`
  border: 0;
  border-radius: ${({ theme }) => theme.radii.full}px;
  display: grid;
  place-items: center;
  background: transparent;
  color: ${({ $active }) => ($active ? "var(--app-brand)" : "var(--app-text-secondary)")};
  padding: 6px;

  &:hover {
    background: var(--app-panel-subtle);
    color: var(--app-text);
  }
`;

const PrimaryRoundIcon = styled(RoundIcon)`
  width: 42px;
  height: 42px;
  background: var(--app-inverse);
  color: var(--app-inverse-text);
  box-shadow: var(--app-shadow-raised);

  &:hover {
    background: var(--app-inverse);
    color: var(--app-inverse-text);
  }
`;

const Timeline = styled.div`
  width: 100%;
  max-width: 560px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--app-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.62rem;
  font-weight: 900;
`;

const ProgressTrack = styled.div`
  height: 6px;
  flex: 1;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.full}px;
  background: var(--app-panel-subtle);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: inherit;
  background: var(--app-brand);
`;

const Utilities = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    justify-content: space-between;
  }
`;

const VolumeControl = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--app-muted);

  input {
    width: 112px;
    accent-color: var(--app-brand);
  }
`;

const EmptyFooter = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: var(--app-muted);
  font-size: 0.78rem;
  font-weight: 750;
  font-style: italic;
`;
