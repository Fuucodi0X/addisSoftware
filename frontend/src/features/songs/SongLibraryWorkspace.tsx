import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useColorScheme } from "../../design/DesignSystemProvider";
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
import { DeleteSongModal } from "./components/DeleteSongModal";
import { FloatingAddSongButton } from "./components/FloatingAddSongButton";
import { FocusedSongFooter } from "./components/FocusedSongFooter";
import { SongCatalogView } from "./components/SongCatalogView";
import { SongFormModal } from "./components/SongFormModal";
import { SongLibraryShell } from "./components/SongLibraryShell";
import { SongWorkspaceHome } from "./components/SongWorkspaceHome";
import { SongWorkspaceSidebar } from "./components/SongWorkspaceSidebar";
import { WorkspaceStatusView } from "./components/WorkspaceStatusView";
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

  const scrollMainToTop = () => {
    if (typeof scrollRef.current?.scrollTo !== "function") {
      return;
    }

    scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    scrollMainToTop();
  };

  const showStats = () => {
    setActiveTab("stats");
    scrollMainToTop();
  };

  const toggleStats = () => {
    setActiveTab((current) => (current === "stats" ? "home" : "stats"));
    scrollMainToTop();
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

  const handleLimitChange = (nextLimit: number) => {
    dispatch(fetchSongsRequested({ limit: nextLimit, page: 1 }));
  };

  return (
    <>
      <SongLibraryShell
        scrollRef={scrollRef}
        sidebar={
          <SongWorkspaceSidebar
            activeTab={activeTab}
            mode={mode}
            onGoHome={goHome}
            onToggleMode={toggleMode}
            onToggleStats={toggleStats}
            preference={preference}
          />
        }
        footer={
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
        }
        floatingAction={<FloatingAddSongButton onClick={openCreateModal} />}
      >
        <WorkspaceStatusView
          activeTab={activeTab}
          error={error}
          isInitialSongsLoading={isInitialSongsLoading}
          onRetryCatalog={() => dispatch(fetchSongsRequested())}
          stats={stats}
          statsError={statsError}
          statsStatus={statsStatus}
        >
          <SongWorkspaceHome
            activeSong={activeSong}
            artists={stats.artists}
            onSelectFeaturedSong={focusedSelection.focusSong}
            onShowStats={showStats}
          >
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
              onLimitChange={handleLimitChange}
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
          </SongWorkspaceHome>
        </WorkspaceStatusView>
      </SongLibraryShell>

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
