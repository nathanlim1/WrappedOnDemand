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
    <div className='flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-zinc-800 to-zinc-950'>
      Top Tracks

      {currentlyDisplayed.slice(0, maxNumDisplayed).map((t, i) => (
          <div>{i + 1}. {t.name}</div>
        ))}

        {/* Buttons to see more/all */}
      <div className="flex space-x-4 mb-20">
        <button
          className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-36"
          style={{ border: "none" }}
          onClick={(() => setMaxNumDisplayed(maxNumDisplayed + 25))}
        >
          See More
        </button>
        <button
          className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-36"
          style={{ border: "none" }}
          onClick={(() => setMaxNumDisplayed(10000))}
        >
          See All
        </button>
      </div>
    </div>
  )
}

export default TrackPage;
