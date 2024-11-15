import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import TimeRangeSelector from '../timerangeSelector/timerangeSelector';
import "./layout.css";

function Layout({ children, loggedIn, timeRange, setTimeRange }) {
  const location = useLocation();

  // Define routes where the Navbar should not appear
  const noNavbarRoutes = ['/login'];

  // Determine whether to show the Navbar
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  // Add a conditional class based on whether the Navbar is shown (make space for navbar)
  const containerClass = showNavbar ? 'page-container with-navbar' : 'page-container';

  return (
    <>
      {showNavbar && (
        <>
          <Navbar loggedIn={loggedIn} />
          <TimeRangeSelector 
            currentRange={timeRange} 
            setRange={setTimeRange} 
            loggedIn={loggedIn}
          />
        </>
      )}
      <div className={containerClass}>
        {children}
      </div>
    </>
  );
}

export default Layout;