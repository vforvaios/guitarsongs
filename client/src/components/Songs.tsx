import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Heart,
  Music2,
  Search,
  UserRound,
} from "lucide-react";

import "../styles/Songs.scss";

const defaultCategory: any = {
  id: 1,
  name: "Έντεχνα",
  description:
    "Σύγχρονα και διαχρονικά τραγούδια της έντεχνης ελληνικής μουσικής.",
  songCount: 76,
  artistCount: 48,
};

const defaultSongs: any = [
  {
    id: 1,
    title: "Καλοκαίρι",
    artist: "Γιάννης Πάριος",
    key: "C",
  },
  {
    id: 2,
    title: "Θα 'θελα",
    artist: "Γιάννης Κότσιρας",
    key: "Dm",
  },
  {
    id: 3,
    title: "Στο περιγιάλι το κρυφό",
    artist: "Γιώργος Νταλάρας",
    key: "Am",
  },
  {
    id: 4,
    title: "Μικρή μου Αντιγόνη",
    artist: "Μάνος Χατζιδάκις",
    key: "F",
  },
  {
    id: 5,
    title: "Όλα σε θυμίζουν",
    artist: "Γιάννης Κότσιρας",
    key: "Dm",
    favorite: true,
  },
  {
    id: 6,
    title: "Αν θυμηθείς τ' όνειρό μου",
    artist: "Δημήτρης Μητροπάνος",
    key: "G",
  },
  {
    id: 7,
    title: "Ρόζα",
    artist: "Σωκράτης Μάλαμας",
    key: "Em",
  },
];

export default function Songs({
  category = defaultCategory,
  songs = defaultSongs,
  onBack,
  onSongClick,
}: any) {
  return (
    <div className="category-songs">
      {/* Header */}
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
            <h1>{category.name}</h1>
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
        </div>
      </header>

      {/* Content */}
      <main className="category-songs__content">
        {/* Search */}

        {/* Songs */}
        <div className="category-songs__list">
          {songs.map((song: any) => (
            <button
              key={song.id}
              className="song-row"
              onClick={() => onSongClick?.(song)}
            >
              {/* Information */}
              <div className="song-row__info">
                <h2>{song.title}</h2>

                <p>{song.artist}</p>

                <div className="song-row__meta">
                  <span className="song-row__key">♪ {song.key}</span>

                  <span className="song-row__tag song-row__tag--category">
                    {category.name}
                  </span>

                  <span className="song-row__tag song-row__tag--language">
                    Ελληνικά
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="song-row__actions">
                <button
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
                </button>

                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {songs.length === 0 && (
          <div className="category-songs__empty">
            <Search size={35} />

            <h3>Δεν βρέθηκαν τραγούδια</h3>

            <p>Δοκίμασε διαφορετικό τίτλο ή όνομα καλλιτέχνη.</p>
          </div>
        )}
      </main>
    </div>
  );
}
