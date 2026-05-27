import styled from "@emotion/styled";
import { AlertCircle, Award, Moon, Play, Plus, Sun } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useColorScheme } from "../../design/DesignSystemProvider";
import { DeleteSongModal } from "./components/DeleteSongModal";
import { FocusedSongFooter } from "./components/FocusedSongFooter";
import { SongCatalogView } from "./components/SongCatalogView";
import { SongFormModal } from "./components/SongFormModal";
import { StatsDashboard } from "./components/StatsDashboard";
import {
  clearSongMutationState,
  createSongRequested,
  deleteSongRequested,
  fetchSongsRequested,
  fetchStatsRequested,
  updateSongRequested,
  type Song
} from "../../store/songsSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { IconButton } from "../../ui/Button";
import {
  artworkPresets,
  emptySongForm,
  fallbackArtwork,
  getClearedSongFormState,
  getCreateSongFormValues,
  getSongFormValues,
  getSongModalActionLabel,
  getSongModalTitle,
  getSongPayload,
  type SongFormValues,
  type SongModalState
} from "./songMutationForm";
import { useFocusedSongSelection } from "./useFocusedSongSelection";

type AppTab = "home" | "stats";

export const SongLibraryWorkspace = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mode, preference, toggleMode } = useColorScheme();
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [songModal, setSongModal] = useState<SongModalState | null>(null);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [formValues, setFormValues] = useState<SongFormValues>(emptySongForm);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [hasLoadedSongs, setHasLoadedSongs] = useState(false);
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
  const focusedSelection = useFocusedSongSelection({ items });
  const activeSong = focusedSelection.activeSong;
  const formTitle = getSongModalTitle(songModal);
  const actionLabel = getSongModalActionLabel(songModal);
  const modalErrors = useMemo(
    () => (mutationError ? [...formErrors, mutationError] : formErrors),
    [formErrors, mutationError]
  );
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
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
      const formState = getClearedSongFormState();

      setSongModal(null);
      setSongToDelete(null);
      setFormValues(formState.values);
      setFormErrors(formState.errors);
      dispatch(clearSongMutationState());
    }
  }, [dispatch, mutationStatus]);

  const goHome = () => {
    setActiveTab("home");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCreateModal = () => {
    dispatch(clearSongMutationState());
    setFormValues(getCreateSongFormValues(Math.floor(Math.random() * artworkPresets.length)));
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

    const formState = getClearedSongFormState();

    dispatch(clearSongMutationState());
    setSongModal(null);
    setFormValues(formState.values);
    setFormErrors(formState.errors);
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

    focusedSelection.clearFocusedSong(songToDelete.id);

    dispatch(deleteSongRequested({ id: songToDelete.id }));
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleGenreChange = (genre: string) => {
    dispatch(fetchSongsRequested({ genre: genre === "All" ? "" : genre, page: 1 }));
  };

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
                <StatsDashboard error={statsError} stats={stats} status={statsStatus} onBack={goHome} />
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
                        <PrimaryAction type="button" onClick={() => activeSong && focusedSelection.focusSong(activeSong)}>
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

                  <SongCatalogView
                    activeSongId={focusedSelection.activeSongId}
                    fallbackArtwork={fallbackArtwork}
                    genre={query.genre}
                    genres={genres}
                    isFiltered={isFiltered}
                    isPlaying={focusedSelection.isAdvancing}
                    items={items}
                    limit={limit}
                    onDeleteSong={openDeleteModal}
                    onEditSong={openEditModal}
                    onGenreChange={handleGenreChange}
                    onPageChange={(nextPage) => dispatch(fetchSongsRequested({ page: nextPage }))}
                    onSearchChange={handleSearchChange}
                    onSelectSong={focusedSelection.focusSong}
                    page={page}
                    searchText={searchText}
                    startItem={startItem}
                    status={status}
                    totalItems={totalItems}
                    totalPages={totalPages}
                  />
                </HomeView>
              )}
            </ScrollPanel>

            <FocusedSongFooter
              fallbackArtwork={fallbackArtwork}
              isAdvancing={focusedSelection.isAdvancing}
              isMarked={focusedSelection.isMarked}
              isRepeat={focusedSelection.isRepeat}
              isShuffle={focusedSelection.isShuffle}
              onSelectAdjacentSong={focusedSelection.selectAdjacentSong}
              onToggleAdvancing={() => focusedSelection.setIsAdvancing((current) => !current)}
              onToggleMarked={() => focusedSelection.setIsMarked((current) => !current)}
              onToggleRepeat={() => focusedSelection.setIsRepeat((current) => !current)}
              onToggleShuffle={() => focusedSelection.setIsShuffle((current) => !current)}
              onVolumeChange={focusedSelection.setVolume}
              progressPercent={focusedSelection.progressPercent}
              selectionTime={focusedSelection.selectionTime}
              song={activeSong}
              volume={focusedSelection.volume}
            />

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

const Shell = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--app-panel-subtle);

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
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
  border-radius: ${({ theme }) => theme.radii.xl}px;
  background: var(--app-panel);
  box-shadow: var(--app-shadow-panel);

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
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

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
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
  border-radius: ${({ theme }) => theme.radii.full}px;
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
    border-radius: ${({ theme }) => theme.radii.full}px;
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

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
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

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
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
  border-radius: ${({ theme }) => theme.radii.full}px;
  background: var(--app-brand);
  color: var(--app-on-brand);
  box-shadow: var(--app-shadow-floating-action);

  &:hover {
    background: var(--app-brand-hover);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
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
