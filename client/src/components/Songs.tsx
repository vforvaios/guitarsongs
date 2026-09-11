import { ChevronRight } from "lucide-react";

import "../styles/Songs.scss";
import { getSongsByCategory } from "@/services/songs";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

export default function Songs() {
  const categoryId = useParams().id;
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["songs_by_category"],
    queryFn: () => {
      return getSongsByCategory(Number(categoryId));
    },
  });

  return (
    <div className="category-songs">
      {/* Header */}
      <header className="category-songs__header">
        {/* <div className="category-songs__header-top">
          <button
            className="category-songs__back"
            onClick={onBack}
            aria-label="Πίσω"
          >
            <ArrowLeft size={22} />
          </button>

          <span>Πίσω</span>

          <button className="category-songs__more">•••</button>
        </div> */}

        {/* <div className="category-songs__title-row">
          <div>
            <h1>{category?.name}</h1>
          </div>

          <div className="category-songs__category-icon">
            <Music2 size={27} />
          </div>
        </div> */}

        {/* Stats */}
        {/* <div className="category-songs__stats">
          <div className="category-songs__stat">
            <Music2 size={18} />

            <span>
              <strong>{category.songCount}</strong> τραγούδια
            </span>
          </div>

          <div className="category-songs__stat-divider" />

          <div className="category-songs__stat">
            <UserRound size={18} />

            <span>
              <strong>{category.artistCount}</strong> καλλιτέχνες
            </span>
          </div>
        </div> */}
      </header>

      {/* Content */}
      <main className="category-songs__content">
        {/* Search */}

        {/* Songs */}
        <div className="category-songs__list">
          {data?.songs.map((song: any) => (
            <button
              key={song.id}
              className="song-row"
              onClick={() => navigate(`/songs/${song.id}`)}
            >
              {/* Information */}
              <div className="song-row__info">
                <h2>{song.title}</h2>
              </div>

              {/* Actions */}
              <div className="song-row__actions">
                {/* <button
                  className={`song-row__favorite ${
                    song.favorite ? "is-favorite" : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  aria-label="Αγαπημένο"
                >
                  <Heart
                    size={21}
                    fill={song.favorite ? "currentColor" : "none"}
                  />
                </button> */}

                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {/* {songs.length === 0 && (
          <div className="category-songs__empty">
            <Search size={35} />

            <h3>Δεν βρέθηκαν τραγούδια</h3>

            <p>Δοκίμασε διαφορετικό τίτλο ή όνομα καλλιτέχνη.</p>
          </div> */}
        {/* )} */}
      </main>
    </div>
  );
}
