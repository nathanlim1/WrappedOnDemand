import '../index.css'
import React, {useState, useEffect} from 'react'

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

  return (
    <div>
      Top Tracks

      {currentlyDisplayed.map((t, i) => (
          <div>{i + 1}. {t.name}</div>
        ))}
    </div>
  )
}

export default TrackPage;
