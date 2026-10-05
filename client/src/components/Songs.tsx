import { ArrowLeft, ChevronRight, Music2, Search, X } from "lucide-react";

import "../styles/Songs.scss";
import { getSongsByCategory } from "@/services/songs";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useMemo, useState } from "react";
import SongListSkeleton from "./loaders/SongListSkeleton";
import CategorySongsHeaderSkeleton from "./loaders/CategoryHeaderSongListSkeleton";

export default function Songs() {
  const categoryId = useParams().id;
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["songs_by_category", categoryId],
    queryFn: () => {
      return getSongsByCategory(Number(categoryId));
    },
    refetchOnWindowFocus: false,
  });

  const filteredSongs = useMemo(() => {
    if (!data?.songs) return [];

    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return data.songs;
    }

    return data.songs.filter((song: any) => {
      const title = song.title?.toLowerCase() ?? "";
      const artist = song.artist_name?.toLowerCase() ?? "";

      return title.includes(searchTerm) || artist.includes(searchTerm);
    });
  }, [data?.songs, search]);

  const onBack = () => navigate("/");

  return (
    <div className="category-songs">
      {/* Header */}
      {isFetching ? (
        <CategorySongsHeaderSkeleton />
      ) : (
        <header className="category-songs__header">
          <div className="category-songs__header-top">
            <button
              className="category-songs__back"
              onClick={onBack}
              aria-label="Πίσω"
            >
              <ArrowLeft size={22} />
            </button>

            <span>Πίσω</span>
          </div>

          <div className="category-songs__title-row">
            <div>
              <h1>{data?.categoryName}</h1>
            </div>

            <div className="category-songs__category-icon">
              <Music2 size={27} />
            </div>
          </div>

          <div className="category-songs__stats">
            <div className="category-songs__stat">
              <Music2 size={18} />

              <span>
                <strong>{data?.count}</strong> τραγούδια
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="category-songs__content">
        {!isFetching && data?.songs?.length > 0 && (
          <div className="category-songs__search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Αναζήτηση τραγουδιού ή καλλιτέχνη..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Καθαρισμός αναζήτησης"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Songs */}
        <div className="category-songs__list">
          {isFetching ? (
            <SongListSkeleton />
          ) : filteredSongs.length > 0 ? (
            filteredSongs.map((song: any) => (
              <button
                key={song.id}
                className="song-row"
                onClick={() => navigate(`/songs/${song.id}`)}
              >
                <div className="song-row__info">
                  <h2>{song.title}</h2>
                  <h3>({song.artist_name})</h3>
                </div>

                <div className="song-row__actions">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))
          ) : (
            <div className="category-songs__empty">
              <Search size={36} />

              <h2>Δεν βρέθηκαν τραγούδια</h2>

              <p>
                Δεν βρέθηκε τραγούδι για <strong>"{search}"</strong>
              </p>

              <button type="button" onClick={() => setSearch("")}>
                Καθαρισμός αναζήτησης
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
