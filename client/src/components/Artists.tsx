import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight, Mic2, Music2, Search } from "lucide-react";

import { getArtistsByCategory } from "@/services/artists";
import "../styles/artists.scss";

interface Artist {
  category_id: number;
  category_name: string;
  artist_id: number;
  artist_name: string;
  song_count: number;
}

export default function Artists() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isFetching, isError } = useQuery({
    queryKey: ["artists_by_category"],
    queryFn: getArtistsByCategory,
    refetchOnWindowFocus: false,
  });

  const onBack = () => navigate("/");

  const groupedArtists = useMemo(() => {
    const artists: Artist[] = data?.artists ?? [];
    const searchTerm = search.trim().toLocaleLowerCase("el");

    const filteredArtists = artists.filter((artist) =>
      artist.artist_name.toLocaleLowerCase("el").includes(searchTerm),
    );

    return filteredArtists.reduce<
      { categoryId: number; categoryName: string; artists: Artist[] }[]
    >((groups, artist) => {
      let group = groups.find((item) => item.categoryId === artist.category_id);

      if (!group) {
        group = {
          categoryId: artist.category_id,
          categoryName: artist.category_name,
          artists: [],
        };

        groups.push(group);
      }

      group.artists.push(artist);
      return groups;
    }, []);
  }, [data?.artists, search]);

  return (
    <div className="category-songs">
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
            <h1>ΚΑΛΛΙΤΕΧΝΕΣ</h1>
          </div>
        </div>

        <div className="category-songs__stats">
          <div className="category-songs__stat">
            <Music2 size={18} />
          </div>
        </div>
      </header>

      <main className="artists-page__content">
        <div className="artists-page__search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Αναζήτηση καλλιτέχνη..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isFetching ? (
          <p>Φόρτωση καλλιτεχνών...</p>
        ) : isError ? (
          <p>Δεν ήταν δυνατή η φόρτωση των καλλιτεχνών.</p>
        ) : groupedArtists.length > 0 ? (
          groupedArtists.map((group) => (
            <section key={group.categoryId} className="artists-page__category">
              <h2 style={{ fontWeight: "bold" }}>{group.categoryName}</h2>

              <div className="artists-page__list">
                {group.artists.map((artist) => (
                  <button
                    type="button"
                    key={`${group.categoryId}-${artist.artist_id}`}
                    className="artist-row"
                    onClick={() => navigate(`/artists/${artist.artist_id}`)}
                  >
                    <div className="artist-row__icon">
                      <Mic2 size={20} />
                    </div>

                    <div className="artist-row__info">
                      <h3>{artist.artist_name}</h3>
                    </div>

                    <span className="artist-row__count">
                      {artist.song_count} τραγούδια
                    </span>

                    <ChevronRight size={20} />
                  </button>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="artists-page__empty">
            <Mic2 size={36} />
            <h2>Δεν βρέθηκαν καλλιτέχνες</h2>
            <p>Δοκίμασε διαφορετική αναζήτηση.</p>
          </div>
        )}
      </main>
    </div>
  );
}
