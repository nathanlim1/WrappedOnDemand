import "../index.css";
import { useState, useEffect } from "react";
import { generatePlaylist } from "../utils/generatePlaylist";
import TrackPreview from "../components/previews/trackPreview";

function TrackPage({ time_range, allTracks, spotifyApi }) {
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState([]);
  const [maxNumDisplayed, setMaxNumDisplayed] = useState(25);
  const [alertMessage, setAlertMessage] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [playlistTitle, setPlaylistTitle] = useState()
  const [fromNum, setFromNum] = useState();
  const [toNum, setToNum] = useState();

  // Function to handle playlist generation
  const handleGeneratePlaylist = async (event) => {
    event.preventDefault(); 

    const result = await generatePlaylist(
      currentlyDisplayed.slice(fromNum - 1, toNum),
      spotifyApi,
      playlistTitle
    );

    setPlaylistTitle("");
    setFromNum("");
    setToNum("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (result.success) {
      setAlertMessage(
        `Playlist created successfully! Look for '${playlistTitle}' in your Spotify account.`
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

  // Effect to handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const pixelsToCenter = screenWidth / 2;
  const adjustedPosition = (pixelsToCenter - 330) / 2;

  return (
    <div className="flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-zinc-800 to-zinc-950">
      <p className="text-center font-bold mb-4 mt-4 text-4xl">
        Your Top Tracks
      </p>

      {/* Generate playlist form */}
      <form
        className="fixed top-1/2 transform -translate-y-1/2 bg-zinc-800 text-white font-semibold py-6 px-8 rounded-md shadow-xl w-80"
        onSubmit={handleGeneratePlaylist}
        style={{
          border: "none",
          left: `${adjustedPosition - 160}px`, // Center the form based on the adjusted position
        }}
      >
        <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-lg px-4">
          <h2 className="text-xl font-bold text-center w-full">
            Create a Playlist
          </h2>
        </div>

        <div className="flex flex-col space-y-4">
          {/* Playlist Name */}
          <input
            type="text"
            placeholder="Playlist Name"
            value={playlistTitle}
            onChange={(e) => setPlaylistTitle(e.target.value)}
            className="bg-transparent border-b-2 border-white text-white placeholder-gray-400 focus:outline-none focus:border-[#00FF7F] py-2 px-3"
          />
          
          {/* Number 1 and Number 2 next to each other */}
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="From"
              value={fromNum}
              onChange={(e) => setFromNum(e.target.value)}
              className="bg-transparent border-b-2 border-white text-white placeholder-gray-400 focus:outline-none focus:border-[#00FF7F] py-2 px-3 w-1/2"
            />
            <input
              type="number"
              placeholder="To"
              value={toNum}
              onChange={(e) => setToNum(e.target.value)}
              className="bg-transparent border-b-2 border-white text-white placeholder-gray-400 focus:outline-none focus:border-[#00FF7F] py-2 px-3 w-1/2"
            />
          </div>

          {/* Submit Button */}
          <button
            className="bg-zinc-700 text-white py-2 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none hover:text-[#00FF7F] w-auto"
            type="submit"
          >
            Create Playlist
          </button>
        </div>
      </form>

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
      </div>
    </div>
  );
}

export default TrackPage;
