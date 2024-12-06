import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top whenever the location changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/home" className="navbar-logo-link">
          <div className="logo-green w-7 h-7 bg-[#1DB954]"></div>
        </Link>
        <Link to="/home">Home</Link>
        <Link to="/artists">Artists</Link>
        <Link to="/tracks">Tracks</Link>
        <Link to="/albums">Albums</Link>
        <Link to="/sharing">Sharing</Link>
      </div>
    </nav>
  );
};

export default Navbar;