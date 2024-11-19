import '../index.css';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from "../components/loadingSpinner";


function AlbumPage({ time_range, allAlbums }) {
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState([]);
  const [maxNumDisplayed, setMaxNumDisplayed] = useState(25);

  useEffect(() => {
    if (time_range === "short_term") {
      setCurrentlyDisplayed(allAlbums["1M"]);
    } else if (time_range === "medium_term") {
      setCurrentlyDisplayed(allAlbums["6M"]);
    } else if (time_range === "long_term") {
      setCurrentlyDisplayed(allAlbums["LT"]);
    }
  }, [time_range, allAlbums]);

  if (currentlyDisplayed.length === 0) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      Top Albums

      {currentlyDisplayed.slice(0, maxNumDisplayed).map((a, i) => (
        <div>{i + 1}. {a.name}</div>
      ))}
      </div>
  );
}

export default AlbumPage;