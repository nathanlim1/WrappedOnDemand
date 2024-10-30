import React from 'react';
import './timerangeSelector.css';
import { useSpotifyApi } from '../../SpotifyContext'; 


const TimeRangeSelector = ({ currentRange, setRange, loggedIn }) => {
  return (
    <>
      {loggedIn && (
        <nav className="timerange-selector">
        <button
          className={`selector-button ${currentRange === "short_term" ? "active" : ""}`}
          onClick={() => setRange("short_term")}
        >
          1 Month
        </button>
        <button
          className={`selector-button ${currentRange === "medium_term" ? "active" : ""}`}
          onClick={() => setRange("medium_term")}
        >
          6 Months
        </button>
        <button
          className={`selector-button ${currentRange === "long_term" ? "active" : ""}`}
          onClick={() => setRange("long_term")}
        >
          Lifetime
        </button>
      </nav>
      )}
    </>
  );
};

export default TimeRangeSelector;