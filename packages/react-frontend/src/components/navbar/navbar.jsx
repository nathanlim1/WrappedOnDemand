import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = ({loggedIn}) => {  
  return (
    <>
      {loggedIn && (<nav className="navbar">
        <div className="navbar-links">
          <Link to="/home">Home</Link>
          <Link to="/page2">Top Artists</Link>
          <Link to="/page3">Top Tracks</Link>
        </div>
      </nav>
    )}  
  </>
  );
};

export default Navbar;