import { ArrowLeft, ChevronRight, Music2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { getArtists, getSongsByArtist } from "@/services/artists";

import "../styles/Songs.scss";
import SongListSkeleton from "./loaders/SongListSkeleton";
import CategorySongsHeaderSkeleton from "./loaders/CategoryHeaderSongListSkeleton";
import ArtistSelectSkeleton from "./loaders/ArtistSelectSkeleton";

export default function ArtistSongs() {
  const artistId = useParams().id;
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["songs_by_artist", artistId],
    queryFn: () => getSongsByArtist(Number(artistId)),
    refetchOnWindowFocus: false,
  });

  const { data: allArtistsData, isFetching: artistsIsFetching } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const onBack = () => navigate("/");

  return (
    <div className="category-songs">
      {isFetching ? (
        <CategorySongsHeaderSkeleton />
      ) : (
        <header
          className="category-songs__header"
          style={{ marginBottom: "12px" }}
        >
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
              <span>Καλλιτέχνης</span>
              <h1>{data?.artistSongs[0]?.artist_name}</h1>
            </div>

            <div className="category-songs__category-icon">
              <Music2 size={27} />
            </div>
          </div>

          <div className="category-songs__stats">
            <div className="category-songs__stat">
              <Music2 size={18} />

              <span>
                <strong>{data?.artistSongs?.length}</strong> τραγούδια
              </span>
            </div>
          </div>
        </header>
      )}
      {artistsIsFetching ? (
        <ArtistSelectSkeleton />
      ) : (
        <section
          style={{
            marginBottom: "24px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <div className="wrapper-of-artists-select">
            <select
              style={{ width: "100%", cursor: "pointer" }}
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/artists/${e.target.value}`);
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
      <main className="category-songs__content">
        <div className="category-songs__list">
          {isFetching ? (
            <SongListSkeleton />
          ) : (
            data?.artistSongs.map((song: any) => (
              <button
                key={song.id}
                className="song-row"
                onClick={() => navigate(`/songs/${song.id}`)}
              >
                <div className="song-row__info">
                  <h2>{song.title}</h2>
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
