import '../index.css';
import React, { useState, useEffect } from 'react';

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

  return (
    <div>
      Top Albums

      {currentlyDisplayed.map((a, i) => (
        <div>{i + 1}. {a.name}</div>
      ))}
      </div>
  );
}

export default AlbumPage;