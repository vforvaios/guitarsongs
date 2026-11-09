import { useNavigate } from "react-router";
import { UserPlus, Users, Music, Search } from "lucide-react";

import "../styles/AdminHome.scss";

const adminActions = [
  {
    title: "ΕΙΣΑΓΩΓΗ ΚΑΛΛΙΤΕΧΝΗ",
    description: "Προσθήκη νέου καλλιτέχνη",
    icon: UserPlus,
    path: "/admin/addartist",
  },
  {
    title: "ΕΥΡΕΣΗ ΚΑΛΛΙΤΕΧΝΗ",
    description: "Αναζήτηση και επεξεργασία καλλιτεχνών",
    icon: Users,
    path: "/admin/artists",
  },
  {
    title: "ΕΙΣΑΓΩΓΗ ΤΡΑΓΟΥΔΙΟΥ",
    description: "Προσθήκη νέου τραγουδιού",
    icon: Music,
    path: "/admin/addsong",
  },
  {
    title: "ΕΥΡΕΣΗ ΤΡΑΓΟΥΔΙΟΥ",
    description: "Αναζήτηση και επεξεργασία τραγουδιών",
    icon: Search,
    path: "/admin/songs",
  },
];

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="admin-home">
      <header className="admin-home__header">
        <h1>ADMIN PANEL</h1>
        <p>Διαχείριση τραγουδιών και καλλιτεχνών</p>
      </header>

      <main className="admin-home__content">
        <div className="admin-home__grid">
          {adminActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.path}
                type="button"
                className="admin-home__card"
                onClick={() => navigate(action.path)}
              >
                <div className="admin-home__icon">
                  <Icon size={30} />
                </div>

                <div className="admin-home__info">
                  <h2>{action.title}</h2>
                  <p>{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
