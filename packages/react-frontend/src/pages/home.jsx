import "../index.css";
import React, { useState, useEffect } from "react";
import { useSpotifyApi } from "../SpotifyContext";
import { useLocation } from "react-router-dom";
import {
  getTopNArtists,
  getTopNTracks,
  getTopNAlbums,
} from "../utils/getTopUtils.js";

// When the user logs in their credentials go to the url
// This gets their credentials
const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

function Home({ setLoggedIn, time_range }) {
  const spotifyApi = useSpotifyApi();
  const [spotifyToken, setSpotifyToken] = useState("");
  // Artists
  const [topArtists1Month, setTopArtists1Month] = useState([]);
  const [topArtists6Month, setTopArtists6Month] = useState([]);
  const [topArtistsLifetime, setTopArtistsLifetime] = useState([]);

  // Tracks
  const [topTracks1Month, setTopTracks1Month] = useState([]);
  const [topTracks6Month, setTopTracks6Month] = useState([]);
  const [topTracksLifetime, setTopTracksLifetime] = useState([]);

  // Albums
  const [topAlbums1Month, setTopAlbums1Month] = useState([]);
  const [topAlbums6Month, setTopAlbums6Month] = useState([]);
  const [topAlbumsLifetime, setTopAlbumsLifetime] = useState([]);

  // Current selections based on time_range
  const [topArtistsCur, setTopArtistsCur] = useState([]);
  const [topTracksCur, setTopTracksCur] = useState([]);
  const [topAlbumsCur, setTopAlbumsCur] = useState([]);

  // when this page is first loaded, we get the user parameters from the URL
  useEffect(() => {
    const spotifyToken = getTokenFromUrl().access_token;
    // This removes the users credentials from the URL, making it cleaner
    window.location.hash = "";

    // Checks if login went okay
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);

      // Give the token to the api
      spotifyApi.setAccessToken(spotifyToken);
      setLoggedIn(true);
      console.log("Current Access Token:", spotifyApi.getAccessToken());
    }
  }, [spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      fetchAllTopData();
    }
  }, [spotifyApi]);

  const fetchAllTopData = async () => {
    try {
      // Fetch all short term data
      const [artists1Month, tracks1Month] = await Promise.all([
        getTopNArtists(spotifyApi, 50, "short_term"),
        getTopNTracks(spotifyApi, 50, "short_term"),
      ]);
      const albums1Month = await getTopNAlbums(spotifyApi, 50, tracks1Month);

      setTopArtists1Month(artists1Month);
      setTopTracks1Month(tracks1Month);
      setTopAlbums1Month(albums1Month);

      // Fetch all medium term data
      const [artists6Month, tracks6Month] = await Promise.all([
        getTopNArtists(spotifyApi, 50, "medium_term"),
        getTopNTracks(spotifyApi, 50, "medium_term"),
      ]);
      const albums6Month = await getTopNAlbums(spotifyApi, 50, tracks6Month);

      setTopArtists6Month(artists6Month);
      setTopTracks6Month(tracks6Month);
      setTopAlbums6Month(albums6Month);

      // Fetch all long term data
      const [artistsLifetime, tracksLifetime] = await Promise.all([
        getTopNArtists(spotifyApi, 50, "long_term"),
        getTopNTracks(spotifyApi, 50, "long_term"),
      ]);
      const albumsLifetime = await getTopNAlbums(
        spotifyApi,
        50,
        tracksLifetime
      );

      setTopArtistsLifetime(artistsLifetime);
      setTopTracksLifetime(tracksLifetime);
      setTopAlbumsLifetime(albumsLifetime);

      // Initialize the current selections
      updateCurrentData();
    } catch (error) {
      console.error("Error fetching top data:", error);
    }
  };

  useEffect(() => {
    updateCurrentData();
  }, [time_range, topArtists1Month, topArtists6Month, topArtistsLifetime]);

  const updateCurrentData = () => {
    if (time_range === "short_term") {
      setTopArtistsCur(topArtists1Month);
      setTopTracksCur(topTracks1Month);
      setTopAlbumsCur(topAlbums1Month);
    } else if (time_range === "medium_term") {
      setTopArtistsCur(topArtists6Month);
      setTopTracksCur(topTracks6Month);
      setTopAlbumsCur(topAlbums6Month);
    } else if (time_range === "long_term") {
      setTopArtistsCur(topArtistsLifetime);
      setTopTracksCur(topTracksLifetime);
      setTopAlbumsCur(topAlbumsLifetime);
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 text-white">
      {/* Intro Section */}
      <section className="flex justify-center items-center py-8 px-8">
        <div className="flex items-center space-x-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Your Music Insights</h2>
            <p className="text-gray-400">
              Explore your top artists, tracks, and more.
            </p>
          </div>
          <div className="w-64 h-64 bg-gray-700 rounded-lg"></div>
        </div>
      </section>

      {/* User Info Section */}
      <section className="flex justify-center bg-zinc-800 py-6 px-8">
        <div className="w-16 h-16 bg-gray-600 rounded-full mr-4"></div>{" "}
        {/* pfp placeholder */}
        <div className="text-left mt-2">
          <h3 className="text-lg font-semibold">usernameplaceholder123</h3>
          <p className="text-gray-300">
            Your stats are based on historical data from Spotify.
          </p>
        </div>
      </section>

      {/* Top Artists and Tracks Section */}
      <section className="py-10 px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Top Artists and Tracks
        </h2>
        <div className="flex justify-around">
          {/* Top Artists List */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-1/2 mx-10">
            <h3 className="text-xl font-semibold mb-4">Top Artists</h3>
            <ol className="space-y-2 text-gray-300">
              {topArtistsCur.slice(0, 5).map((artist, index) => (
                <li key={artist.id}>
                  {index + 1}. {artist.name}
                </li>
              ))}
            </ol>
          </div>

          {/* Top Tracks List */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-1/2 mx-10">
            <h3 className="text-xl font-semibold mb-4">Top Tracks</h3>
            <ol className="space-y-2 text-gray-300">
              {topTracksCur.slice(0, 5).map((track, index) => (
                <li key={track.id}>
                  {index + 1}. {track.name}
                </li>
              ))}
            </ol>
          </div>

          {/* Top Albums List */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-1/2 mx-10">
            <h3 className="text-xl font-semibold mb-4">Top Albums</h3>
            <ol className="space-y-2 text-gray-300">
              {topAlbumsCur.slice(0, 5).map((album, index) => (
                <li key={album.id}>
                  {index + 1}. {album.name}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Genre Section */}
      <section className="flex justify-center bg-zinc-800 py-6 px-8">
        <hr></hr>
        <h2 className="text-3xl font-bold text-center mb-8">
          Genre Listening Trends
        </h2>
      </section>
    </div>
  );
}

export default Home;
