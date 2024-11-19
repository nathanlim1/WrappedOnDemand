import '../index.css'
import React, {useState, useEffect} from 'react'
import LoadingSpinner from '../components/loadingSpinner';

function TrackPage({time_range, allTracks}) {
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState([]);
  const [maxNumDisplayed, setMaxNumDisplayed] = useState(25);

  // When timerange changes, update the currently displayed list
  useEffect(() => {
    if (time_range === "short_term") {
      setCurrentlyDisplayed(allTracks["1M"]);
    } else if (time_range === "medium_term") {
      setCurrentlyDisplayed(allTracks["6M"]);
    } else if (time_range === "long_term") {
      setCurrentlyDisplayed(allTracks["LT"]);
    }
  }, [time_range, allTracks]);

  if (currentlyDisplayed.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      Top Tracks

      {currentlyDisplayed.slice(0, maxNumDisplayed).map((t, i) => (
          <div>{i + 1}. {t.name}</div>
        ))}
    </div>
  )
}

export default TrackPage;
