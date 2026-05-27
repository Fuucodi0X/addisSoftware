import { useEffect, useMemo, useState } from "react";
import type { Song } from "../../store/songsSlice";

const parseDuration = (duration: string) => {
  const [minutes = "0", seconds = "0"] = duration.split(":");
  return Number.parseInt(minutes, 10) * 60 + Number.parseInt(seconds, 10);
};

interface FocusedSongSelectionOptions {
  items: Song[];
}

export const useFocusedSongSelection = ({ items }: FocusedSongSelectionOptions) => {
  const [focusedSong, setFocusedSong] = useState<Song | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectionTime, setSelectionTime] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const activeSong = useMemo(
    () => items.find((song) => song.id === selectedSongId) ?? focusedSong ?? items[0] ?? null,
    [focusedSong, items, selectedSongId]
  );

  const durationSeconds = activeSong ? Math.max(1, parseDuration(activeSong.duration)) : 1;
  const progressPercent = Math.min(100, (selectionTime / durationSeconds) * 100);

  useEffect(() => {
    setSelectionTime(0);
  }, [activeSong?.id]);

  useEffect(() => {
    if (!selectedSongId) {
      return;
    }

    const selectedSong = items.find((song) => song.id === selectedSongId);

    if (selectedSong) {
      setFocusedSong(selectedSong);
    }
  }, [items, selectedSongId]);

  useEffect(() => {
    if (!activeSong || !isAdvancing) {
      return;
    }

    const interval = window.setInterval(() => {
      setSelectionTime((current) => {
        const maxSeconds = Math.max(1, parseDuration(activeSong.duration));

        if (current >= maxSeconds) {
          if (isRepeat) {
            return 0;
          }

          const currentIndex = items.findIndex((song) => song.id === activeSong.id);
          const nextSong = items[currentIndex + 1] ?? items[0];

          if (nextSong) {
            setFocusedSong(nextSong);
            setSelectedSongId(nextSong.id);
          }

          return 0;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeSong, isAdvancing, isRepeat, items]);

  const focusSong = (song: Song) => {
    setFocusedSong(song);
    setSelectedSongId(song.id);
    setIsAdvancing(true);
  };

  const selectAdjacentSong = (direction: 1 | -1) => {
    if (items.length === 0) {
      return;
    }

    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * items.length);
      setFocusedSong(items[nextIndex]);
      setSelectedSongId(items[nextIndex].id);
      setSelectionTime(0);
      return;
    }

    const currentIndex = activeSong ? items.findIndex((song) => song.id === activeSong.id) : 0;
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    setFocusedSong(items[nextIndex]);
    setSelectedSongId(items[nextIndex].id);
    setSelectionTime(0);
  };

  const clearFocusedSong = (songId: string) => {
    if (songId !== selectedSongId) {
      return;
    }

    setSelectedSongId(null);
    setFocusedSong(null);
    setIsAdvancing(false);
  };

  return {
    activeSong,
    activeSongId: activeSong?.id ?? null,
    clearFocusedSong,
    focusSong,
    isAdvancing,
    isMarked,
    isRepeat,
    isShuffle,
    progressPercent,
    selectAdjacentSong,
    selectionTime,
    setIsAdvancing,
    setIsMarked,
    setIsRepeat,
    setIsShuffle,
    setVolume,
    volume
  };
};
