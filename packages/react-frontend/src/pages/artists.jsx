import "../index.css";
import React, { useState, useEffect } from "react";
import ArtistPreview from "../components/artistPreview/artistPreview";
import LoadingSpinner from "../components/loadingSpinner";

function ArtistPage({ time_range, allArtists }) {
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState([]);
  const [maxNumDisplayed, setMaxNumDisplayed] = useState(25);

  // When timerange changes, update the currently displayed list
  useEffect(() => {
    if (time_range === "short_term") {
      setCurrentlyDisplayed(allArtists["1M"]);
    } else if (time_range === "medium_term") {
      setCurrentlyDisplayed(allArtists["6M"]);
    } else if (time_range === "long_term") {
      setCurrentlyDisplayed(allArtists["LT"]);
    }
  }, [time_range, allArtists]);

  if (currentlyDisplayed.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-zinc-800 to-zinc-950">
      {/* Title */}
      <p className="text-center font-bold mb-4 mt-4 text-4xl">
        Your Top Artists
      </p>
      {/* List of Artist Previews */}
      <div className="space-y-4 mb-4">
        {currentlyDisplayed.slice(0, maxNumDisplayed).map((a, i) => (
          <ArtistPreview artist={a} index={i + 1} />
        ))}
      </div>
      {/* Buttons to see more/all */}
      <div className="flex space-x-4 mb-20">
        <button
          className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-36"
          style={{ border: "none" }}
        >
          See More
        </button>
        <button
          className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-36"
          style={{ border: "none" }}
        >
          See All
        </button>
      </div>
    </div>
  );
}

export default ArtistPage;
