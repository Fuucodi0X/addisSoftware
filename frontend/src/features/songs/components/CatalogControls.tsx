import { Button } from "../../../ui/Button";

interface CatalogControlsProps {
  endItem: number;
  genre: string;
  genres: string[];
  onAddSong: () => void;
  onGenreChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  query: string;
  startItem: number;
  totalItems: number;
}

export const CatalogControls = ({
  endItem,
  genre,
  genres,
  onAddSong,
  onGenreChange,
  onSearchChange,
  query,
  startItem,
  totalItems
}: CatalogControlsProps) => (
  <div className="catalog-card-header">
    <div>
      <p className="section-kicker">Song Catalog</p>
      <h2>Song Catalog</h2>
      <p className="result-count" aria-live="polite">
        {totalItems === 0 ? "No results" : `${startItem}-${endItem} of ${totalItems} Songs`}
      </p>
    </div>

    <div className="catalog-tools" aria-label="Song catalog filters">
      <label className="search-control">
        <span>Search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Title, Artist, Album, Genre"
        />
      </label>
      <label className="genre-control">
        <span>Genre</span>
        <select value={genre} onChange={(event) => onGenreChange(event.target.value)}>
          <option value="">All genres</option>
          {genres.map((genreName) => (
            <option value={genreName} key={genreName}>
              {genreName}
            </option>
          ))}
        </select>
      </label>
      <Button className="add-song-button" variant="primary" onClick={onAddSong}>
        Add Song
      </Button>
    </div>
  </div>
);
