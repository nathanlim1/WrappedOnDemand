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
              <img
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png"
                alt="Home Logo"
                className="navbar-logo"
              />
            </Link>
            <Link to="/home">Home</Link>
            <Link to="/artists">Artists</Link>
            <Link to="/tracks">Tracks</Link>
            <Link to="/albums">Albums</Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
