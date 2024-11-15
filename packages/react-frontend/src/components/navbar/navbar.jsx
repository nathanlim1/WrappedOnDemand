import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = ({loggedIn}) => {  
  return (
    <>
      {loggedIn && (<nav className="navbar">
        <div className="navbar-links">
          <Link to="/home">Home</Link>
          <Link to="/page2">Page2</Link>
          <Link to="/page3">Page3</Link>
          <Link to="/page4">Page4</Link>
        </div>
      </nav>
    )}  
  </>
  );
};

export default Navbar;