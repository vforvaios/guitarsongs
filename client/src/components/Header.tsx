import { useAuth } from "@/context/AuthContext";
import { Guitar, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="top-header">
      <div className="top-header__logo">
        <Link to="/">
          <Guitar size={24} />
          <span>SongBook</span>
        </Link>
      </div>

      {!token ? (
        <Link to="/login" className="top-header__login">
          <LogIn size={20} />
        </Link>
      ) : (
        <button onClick={handleLogout} className="top-header__logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      )}
    </header>
  );
};

export default Header;