import "../index.css";
import React, { useState, useEffect } from "react";
import { generatePlaylist } from "../utils/generatePlaylist";
import TrackPreview from "../components/TrackPreview";

function TrackPage({ time_range, allTracks, spotifyApi }) {
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState([]);
  const [maxNumDisplayed, setMaxNumDisplayed] = useState(25);
  const [alertMessage, setAlertMessage] = useState("");

  // Function to handle playlist generation
  const handleGeneratePlaylist = async () => {
    const result = await generatePlaylist(
      currentlyDisplayed.slice(0, maxNumDisplayed),
      spotifyApi,
      "Top Tracks"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (result.success) {
      setAlertMessage(
        "Playlist created successfully! Look for 'Top Tracks' in your Spotify account."
      );
    } else {
      setAlertMessage(
        "An error occurred and your playlist could not be generated. Please try again later."
      );
    }
  };

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
    <div className="flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-zinc-800 to-zinc-950">
      <p className="text-center font-bold mb-4 mt-4 text-4xl">
        Your Top Tracks
      </p>

      {/* Alert Message */}
      {alertMessage && (
        <div className="bg-gradient-to-br from-[#1ED760] to-green-600 text-white py-2 px-4 rounded-xl mb-4">
          {alertMessage}
        </div>
      )}

      <div className="space-y-4 mb-4">
        {currentlyDisplayed.slice(0, maxNumDisplayed).map((t, i) => (
          <TrackPreview key={t.id} track={t} index={i + 1} />
        ))}
      </div>

      {/* Buttons to see more/all */}
      <div className="flex space-x-4 mb-20">
        <button
          className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-36"
          style={{ border: "none" }}
          onClick={() => setMaxNumDisplayed(maxNumDisplayed + 25)}
        >
          See More
        </button>
        <button
          className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-36"
          style={{ border: "none" }}
          onClick={() => setMaxNumDisplayed(10000)}
        >
          See All
        </button>
        <button
          className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-36"
          style={{ border: "none" }}
          onClick={() => handleGeneratePlaylist()}
        >
          Generate Playlist
        </button>
      </div>
    </div>
  );
}

export default TrackPage;
