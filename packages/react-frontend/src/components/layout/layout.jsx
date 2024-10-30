import React from 'react';
import Navbar from '../navbar/navbar';
import TimeRangeSelector from '../timerangeSelector/timerangeSelector';
import "./layout.css"

function Layout({ children, loggedIn, timeRange, setTimeRange }) {
    return (
      <>
        <Navbar loggedIn={loggedIn} />
        <TimeRangeSelector 
          currentRange={timeRange} 
          setRange={setTimeRange} 
          loggedIn={loggedIn}
        />
        <div className="page-container">
          {children}
        </div>
      </>
    );
  }
    
export default Layout;
