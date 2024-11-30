import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ loggedIn }) => {
  return (
    <>
      {loggedIn && (
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
      )}
    </>
  );
};

export default Navbar;
