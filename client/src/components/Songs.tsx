import {
  ArrowLeft,
  ChevronRight,
  Music2,
  Search,
  X,
  Heart,
  Loader,
} from "lucide-react";

import "../styles/Songs.scss";
import { getSongsByCategory } from "@/services/songs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useMemo, useState } from "react";
import SongListSkeleton from "./loaders/SongListSkeleton";
import CategorySongsHeaderSkeleton from "./loaders/CategoryHeaderSongListSkeleton";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/services/favorites";

type SortOption = "title-asc" | "title-desc" | "date-asc" | "date-desc";

export default function Songs() {
  const queryClient = useQueryClient();
  const categoryId = useParams().id;
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");

  const { data, isFetching } = useQuery({
    queryKey: ["songs_by_category", categoryId],
    queryFn: () => {
      return categoryId !== "-1"
        ? getSongsByCategory(Number(categoryId))
        : getFavorites();
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: addToFavorites, isPending: isPendingAddToFavorites } =
    useMutation({
      mutationKey: ["add-to-favorites"],
      mutationFn: (songId: number) => {
        return addFavorite(Number(songId));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["songs_by_category"] });
      },
    });

  const {
    mutate: removeFromFavorites,
    isPending: isPendingRemoveFromFavorites,
  } = useMutation({
    mutationKey: ["remove-from-favorites"],
    mutationFn: (songId: number) => {
      return removeFavorite(Number(songId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs_by_category"] });
    },
  });

  const filteredSongs = useMemo(() => {
    if (!data?.songs) return [];

    const searchTerm = search.trim().toLowerCase();

    const songs = data.songs.filter((song: any) => {
      const title = song.title?.toLowerCase() ?? "";
      const artist = song.artist_name?.toLowerCase() ?? "";

      return title.includes(searchTerm) || artist.includes(searchTerm);
    });

    return [...songs].sort((a: any, b: any) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title, "el");

        case "title-desc":
          return b.title.localeCompare(a.title, "el");

        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

        case "date-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

        default:
          return 0;
      }
    });
  }, [data?.songs, search, sortBy]);

  const handleAddToFavorites = (songId: number) => {
    addToFavorites(songId);
  };

  const handleRemoveFromFavorites = (songId: number) => {
    removeFromFavorites(songId);
  };

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
              <h1>{data?.categoryName ?? "ΑΓΑΠΗΜENA"}</h1>
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

        {!isFetching && data?.songs?.length > 0 && (
          <div className="wrapper-of-artists-select">
            <div className="category-songs__sorting">
              <label htmlFor="songs-sort">Ταξινόμηση:</label>

              <select
                id="songs-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="title-asc">Αλφαβητικά (Α → Ω)</option>
                <option value="title-desc">Αλφαβητικά (Ω → Α)</option>
                <option value="date-asc">Ημερομηνία (παλαιότερα)</option>
                <option value="date-desc">Ημερομηνία (νεότερα)</option>
              </select>
            </div>
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
                <div className="song-row__favorite">
                  {isPendingAddToFavorites || isPendingRemoveFromFavorites ? (
                    <Loader size={20} className="animate-spin" />
                  ) : song.is_favorite === 1 ? (
                    <Heart
                      fill="red"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromFavorites(song.id);
                      }}
                    />
                  ) : (
                    <Heart
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToFavorites(song.id);
                      }}
                    />
                  )}
                </div>
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
