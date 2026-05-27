import styled from "@emotion/styled";
import {
  Activity,
  AlertCircle,
  Award,
  BarChart2,
  Disc,
  Filter,
  Heart,
  Layers,
  Moon,
  Music,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sun,
  Tag,
  Trash2,
  User,
  Volume2,
  X,
  Edit
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useColorScheme } from "./design/DesignSystemProvider";
import { DeleteSongModal } from "./features/songs/components/DeleteSongModal";
import { SongFormModal } from "./features/songs/components/SongFormModal";
import {
  clearSongMutationState,
  createSongRequested,
  deleteSongRequested,
  fetchSongsRequested,
  fetchStatsRequested,
  SONG_GENRES,
  updateSongRequested,
  type Song,
  type SongLibraryStats,
  type SongMutationPayload
} from "./store/songsSlice";
import type { AppDispatch, RootState } from "./store/store";
import { IconButton } from "./ui/Button";

const fallbackArtwork =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=240&auto=format&fit=crop&q=80";

const artworkPresets = [
  fallbackArtwork,
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=240&auto=format&fit=crop&q=80"
];

const emptySongForm = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  duration: "",
  artworkUrl: artworkPresets[0]
};

type SongFormValues = typeof emptySongForm;
type SongModalState = { mode: "create"; song?: undefined } | { mode: "edit"; song: Song };
type AppTab = "home" | "stats";

const songFieldLimits = {
  title: 120,
  artist: 120,
  album: 120,
  genre: 80,
  duration: 5,
  artworkUrl: 2048
};

const durationPattern = /^\d{1,2}:[0-5]\d$/;

const getSongFormValues = (song?: Song): SongFormValues => ({
  title: song?.title ?? "",
  artist: song?.artist ?? "",
  album: song?.album ?? "",
  genre: song?.genre ?? "",
  duration: song?.duration ?? "",
  artworkUrl: song?.artworkUrl ?? ""
});

const getSongPayload = (values: SongFormValues): { payload?: SongMutationPayload; errors?: string[] } => {
  const trimmed = {
    title: values.title.trim(),
    artist: values.artist.trim(),
    album: values.album.trim(),
    genre: values.genre.trim(),
    duration: values.duration.trim(),
    artworkUrl: values.artworkUrl.trim()
  };
  const errors: string[] = [];

  for (const field of ["title", "artist", "album", "genre", "duration"] as const) {
    if (!trimmed[field]) {
      errors.push(`${field} is required.`);
    } else if (trimmed[field].length > songFieldLimits[field]) {
      errors.push(`${field} must be ${songFieldLimits[field]} characters or fewer.`);
    }
  }

  const genre = SONG_GENRES.find((allowedGenre) => allowedGenre === trimmed.genre);

  if (trimmed.genre && !genre) {
    errors.push(`genre must be one of: ${SONG_GENRES.join(", ")}.`);
  }

  if (trimmed.duration && !durationPattern.test(trimmed.duration)) {
    errors.push("duration must use M:SS or MM:SS format.");
  }

  if (trimmed.artworkUrl.length > songFieldLimits.artworkUrl) {
    errors.push(`artworkUrl must be ${songFieldLimits.artworkUrl} characters or fewer.`);
  }

  if (!genre || errors.length > 0) {
    return { errors };
  }

  return {
    payload: {
      title: trimmed.title,
      artist: trimmed.artist,
      album: trimmed.album,
      genre,
      duration: trimmed.duration,
      artworkUrl: trimmed.artworkUrl || null
    }
  };
};

