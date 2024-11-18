import "../index.css";
import React, { useState, useEffect } from "react";
import { useSpotifyApi } from "../SpotifyContext";
import { getTopNArtists } from "../utils/getTopUtils";
import ArtistPreview from "../components/artistPreview/artistPreview";
import LoadingSpinner from "../components/loadingSpinner";

function ArtistPage({ time_range }) {
  const spotifyApi = useSpotifyApi();
  const [artists1month, setArtists1Month] = useState([]);
  const [artists6month, setArtists6Month] = useState([]);
  const [artistsLifetime, setArtistsLifetime] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // When the page loads, get the top 25 artists for each time range
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setArtists1Month(await getTopNArtists(spotifyApi, 25, "short_term"));
        setArtists6Month(await getTopNArtists(spotifyApi, 25, "medium_term"));
        setArtistsLifetime(await getTopNArtists(spotifyApi, 25, "long_term"));
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };

    fetchArtists();
    console.log(topArtists[0]);
  }, [spotifyApi]);

  // When timerange changes, update the currently displayed list
  useEffect(() => {
    if (time_range === "short_term") {
      setTopArtists(artists1month);
    } else if (time_range === "medium_term") {
      setTopArtists(artists6month);
    } else if (time_range === "long_term") {
      setTopArtists(artistsLifetime);
    }
    setIsLoading(false);
  }, [spotifyApi, time_range, artists1month, artists6month, artistsLifetime]);

  if (isLoading) {
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
        {topArtists.map((a, i) => (
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
