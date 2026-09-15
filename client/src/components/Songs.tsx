import { ArrowLeft, ChevronRight, Music2 } from "lucide-react";

import "../styles/Songs.scss";
import { getSongsByCategory } from "@/services/songs";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import SongListSkeleton from "./loaders/SongListSkeleton";
import CategorySongsHeaderSkeleton from "./loaders/CategoryHeaderSongListSkeleton";

export default function Songs() {
  const categoryId = useParams().id;
  const navigate = useNavigate();
  const { data, isFetching } = useQuery({
    queryKey: ["songs_by_category"],
    queryFn: () => {
      return getSongsByCategory(Number(categoryId));
    },
    refetchOnWindowFocus: false,
  });

  const onBack = () => navigate(`/`);

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

            <button className="category-songs__more">•••</button>
          </div>

          <div className="category-songs__title-row">
            <div>
              <h1>{data?.categoryName}</h1>
            </div>

            <div className="category-songs__category-icon">
              <Music2 size={27} />
            </div>
          </div>

          {/* Stats */}
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
        {/* Songs */}
        <div className="category-songs__list">
          {isFetching ? (
            <SongListSkeleton />
          ) : (
            data?.songs.map((song: any) => (
              <button
                key={song.id}
                className="song-row"
                onClick={() => navigate(`/songs/${song.id}`)}
              >
                {/* Information */}
                <div className="song-row__info">
                  <h2>{song.title}</h2>
                  <h3>({song.artist_name})</h3>
                </div>

                <div className="song-row__actions">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