const parseDuration = (duration: string) => {
  const [minutes = "0", seconds = "0"] = duration.split(":");
  return Number.parseInt(minutes, 10) * 60 + Number.parseInt(seconds, 10);
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

const getStatsAdapters = (stats: SongLibraryStats) => {
  const genreEntries = stats.songsByGenre.map((item) => [item.genre, item.songs] as const);
  const albumEntries = stats.songsByAlbum.map((item) => [item.album, item.songs] as const);
  const topArtist = stats.artists[0] ?? null;
  const topGenre = stats.songsByGenre[0] ?? null;

  return {
    albumEntries,
    averageAlbumsPerArtist:
      stats.totals.artists > 0 ? (stats.totals.albums / stats.totals.artists).toFixed(1) : "0",
    averageSongsPerAlbum:
      stats.totals.albums > 0 ? (stats.totals.songs / stats.totals.albums).toFixed(1) : "0",
    averageSongsPerArtist:
      stats.totals.artists > 0 ? (stats.totals.songs / stats.totals.artists).toFixed(1) : "0",
    genreEntries,
    topArtist,
    topGenre
  };
};

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mode, preference, toggleMode } = useColorScheme();
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [songModal, setSongModal] = useState<SongModalState | null>(null);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [focusedSong, setFocusedSong] = useState<Song | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<SongFormValues>(emptySongForm);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [hasLoadedSongs, setHasLoadedSongs] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    error,
    genres,
    items,
    limit,
    mutationError,
    mutationStatus,
    page,
    query,
    stats,
    statsError,
    statsStatus,
    status,
    totalItems,
    totalPages
  } = useSelector((state: RootState) => state.songs);

  const isMutating = mutationStatus === "loading";
  const isFiltered = Boolean(query.q.trim() || query.genre.trim());
  const activeSong = useMemo(
    () => items.find((song) => song.id === selectedSongId) ?? focusedSong ?? items[0] ?? null,
    [focusedSong, items, selectedSongId]
  );
  const statsView = useMemo(() => getStatsAdapters(stats), [stats]);
  const formTitle = songModal?.mode === "edit" ? "Edit Song Metadata" : "Add Song to Catalog";
  const actionLabel = songModal?.mode === "edit" ? "Update Record" : "Save Song";
  const modalErrors = useMemo(
    () => (mutationError ? [...formErrors, mutationError] : formErrors),
    [formErrors, mutationError]
  );
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);
  const isInitialSongsLoading = status === "loading" && !hasLoadedSongs;

  useEffect(() => {
    dispatch(fetchSongsRequested());
    dispatch(fetchStatsRequested());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      setHasLoadedSongs(true);
    }
  }, [status]);

  useEffect(() => {
    setSearchText(query.q);
  }, [query.q]);

  useEffect(() => {
    if (searchText === query.q) {
      return;
    }

    const timeout = window.setTimeout(() => {
      dispatch(fetchSongsRequested({ q: searchText, page: 1 }));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [dispatch, query.q, searchText]);

  useEffect(() => {
    if (mutationStatus === "succeeded") {
      setSongModal(null);
      setSongToDelete(null);
      setFormValues(emptySongForm);
      setFormErrors([]);
      dispatch(clearSongMutationState());
    }
  }, [dispatch, mutationStatus]);

  useEffect(() => {
    setPlaybackTime(0);
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
    if (!activeSong || !isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      setPlaybackTime((current) => {
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
  }, [activeSong, isPlaying, isRepeat, items]);

  const selectSong = (song: Song) => {
    setFocusedSong(song);
    setSelectedSongId(song.id);
    setIsPlaying(true);
  };

  const selectAdjacentSong = (direction: 1 | -1) => {
    if (items.length === 0) {
      return;
    }

    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * items.length);
      setFocusedSong(items[nextIndex]);
      setSelectedSongId(items[nextIndex].id);
      setPlaybackTime(0);
      return;
    }

    const currentIndex = activeSong ? items.findIndex((song) => song.id === activeSong.id) : 0;
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    setFocusedSong(items[nextIndex]);
    setSelectedSongId(items[nextIndex].id);
    setPlaybackTime(0);
  };

  const goHome = () => {
    setActiveTab("home");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCreateModal = () => {
    dispatch(clearSongMutationState());
    setFormValues({ ...emptySongForm, artworkUrl: artworkPresets[Math.floor(Math.random() * artworkPresets.length)] });
    setFormErrors([]);
    setSongModal({ mode: "create" });
  };

  const openEditModal = (song: Song) => {
    dispatch(clearSongMutationState());
    setFormValues(getSongFormValues(song));
    setFormErrors([]);
    setSongModal({ mode: "edit", song });
  };

  const openDeleteModal = (song: Song) => {
    dispatch(clearSongMutationState());
    setSongToDelete(song);
  };

  const closeSongModal = () => {
    if (isMutating) {
      return;
    }

    dispatch(clearSongMutationState());
    setSongModal(null);
    setFormValues(emptySongForm);
    setFormErrors([]);
  };

  const closeDeleteModal = () => {
    if (isMutating) {
      return;
    }

    dispatch(clearSongMutationState());
    setSongToDelete(null);
  };

  const submitSong = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!songModal) {
      return;
    }

    const result = getSongPayload(formValues);

    if (result.errors || !result.payload) {
      setFormErrors(result.errors ?? ["Song payload is invalid."]);
      return;
    }

    setFormErrors([]);

    if (songModal.mode === "edit") {
      dispatch(updateSongRequested({ id: songModal.song.id, song: result.payload }));
      return;
    }

    dispatch(createSongRequested(result.payload));
  };

  const confirmDelete = () => {
    if (!songToDelete) {
      return;
    }

    if (songToDelete.id === selectedSongId) {
      setSelectedSongId(null);
      setFocusedSong(null);
      setIsPlaying(false);
    }

    dispatch(deleteSongRequested({ id: songToDelete.id }));
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleGenreChange = (genre: string) => {
    dispatch(fetchSongsRequested({ genre: genre === "All" ? "" : genre, page: 1 }));
  };

  const pageNumbers = Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index + 1);
  const emptyRows = Math.max(0, 5 - items.length);
  const durationSeconds = activeSong ? Math.max(1, parseDuration(activeSong.duration)) : 1;
  const progressWidth = Math.min(100, (playbackTime / durationSeconds) * 100);

  return (
    <>
      <Shell>
        <AppFrame id="lunio-app-shell">
          <Sidebar id="sidebar-panel" aria-label="Primary">
            <BrandButton id="sidebar-home-btn" type="button" aria-label="Show home page" onClick={goHome}>
              <span />
              <span />
              <span />
            </BrandButton>
            <SidebarSpacer aria-hidden="true" />
            <IconButton
              id="theme-toggle-btn"
              type="button"
              title={`Switch to ${mode === "dark" ? "light" : "dark"} theme`}
              aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} theme`}
              aria-pressed={preference !== "system"}
              shape="circle"
              size="md"
              variant="soft"
              onClick={toggleMode}
            >
              {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </IconButton>
          </Sidebar>

          <MainPanel id="main-content-panel">
            <ScrollPanel id="main-scroll-view" ref={scrollRef}>
              {isInitialSongsLoading ? (
                <LoadingBlock>
                  <Spinner />
                  <p>Retrieving Song Library records...</p>
                </LoadingBlock>
              ) : error ? (
                <ErrorBanner>
                  <AlertCircle size={20} />
                  <div>
                    <strong>Connection Error</strong>
                    <p>{error}</p>
                    <button type="button" onClick={() => dispatch(fetchSongsRequested())}>
                      Re-fetch catalog
                    </button>
                  </div>
                </ErrorBanner>
              ) : activeTab === "stats" ? (
                <StatsDashboard
                  adapters={statsView}
                  error={statsError}
                  stats={stats}
                  status={statsStatus}
                  onBack={goHome}
                />
              ) : (
                <HomeView>
                  <TopGrid>
                    <HeroCard>
                      <Kicker>
                        <span />
                        Curated Song Library
                      </Kicker>
                      <HeroCopy>
                        <h1>Song Library</h1>
                        <p>
                          Your premium interface for managing Song metadata, catalogue statistics, artwork, and
                          duration records.
                        </p>
                      </HeroCopy>
                      <HeroActions>
                        <PrimaryAction type="button" onClick={() => activeSong && selectSong(activeSong)}>
                          <Play size={14} fill="currentColor" /> Select Featured Song
                        </PrimaryAction>
                      </HeroActions>
                      <HeroImage
                        src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=520&auto=format&fit=crop&q=80"
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                    </HeroCard>

                    <ArtistPanel>
                      <PanelHeader>
                        <PanelTitle>
                          <Award size={16} />
                          In-Catalog Artists
                        </PanelTitle>
                        <TextButton id="switch-stats-btn" type="button" onClick={() => setActiveTab("stats")}>
                          See More Analytics &gt;
                        </TextButton>
                      </PanelHeader>
                      <ArtistList>
                        {stats.artists.length > 0 ? (
                          stats.artists.slice(0, 4).map((artist, index) => (
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
                  </TopGrid>

                  <CatalogCard>
                    <CatalogHeader>
                      <div>
                        <h2>Song Catalog</h2>
                        <span>
                          Telemetry: {startItem}-{endItem} of {totalItems} indexed Songs
                        </span>
                      </div>
                      <Controls>
                        <SearchShell>
                          <Search size={15} />
                          <input
                            id="catalog-search-input"
                            type="search"
                            aria-label="Search Songs"
                            value={searchText}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            placeholder="Search Songs..."
                          />
                          {searchText ? (
                            <ClearSearchButton
                              type="button"
                              aria-label="Clear search"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => handleSearchChange("")}
                            >
                              <X size={13} />
                            </ClearSearchButton>
                          ) : null}
                        </SearchShell>
                        <Divider />
                        <GenreControls>
                          <Filter size={15} />
                          <strong>Genres:</strong>
                          <GenreScroller>
                            {["All", ...genres].slice(0, 6).map((genre) => (
                              <GenreButton
                                id={`filter-genre-pill-${genre}`}
                                key={genre}
                                type="button"
                                $active={(genre === "All" && !query.genre) || query.genre === genre}
                                onClick={() => handleGenreChange(genre)}
                              >
                                {genre}
                              </GenreButton>
                            ))}
                          </GenreScroller>
                        </GenreControls>
                      </Controls>
                    </CatalogHeader>

                    <TableShell>
                      <SongTable aria-label="Song Catalog">
                        <thead>
                          <tr>
                            <th># Title</th>
                            <th>Artist Name</th>
                            <th>Genre Category</th>
                            <th>Duration</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.length === 0 ? (
                            <tr>
                              <td colSpan={5}>
                                <EmptyTableText>
                                  {isFiltered
                                    ? "No Songs match your query in this scope."
                                    : "No Songs have been added yet."}
                                </EmptyTableText>
                              </td>
                            </tr>
                          ) : (
                            items.map((song, index) => {
                              const isSelected = activeSong?.id === song.id;

                              return (
                                <SongRow key={song.id} $selected={isSelected} onClick={() => selectSong(song)}>
                                  <td>
                                    <TitleCell>
                                      <IndexCell>
                                        {isSelected && isPlaying ? (
                                          <Equalizer aria-label="Selected Song">
                                            <span />
                                            <span />
                                            <span />
                                          </Equalizer>
                                        ) : (
                                          (page - 1) * limit + index + 1
                                        )}
                                      </IndexCell>
                                      <Artwork
                                        src={song.artworkUrl ?? fallbackArtwork}
                                        alt={`${song.album} artwork`}
                                        referrerPolicy="no-referrer"
                                      />
                                      <TitleText>
                                        <strong>{song.title}</strong>
                                        <span>{song.album}</span>
                                        <MobileMetadata>
                                          {song.album}
                                          <MetadataDot aria-hidden="true">•</MetadataDot>
                                          {song.genre}
                                          <MetadataDot aria-hidden="true">•</MetadataDot>
                                          {song.duration}
                                        </MobileMetadata>
                                      </TitleText>
                                    </TitleCell>
                                  </td>
                                  <td>{song.artist}</td>
                                  <td>
                                    <GenreLabel>{song.genre}</GenreLabel>
                                  </td>
                                  <td>
                                    <DurationText>{song.duration}</DurationText>
                                  </td>
                                  <td onClick={(event) => event.stopPropagation()}>
                                    <RowActions>
                                      <IconTextButton
                                        id={`edit-song-btn-${song.id}`}
                                        type="button"
                                        title="Edit Song"
                                        onClick={() => openEditModal(song)}
                                      >
                                        <Edit size={15} />
                                        <span>Edit</span>
                                      </IconTextButton>
                                      <IconTextButton
                                        id={`del-song-btn-${song.id}`}
                                        type="button"
                                        title="Delete Song"
                                        $danger
                                        onClick={() => openDeleteModal(song)}
                                      >
                                        <Trash2 size={15} />
                                        <span>Del</span>
                                      </IconTextButton>
                                    </RowActions>
                                  </td>
                                </SongRow>
                              );
                            })
                          )}
                          {Array.from({ length: emptyRows }).map((_, index) => (
                            <EmptyRow key={index}>
                              <td colSpan={5} />
                            </EmptyRow>
                          ))}
                        </tbody>
                      </SongTable>
                    </TableShell>

                    <Pagination>
                      <span>
                        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
                        <strong>{totalItems}</strong> Songs
                      </span>
                      <PageControls>
                        <PageButton
                          type="button"
                          disabled={page <= 1 || status === "loading"}
                          onClick={() => dispatch(fetchSongsRequested({ page: page - 1 }))}
                        >
                          Prev
                        </PageButton>
                        {pageNumbers.map((pageNumber) => (
                          <PageNumber
                            key={pageNumber}
                            type="button"
                            $active={pageNumber === page}
                            onClick={() => dispatch(fetchSongsRequested({ page: pageNumber }))}
                          >
                            {pageNumber}
                          </PageNumber>
                        ))}
                        <PageButton
                          type="button"
                          disabled={page >= totalPages || status === "loading"}
                          onClick={() => dispatch(fetchSongsRequested({ page: page + 1 }))}
                        >
                          Next
                        </PageButton>
                      </PageControls>
                    </Pagination>
                  </CatalogCard>
                </HomeView>
              )}
            </ScrollPanel>

            <PlayerFooter id="playback-footer-player">
              {activeSong ? (
                <>
                  <NowPlaying>
                    <Artwork
                      src={activeSong.artworkUrl ?? fallbackArtwork}
                      alt={`${activeSong.album} artwork`}
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <strong id="active-track-name">{activeSong.title}</strong>
                      <span id="active-track-artist">
                        {activeSong.artist} - {activeSong.genre}
                      </span>
                    </div>
                  </NowPlaying>
                  <Transport>
                    <TransportButtons>
                      <RoundIcon
                        id="shuffle-btn"
                        type="button"
                        title="Shuffle visible Songs"
                        $active={isShuffle}
                        onClick={() => setIsShuffle((current) => !current)}
                      >
                        <Shuffle size={16} />
                      </RoundIcon>
                      <RoundIcon id="prev-btn" type="button" title="Previous Song" onClick={() => selectAdjacentSong(-1)}>
                        <SkipBack size={16} />
                      </RoundIcon>
                      <PlayButton
                        id="play-pause-btn"
                        type="button"
                        title={isPlaying ? "Pause local progress" : "Start local progress"}
                        onClick={() => setIsPlaying((current) => !current)}
                      >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                      </PlayButton>
                      <RoundIcon id="next-btn" type="button" title="Next Song" onClick={() => selectAdjacentSong(1)}>
                        <SkipForward size={16} />
                      </RoundIcon>
                      <RoundIcon
                        id="repeat-btn"
                        type="button"
                        title="Repeat selected Song"
                        $active={isRepeat}
                        onClick={() => setIsRepeat((current) => !current)}
                      >
                        <RefreshCw size={16} />
                      </RoundIcon>
                    </TransportButtons>
                    <Timeline>
                      <span>{formatTime(playbackTime)}</span>
                      <ProgressTrack>
                        <ProgressFill style={{ width: `${progressWidth}%` }} />
                      </ProgressTrack>
                      <span>{activeSong.duration}</span>
                    </Timeline>
                  </Transport>
                  <Utilities>
                    <RoundIcon
                      id="like-btn"
                      type="button"
                      title="Mark selected Song"
                      $active={isLiked}
                      onClick={() => setIsLiked((current) => !current)}
                    >
                      <Heart size={17} fill={isLiked ? "currentColor" : "none"} />
                    </RoundIcon>
                    <VolumeControl>
                      <Volume2 size={17} />
                      <input
                        id="volume-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(event) => setVolume(Number(event.target.value))}
                      />
                    </VolumeControl>
                  </Utilities>
                </>
              ) : (
                <EmptyFooter>Select any Song from your Library to focus it.</EmptyFooter>
              )}
            </PlayerFooter>

            <FloatingAdd id="sidebar-create-btn" type="button" title="Add Song" onClick={openCreateModal}>
              <Plus size={21} />
            </FloatingAdd>
          </MainPanel>
        </AppFrame>
      </Shell>

      {songModal ? (
        <SongFormModal
          actionLabel={actionLabel}
          artworkPresets={artworkPresets}
          errors={modalErrors}
          fallbackArtwork={fallbackArtwork}
          isMutating={isMutating}
          onChange={(field, value) => setFormValues((current) => ({ ...current, [field]: value }))}
          onClose={closeSongModal}
          onSubmit={submitSong}
          title={formTitle}
          values={formValues}
        />
      ) : null}

      {songToDelete ? (
        <DeleteSongModal
          error={mutationError}
          fallbackArtwork={fallbackArtwork}
          isMutating={isMutating}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          song={songToDelete}
        />
      ) : null}
    </>
  );
};

interface StatsDashboardProps {
  adapters: ReturnType<typeof getStatsAdapters>;
  error: string | null;
  onBack: () => void;
  stats: SongLibraryStats;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const StatsDashboard = ({ adapters, error, onBack, stats, status }: StatsDashboardProps) => {
  const [activeSubTab, setActiveSubTab] = useState<"artists" | "albums">("artists");

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

const Shell = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--app-panel-subtle);

  @media (max-width: 640px) {
    padding: 0;
  }
`;

const AppFrame = styled.div`
  width: min(1280px, 100%);
  height: calc(100vh - 48px);
  min-height: 760px;
  display: flex;
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: 32px;
  background: var(--app-panel);
  box-shadow: var(--app-shadow-panel);

  @media (max-width: 760px) {
    height: 100vh;
    min-height: 100vh;
    border-radius: 0;
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 14px;
  border-right: 1px solid var(--app-border-subtle);
  background: var(--app-panel);
  flex-shrink: 0;

  @media (max-width: 760px) {
    width: 100%;
    height: 64px;
    flex-direction: row;
    border-right: 0;
    border-bottom: 1px solid var(--app-border-subtle);
    padding: 12px;
  }
`;

const BrandButton = styled.button`
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--app-brand);
  box-shadow: var(--app-shadow-brand-control);

  span {
    height: 2px;
    width: 16px;
    border-radius: 999px;
    background: var(--app-on-brand);
  }

  span:nth-of-type(2) {
    width: 19px;
  }
`;

const SidebarSpacer = styled.div`
  width: 40px;
  height: 40px;
`;

const MainPanel = styled.section`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--app-surface);
  overflow: hidden;
`;

const ScrollPanel = styled.div`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px;

  @media (max-width: 760px) {
    padding: 16px;
  }
`;

const HomeView = styled.div`
  display: grid;
  gap: 24px;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(320px, 5fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const HeroCard = styled.section`
  min-height: 240px;
  min-width: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 28px;
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

  @media (max-width: 560px) {
    min-height: 240px;
    border-radius: 24px;
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
  border-radius: 999px;
  background: var(--app-hero-kicker);
  font-size: 10px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  span {
    width: 7px;
    height: 7px;
    border-radius: 999px;
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

  @media (max-width: 560px) {
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
  border-radius: 999px;
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

const SecondaryAction = styled(BaseAction)`
  background: var(--app-inverse);
  color: var(--app-panel-subtle);
`;

const ArtistPanel = styled.section`
  min-width: 0;
  min-height: 240px;
  border: 1px solid var(--app-border);
  border-radius: 28px;
  background: var(--app-panel);
  padding: 22px;
  box-shadow: var(--app-shadow-soft);

  @media (max-width: 560px) {
    border-radius: 24px;
    padding: 20px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 560px) {
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
  border-radius: 14px;

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

  @media (max-width: 400px) {
    grid-template-columns: auto minmax(0, 1fr);

    > span:last-of-type {
      grid-column: 2;
      justify-self: start;
    }
  }
`;

const Avatar = styled.div<{ $tone: number }>`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 999px;
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
  border-radius: 999px;
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

const CatalogCard = styled.section`
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: 28px;
  background: var(--app-panel);
  box-shadow: var(--app-shadow-soft);

  @media (max-width: 560px) {
    border-radius: 24px;
  }
`;

const CatalogHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px;
  border-bottom: 1px solid var(--app-border-subtle);

  h2 {
    margin: 0;
    color: var(--app-inverse);
    font-size: 0.88rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  span {
    color: var(--app-muted);
    font-size: 0.66rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  @media (max-width: 980px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;

  @media (max-width: 760px) {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }
`;

const SearchShell = styled.label`
  height: 34px;
  width: 210px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  background: var(--app-panel-subtle);
  padding: 0 12px;
  color: var(--app-muted);

  input {
    min-width: 0;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--app-text);
    font-size: 0.72rem;
    font-weight: 750;
  }

  input::-webkit-search-cancel-button {
    display: none;
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`;

const ClearSearchButton = styled.button`
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: var(--app-border);
  color: var(--app-text-secondary);
  padding: 0;

  &:hover {
    background: var(--app-border-strong);
    color: var(--app-text);
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 18px;
  background: var(--app-border);

  @media (max-width: 760px) {
    display: none;
  }
`;

const GenreControls = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--app-muted);

  strong {
    color: var(--app-muted);
    font-size: 0.64rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

const GenreScroller = styled.div`
  min-width: 0;
  max-width: 100%;
  display: flex;
  gap: 6px;
  overflow-x: auto;
`;

const GenreButton = styled.button<{ $active?: boolean }>`
  border: 0;
  border-radius: 999px;
  padding: 5px 11px;
  background: ${({ $active }) => ($active ? "var(--app-brand)" : "var(--app-panel-subtle)")};
  color: ${({ $active }) => ($active ? "var(--app-on-brand)" : "var(--app-text-secondary)")};
  font-size: 0.62rem;
  font-weight: 950;
  text-transform: uppercase;
  white-space: nowrap;
`;

const TableShell = styled.div`
  overflow-x: auto;
`;

const SongTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: var(--app-text-secondary);
  font-size: 0.78rem;

  th {
    padding: 13px 20px;
    background: var(--app-panel-subtle);
    border-bottom: 1px solid var(--app-border);
    color: var(--app-muted);
    font-size: 0.58rem;
    font-weight: 950;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.11em;
  }

  td {
    padding: 12px 20px;
    border-bottom: 1px solid var(--app-panel-subtle);
  }

  th:last-of-type,
  td:last-of-type {
    text-align: right;
  }

  @media (max-width: 1180px) {
    min-width: 0;

    th:nth-of-type(3),
    td:nth-of-type(3),
    th:nth-of-type(4),
    td:nth-of-type(4) {
      display: none;
    }

    th,
    td {
      padding: 12px;
    }
  }
  @media (max-width: 760px) {
    th:nth-of-type(2),
    td:nth-of-type(2) {
      display: none;
    }
  }
`;

const SongRow = styled.tr<{ $selected?: boolean }>`
  background: ${({ $selected }) => ($selected ? "var(--app-selected-row)" : "var(--app-panel)")};
  transition: background 150ms ease;

  &:hover {
    background: ${({ $selected }) => ($selected ? "var(--app-selected-row-hover)" : "var(--app-panel-subtle)")};
  }
`;

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;

  @media (max-width: 1180px) {
    min-width: 0;
  }
`;

const IndexCell = styled.span`
  width: 22px;
  display: inline-flex;
  justify-content: center;
  color: var(--app-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 800;
`;

const Equalizer = styled.span`
  height: 14px;
  display: inline-flex;
  align-items: end;
  gap: 2px;

  span {
    width: 2px;
    border-radius: 999px;
    background: var(--app-brand);
    animation: pulse-bar 780ms infinite ease-in-out alternate;
  }

  span:nth-of-type(1) {
    height: 8px;
  }

  span:nth-of-type(2) {
    height: 13px;
    animation-delay: 120ms;
  }

  span:nth-of-type(3) {
    height: 6px;
    animation-delay: 240ms;
  }

  @keyframes pulse-bar {
    from {
      transform: scaleY(0.55);
    }
    to {
      transform: scaleY(1);
    }
  }
`;

const Artwork = styled.img`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  background: var(--app-panel-subtle);
`;

const TitleText = styled.div`
  min-width: 0;

  strong {
    display: block;
    max-width: min(230px, 42vw);
    overflow: hidden;
    color: var(--app-text);
    font-size: 0.84rem;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > span {
    display: block;
    max-width: min(230px, 42vw);
    overflow: hidden;
    color: var(--app-muted);
    font-size: 0.68rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 1180px) {
    > span {
      display: none;
    }
  }
`;

const GenreLabel = styled.span`
  display: inline-flex;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  background: var(--app-panel-subtle);
  padding: 5px 9px;
  color: var(--app-text-secondary);
  font-size: 0.62rem;
  font-weight: 950;
  text-transform: uppercase;
`;

const DurationText = styled.span`
  color: var(--app-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 900;
`;

const MobileMetadata = styled.small`
  display: none;
  align-items: center;
  gap: 5px;
  max-width: min(230px, 42vw);
  overflow: hidden;
  color: var(--app-muted);
  font-size: 0.68rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1180px) {
    display: flex;
  }
`;

const MetadataDot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-muted);
  font-size: 0.8em;
  font-weight: 950;
  line-height: 1;
`;

const RowActions = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  gap: 8px;

  @media (max-width: 760px) {
    gap: 2px;
  }
`;

const IconTextButton = styled.button<{ $danger?: boolean }>`
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  color: ${({ $danger }) => ($danger ? "var(--app-text-secondary)" : "var(--app-text-secondary)")};
  padding: 7px 8px;
  font-size: 0.68rem;
  font-weight: 850;

  &:hover {
    background: ${({ $danger }) => ($danger ? "var(--app-brand-soft)" : "var(--app-panel-subtle)")};
    color: ${({ $danger }) => ($danger ? "var(--app-brand)" : "var(--app-text)")};
  }

  @media (max-width: 760px) {
    width: 32px;
    height: 32px;
    justify-content: center;
    padding: 0;

    span {
      display: none;
    }
  }
`;

const EmptyTableText = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--app-muted);
  font-weight: 700;
`;

const EmptyRow = styled.tr`
  height: 42px;
`;

const Pagination = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 20px;
  border-top: 1px solid var(--app-border);
  background: var(--app-panel-subtle);
  color: var(--app-muted);
  font-size: 0.72rem;
  font-weight: 750;

  @media (max-width: 760px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const PageControls = styled.div`
  display: flex;
  gap: 6px;
`;

const PageButton = styled.button`
  border: 1px solid var(--app-border);
  border-radius: 10px;
  background: var(--app-panel);
  color: var(--app-text-secondary);
  padding: 6px 10px;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;

  &:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }
`;

const PageNumber = styled(PageButton)<{ $active?: boolean }>`
  min-width: 28px;
  padding: 6px;
  background: ${({ $active }) => ($active ? "var(--app-brand)" : "var(--app-panel)")};
  border-color: ${({ $active }) => ($active ? "var(--app-brand)" : "var(--app-border)")};
  color: ${({ $active }) => ($active ? "var(--app-on-brand)" : "var(--app-text-secondary)")};
`;

const PlayerFooter = styled.footer`
  min-height: 86px;
  border-top: 1px solid var(--app-border);
  display: grid;
  grid-template-columns: minmax(200px, 0.9fr) minmax(260px, 1.4fr) minmax(160px, 0.8fr);
  align-items: center;
  gap: 18px;
  background: var(--app-panel);
  padding: 14px 24px;
  flex-shrink: 0;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  @media (max-width: 760px) {
    z-index: 8;
    min-height: 152px;
    gap: 10px;
    padding: 12px 16px;
    box-shadow: var(--app-shadow-raised);
  }
`;

const NowPlaying = styled.div`
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

const Transport = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
`;

const TransportButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 760px) {
    gap: 12px;
  }
`;

const RoundIcon = styled.button<{ $active?: boolean }>`
  border: 0;
  border-radius: 999px;
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

const PlayButton = styled(RoundIcon)`
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
  border-radius: 999px;
  background: var(--app-panel-subtle);
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: inherit;
  background: var(--app-brand);
`;

const Utilities = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;

  @media (max-width: 760px) {
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

const FloatingAdd = styled.button`
  position: absolute;
  right: 32px;
  bottom: 108px;
  z-index: 10;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 1px solid var(--app-brand-border);
  border-radius: 999px;
  background: var(--app-brand);
  color: var(--app-on-brand);
  box-shadow: var(--app-shadow-floating-action);

  &:hover {
    background: var(--app-brand-hover);
  }

  @media (max-width: 760px) {
    right: 16px;
    bottom: 168px;
    width: 48px;
    height: 48px;
  }
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
  border-radius: 999px;
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
  border-radius: 18px;
  background: var(--app-brand-soft);
  color: var(--app-brand-hover);
  padding: 16px;

  p {
    margin: 3px 0 0;
    color: var(--app-brand);
    font-size: 0.78rem;
  }

  button {
    border: 0;
    background: transparent;
    color: var(--app-brand-text);
    padding: 8px 0 0;
    font-size: 0.72rem;
    font-weight: 850;
    text-decoration: underline;
  }
`;

const StatsShell = styled.section`
  border: 1px solid var(--app-border);
  border-radius: 28px;
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

  @media (max-width: 980px) {
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
  border-radius: 18px;
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
  border-radius: 10px;
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
    border-radius: 3px;
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
  border-radius: 14px;
  background: var(--app-panel-subtle);
  padding: 10px;
  color: var(--app-text-secondary);
  font-size: 0.76rem;
  font-weight: 800;

  strong {
    border: 1px solid var(--app-border);
    border-radius: 8px;
    background: var(--app-panel);
    color: var(--app-text);
    padding: 3px 8px;
    font-family: "JetBrains Mono", monospace;
  }
`;

const DominantCard = styled.div`
  position: relative;
  border-radius: 20px;
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
  border-radius: 12px;
  background: var(--app-panel-subtle);
  padding: 3px;

  button {
    border: 0;
    border-radius: 9px;
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
  border-radius: 18px;
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
  border-radius: 999px;
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
  border-radius: 9px;
  background: var(--app-album-icon-background);
  color: var(--app-album-icon-text);
`;
