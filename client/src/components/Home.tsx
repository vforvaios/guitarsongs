// import { useQuery } from "@tanstack/react-query";
// import { getCategories } from "@/services/categories";

// const Home = () => {
//   const { data, isError, error } = useQuery({
//     queryKey: ["song_categories"],
//     queryFn: () => {
//       return getCategories();
//     },
//   });

//   return (
//     <div>
//       {data?.categories?.map((songCategory: any) => (
//         <div key={songCategory.id}>{songCategory.name}</div>
//       ))}
//     </div>
//   );
// };

// export default Home;

import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Home as HomeIcon,
  List,
  Menu,
  Music2,
  Search,
  Settings,
  User,
  Globe2,
  Guitar,
  Mic2,
  Music,
  Zap,
} from "lucide-react";

import "../styles/Home.scss";

interface Category {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface Song {
  title: string;
  artist: string;
  key: string;
  category: string;
  categoryType: "greek" | "foreign";
  image: string;
}

const greekCategories: Category[] = [
  {
    name: "Λαϊκά",
    count: 124,
    icon: <Music2 size={25} />,
    color: "#f5b82e",
  },
  {
    name: "Ρεμπέτικα",
    count: 87,
    icon: <Guitar size={25} />,
    color: "#6fc46b",
  },
  {
    name: "Έντεχνα",
    count: 76,
    icon: <Music size={25} />,
    color: "#8c5be8",
  },
  {
    name: "Rock",
    count: 52,
    icon: <Guitar size={25} />,
    color: "#e83d59",
  },
];

const foreignCategories: Category[] = [
  {
    name: "Rock",
    count: 138,
    icon: <Guitar size={25} />,
    color: "#4e9ce8",
  },
  {
    name: "Pop",
    count: 97,
    icon: <Music2 size={25} />,
    color: "#ed4f8d",
  },
  {
    name: "Blues",
    count: 45,
    icon: <Music size={25} />,
    color: "#3aa9a7",
  },
  {
    name: "Metal",
    count: 32,
    icon: <Zap size={25} />,
    color: "#7b45c4",
  },
];

const songs: Song[] = [
  {
    title: "The Sound of Silence",
    artist: "Simon & Garfunkel",
    key: "Am",
    category: "Έντεχνα",
    categoryType: "foreign",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Καλοκαίρι",
    artist: "Γιάννης Πάριος",
    key: "C",
    category: "Λαϊκά",
    categoryType: "greek",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    key: "G",
    category: "Rock",
    categoryType: "foreign",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Όλα σε θυμίζουν",
    artist: "Γιάννης Κότσιρας",
    key: "Dm",
    category: "Έντεχνα",
    categoryType: "greek",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    key: "E",
    category: "Rock",
    categoryType: "foreign",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
  },
];

function CategoryCard({ category }: { category: Category }) {
  return (
    <button className="category-card">
      <div
        className="category-icon"
        style={{
          backgroundColor: category.color,
        }}
      >
        {category.icon}
      </div>

      <div className="category-info">
        <strong>{category.name}</strong>
        <span>{category.count} τραγούδια</span>
      </div>

      <ArrowRight size={20} className="category-arrow" />
    </button>
  );
}

function CategorySection({
  title,
  description,
  categories,
  type,
}: {
  title: string;
  description: string;
  categories: Category[];
  type: "greek" | "foreign";
}) {
  return (
    <section className={`category-section ${type}`}>
      <div className="category-section-header">
        <div className="category-title-wrapper">
          <div className="category-main-icon">
            {type === "greek" ? (
              <span className="greek-flag">☰</span>
            ) : (
              <Globe2 size={28} />
            )}
          </div>

          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className="category-header-right">
          <span>{categories.length} κατηγορίες</span>
          <ChevronUp size={20} />
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  );
}

function SongCard({ song }: { song: Song }) {
  return (
    <button className="song-card">
      <div
        className="song-image"
        style={{
          backgroundImage: `url(${song.image})`,
        }}
      >
        <button
          className="song-favorite"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart size={20} />
        </button>

        <span className="song-key">{song.key}</span>
      </div>

      <div className="song-content">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>

        <div className="song-tags">
          <span
            className={
              song.categoryType === "greek" ? "tag greek-tag" : "tag purple-tag"
            }
          >
            {song.category}
          </span>

          <span
            className={
              song.categoryType === "greek" ? "tag blue-tag" : "tag blue-tag"
            }
          >
            {song.categoryType === "greek" ? "Ελληνικά" : "Ξένα"}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  return (
    <div className="songbook-page">
      {/* ================= HEADER ================= */}

      <header className="top-header">
        <div className="header-inner">
          <a className="logo">
            <div className="logo-icon">
              <Guitar size={27} />
            </div>

            <span>SongBook</span>
          </a>

          <nav className="desktop-navigation">
            <a className="nav-item active">
              <HomeIcon size={19} />
              <span>Αρχική</span>
            </a>

            <a className="nav-item">
              <Music2 size={19} />
              <span>Τραγούδια</span>
            </a>

            <a className="nav-item">
              <Heart size={19} />
              <span>Αγαπημένα</span>
            </a>

            <a className="nav-item">
              <List size={19} />
              <span>Λίστες</span>
            </a>
          </nav>

          <div className="header-actions">
            <button className="icon-button">
              <Settings size={21} />
            </button>

            <button className="profile-button">
              <User size={20} />
            </button>

            <button className="mobile-menu-button">
              <Menu size={23} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}

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

          <div className="search-container">
            <Search size={21} />

            <input
              type="text"
              placeholder="Αναζήτησε τραγούδι, καλλιτέχνη, κατηγορία..."
            />

            <button>Αναζήτηση</button>
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main className="main-content">
        {/* Categories */}

        <section className="categories-wrapper">
          <div className="section-heading">
            <div>
              <h2>Κατηγορίες</h2>
              <p>
                Περιηγήσου στις κατηγορίες και βρες το επόμενο αγαπημένο σου
                τραγούδι.
              </p>
            </div>

            <button className="view-all">
              Προβολή όλων
              <ArrowRight size={17} />
            </button>
          </div>

          <CategorySection
            title="Ελληνικά"
            description="Η ελληνική μουσική, από τα παραδοσιακά μέχρι τα σύγχρονα."
            categories={greekCategories}
            type="greek"
          />

          <CategorySection
            title="Ξένα"
            description="Από τα κλασικά μέχρι τα πιο σύγχρονα hits."
            categories={foreignCategories}
            type="foreign"
          />
        </section>

        {/* ================= RECENT SONGS ================= */}

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <h2>Πρόσφατα προστέθηκαν</h2>
            </div>

            <button className="view-all">
              Προβολή όλων
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="songs-grid">
            {songs.map((song) => (
              <SongCard key={song.title} song={song} />
            ))}
          </div>
        </section>
      </main>

      {/* ================= MOBILE NAV ================= */}

      <nav className="mobile-bottom-navigation">
        <a className="mobile-nav-item active">
          <HomeIcon size={21} />
          <span>Αρχική</span>
        </a>

        <a className="mobile-nav-item">
          <Music2 size={21} />
          <span>Τραγούδια</span>
        </a>

        <a className="mobile-nav-item">
          <Heart size={21} />
          <span>Αγαπημένα</span>
        </a>

        <a className="mobile-nav-item">
          <List size={21} />
          <span>Λίστες</span>
        </a>

        <a className="mobile-nav-item">
          <Menu size={21} />
          <span>Περισσότερα</span>
        </a>
      </nav>
    </div>
  );
}
