import {
  ArrowRight,
  Heart,
  Home as HomeIcon,
  List,
  Menu,
  Music2,
  Search,
  Settings,
  User,
  Guitar,
} from "lucide-react";

import "../styles/Home.scss";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { getCategories } from "@/services/categories";
import { getArtists } from "@/services/artists";
import { searchSongs } from "@/services/songs";

import CategoryCard from "./CategoryCard";
import CategorySkeleton from "./loaders/CategorySkeleton";
import ArtistSelectSkeleton from "./loaders/ArtistSelectSkeleton";

import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  // -----------------------------
  // Categories
  // -----------------------------

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["song_categories"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
  });

  // -----------------------------
  // Search
  // -----------------------------

  const { data: searchResults, isFetching: searchResultsIsFetching } = useQuery(
    {
      queryKey: ["songs_search", debouncedSearch],
      queryFn: () => searchSongs(debouncedSearch),
      enabled: debouncedSearch.trim().length >= 2,
      refetchOnWindowFocus: false,
    },
  );

  // -----------------------------
  // Artists
  // -----------------------------

  const { data: allArtistsData, isFetching: artistsIsFetching } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
    refetchOnWindowFocus: false,
  });

  // -----------------------------
  // Search handlers
  // -----------------------------

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = () => {
    const query = search.trim();

    if (query.length < 2) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearchResultClick = (songId: number) => {
    setSearch("");
    navigate(`/songs/${songId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearch("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div className="songbook-page">
      {/* --------------------------------
          Header
      -------------------------------- */}

      <header className="top-header">
        <div className="top-header__logo">
          <Guitar size={24} />

          <span>SongBook</span>
        </div>

        <button className="top-header__menu" type="button" aria-label="Menu">
          <Menu size={22} />
        </button>
      </header>

      {/* --------------------------------
          Hero
      -------------------------------- */}

      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-small-title">Καλώς ήρθες!</span>

          <h1>
            Το προσωπικό σου
            <br />
            SongBook
          </h1>

          <p>
            Ανακάλυψε, παίξε και απόλαυσε τα αγαπημένα σου τραγούδια.
            <br />
            Όλη η μουσική που αγαπάς, σε ένα μέρος.
          </p>

          {/* --------------------------------
              Search
          -------------------------------- */}

          <div className="search-container" ref={searchContainerRef}>
            <Search size={21} />

            <input
              type="text"
              placeholder="Αναζήτησε τραγούδι..."
              value={search}
              onChange={handleSearchChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchSubmit();
                }

                if (event.key === "Escape") {
                  setSearch("");
                }
              }}
            />

            {/* --------------------------------
                Search dropdown
            -------------------------------- */}

            {search.trim().length >= 2 && (
              <div className="search-results">
                {searchResultsIsFetching ? (
                  <div className="search-result-loading">Αναζήτηση...</div>
                ) : searchResults?.songs?.length > 0 ? (
                  <>
                    {searchResults.songs.map((song: any) => (
                      <div
                        key={song.id}
                        className="search-result-item"
                        onClick={() => handleSearchResultClick(song.id)}
                      >
                        <div className="search-result-icon">
                          <Music2 size={18} />
                        </div>

                        <div className="search-result-info">
                          <strong>{song.title}</strong>

                          {song.artist_name && <span>{song.artist_name}</span>}
                        </div>

                        <ArrowRight size={18} />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="search-result-empty">
                    Δεν βρέθηκαν τραγούδια
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------
          Main content
      -------------------------------- */}

      <main className="main-content">
        {/* --------------------------------
            Categories
        -------------------------------- */}

        <section className="categories-wrapper">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2%",
            }}
          >
            {isFetching ? (
              <CategorySkeleton />
            ) : isError ? (
              <div>Δεν ήταν δυνατή η φόρτωση των κατηγοριών.</div>
            ) : (
              data?.categories?.map((songCategory: any) => (
                <CategoryCard key={songCategory.id} category={songCategory} />
              ))
            )}
          </div>
        </section>

        {/* --------------------------------
            Artists
        -------------------------------- */}

        {artistsIsFetching ? (
          <ArtistSelectSkeleton />
        ) : (
          <section
            className="categories-wrapper"
            style={{
              marginTop: "20px",
            }}
          >
            <div className="wrapper-of-artists-select">
              <select
                style={{
                  width: "100%",
                  cursor: "pointer",
                }}
                defaultValue=""
                onChange={(event) => {
                  const artistId = event.target.value;

                  if (artistId) {
                    navigate(`/artists/${artistId}`);
                  }
                }}
              >
                <option value="">Επιλογή καλλιτέχνη</option>

                {allArtistsData?.artists?.map((artist: any) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
