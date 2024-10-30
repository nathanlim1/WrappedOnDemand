import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/page2">Page2</Link>
        <Link to="/page3">Page3</Link>
      </div>
    </nav>
  );
};

export default Navbar;