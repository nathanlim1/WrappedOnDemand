import "../index.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpotifyApi } from "../SpotifyContext";
import LoadingSpinner from "../components/loadingSpinner";
import GenreBarGraph from "../components/visualizations/genreBarGraph";
import { getUsersTopNGenreCounts } from "../utils/getGenres.js";
import AlbumGridImage from "../components/visualizations/albumGridImage";
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

function Home({ setLoggedIn, time_range, genreCounts }) {
  const genreChartYMax = Math.min(Math.ceil((Math.max(...Object.values(genreCounts).flat().map(gc => gc[1])) + 1) / 10) * 10, 100);
  const spotifyApi = useSpotifyApi();
  const [spotifyToken, setSpotifyToken] = useState("");
  const [username, setUsername] = useState("username");
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  // Genre Data
  const [genreData1Month, setGenreData1Month] = useState([]);
  const [genreData6Month, setGenreData6Month] = useState([]);
  const [genreDataLifetime, setGenreDataLifetime] = useState([]);
  const [genreDataCur, setGenreDataCur] = useState([]);

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
  }, [spotifyApi, setLoggedIn]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      fetchAllTopData();

      // Get the user's name and profile picture
      spotifyApi.getMe().then((data) => {
        setUsername(data.display_name);
        setProfilePicture(data.images?.[0]?.url || "");
      });
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

      const genres1Month = getUsersTopNGenreCounts(10, artists1Month);
      setGenreData1Month(genres1Month);

      // Fetch all medium term data
      const [artists6Month, tracks6Month] = await Promise.all([
        getTopNArtists(spotifyApi, 50, "medium_term"),
        getTopNTracks(spotifyApi, 50, "medium_term"),
      ]);
      const albums6Month = await getTopNAlbums(spotifyApi, 50, tracks6Month);

      setTopArtists6Month(artists6Month);
      setTopTracks6Month(tracks6Month);
      setTopAlbums6Month(albums6Month);

      const genres6Month = getUsersTopNGenreCounts(10, artists6Month);
      setGenreData6Month(genres6Month);

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

      const genresLifetime = getUsersTopNGenreCounts(10, artistsLifetime);
      setGenreDataLifetime(genresLifetime);

      // Initialize the current selections
      updateCurrentData();

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching top data:", error);
    }
  };

  useEffect(() => {
    updateCurrentData();
  }, [
    time_range,
    topArtists1Month,
    topArtists6Month,
    topArtistsLifetime,
    genreData1Month,
    genreData6Month,
    genreDataLifetime,
  ]);

  const updateCurrentData = () => {
    if (time_range === "short_term") {
      setTopArtistsCur(topArtists1Month);
      setTopTracksCur(topTracks1Month);
      setTopAlbumsCur(topAlbums1Month);
      setGenreDataCur(genreCounts["1M"]);
    } else if (time_range === "medium_term") {
      setTopArtistsCur(topArtists6Month);
      setTopTracksCur(topTracks6Month);
      setTopAlbumsCur(topAlbums6Month);
      setGenreDataCur(genreCounts["6M"]);
    } else if (time_range === "long_term") {
      setTopArtistsCur(topArtistsLifetime);
      setTopTracksCur(topTracksLifetime);
      setTopAlbumsCur(topAlbumsLifetime);
      setGenreDataCur(genreCounts["LT"]);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 text-white">
      {/* Intro Section */}
      <section className="flex justify-center items-center px-8">
        <div className="flex items-center space-x-8">
          <div className="ml-28">
            <h2 className="text-4xl font-bold mb-2">Your Music Insights</h2>
            <p className="text-gray-400">
              Explore your top artists, tracks, and more.
            </p>
          </div>
          <div className="scale-75">
            <AlbumGridImage n={5} time_range={time_range} />
          </div>
        </div>
      </section>

      {/* User Info Section */}
      <section className="flex justify-center bg-zinc-800 py-6 px-8">
        <div className="flex bg-gradient-to-br from-zinc-700 rounded-lg shadow-xl p-4 scale-105">
          {" "}
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="User Profile Picture"
              className="w-16 h-16 text-lg rounded-full mr-4"
            />
          ) : (
            // placeholder if pfp could not be retrieved
            <div className="w-16 h-16 bg-gray-600 rounded-full mr-4"></div>
          )}
          <div className="text-left mt-2">
            <h3 className="text-lg font-semibold">{username}</h3>
            <p className="text-gray-300 text-sm">
              Your stats are based on historical data from Spotify.
            </p>
          </div>
        </div>
      </section>

      {/* Top Artists and Tracks Section */}
      <section className="py-10 px-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Top Artists and Tracks
        </h2>
        <hr className="mx-auto w-full max-w-3xl border-t border-gray-600 mb-8" />
        <div className="flex justify-around">
          {/* Top Artists List */}
          <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/2 mx-10 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
              <h3 className="text-xl font-semibold">Top Artists</h3>
            </div>
            <ol className="space-y-2 text-gray-300 mb-4 px-2">
              {topArtistsCur.slice(0, 5).map((artist, index) => (
                <li key={artist.id}>
                  {index + 1}. {artist.name}
                </li>
              ))}
            </ol>
            <Link
              to="/artists"
              className="bg-zinc-900 text-white py-2 px-4 rounded border-2 border-zinc-800 hover:border-[#1db954] hover:bg-[#1db954] hover:text-white transition duration-200"
            >
              View Details
            </Link>
          </div>

          {/* Top Tracks List */}
          <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/2 mx-10 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
              <h3 className="text-xl font-semibold">Top Tracks</h3>
            </div>
            <ol className="space-y-2 text-gray-300 mb-4 px-2">
              {topTracksCur.slice(0, 5).map((track, index) => (
                <li key={track.id}>
                  {index + 1}. {track.name}
                </li>
              ))}
            </ol>
            <Link
              to="/tracks"
              className="bg-zinc-900 text-white py-2 px-4 rounded border-2 border-zinc-800 hover:border-[#1db954] hover:bg-[#1db954] hover:text-white transition duration-200"
            >
              View Details
            </Link>
          </div>

          {/* Top Albums List */}
          <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/2 mx-10 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
              <h3 className="text-xl font-semibold">Top Albums</h3>
            </div>
            <ol className="space-y-2 text-gray-300 mb-4 px-2">
              {topAlbumsCur.slice(0, 5).map((album, index) => (
                <li key={album.id}>
                  {index + 1}. {album.name}
                </li>
              ))}
            </ol>
            <Link
              to="/albums"
              className="bg-zinc-900 text-white py-2 px-4 rounded border-2 border-zinc-800 hover:border-[#1db954] hover:bg-[#1db954] hover:text-white transition duration-200"
            >
              View Details
            </Link>
          </div>
        </div>
      </section>

      {/* Genre Section */}
      <section className="flex justify-center bg-zinc-800 py-6 px-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Genre Listening Trends
          </h2>
          <hr className="w-full mx-auto max-w-lg border-t border-gray-600 mb-8" />
          <GenreBarGraph genreData={genreDataCur} yMax={genreChartYMax}/>
        </div>
      </section>
    </div>
  );
}

export default Home;
