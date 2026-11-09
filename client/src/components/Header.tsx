import { Guitar, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="top-header">
      <div className="top-header__logo">
        <Link to="/">
          <Guitar size={24} />
          <span>SongBook</span>
        </Link>
      </div>

      <Link to="/login" className="top-header__login">
        <LogIn size={20} />
      </Link>
    </header>
  );
};

export default Header;
