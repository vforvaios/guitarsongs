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
import { getCategories } from "@/services/categories";
import CategoryCard from "./CategoryCard";

export default function Home() {
  const { data, isError, error } = useQuery({
    queryKey: ["song_categories"],
    queryFn: () => {
      return getCategories();
    },
  });

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

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2%" }}>
            {data?.categories?.map((songCategory: any) => (
              <CategoryCard key={songCategory.id} category={songCategory} />
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
