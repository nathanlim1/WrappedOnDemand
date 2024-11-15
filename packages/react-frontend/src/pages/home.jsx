import '../index.css';
import React, { useState, useEffect } from 'react';
import { useSpotifyApi } from '../SpotifyContext'; 
import { useLocation } from 'react-router-dom';

// When the user logs in their credentials go to the url
// This gets their credentials
const getTokenFromUrl = () => {
  return window.location.hash.substring(1).split('&').reduce((initial, item) => {
    let parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
    return initial;
  }, {});
};

function Home({ setLoggedIn, time_range }) {
  const spotifyApi = useSpotifyApi();
  const [spotifyToken, setSpotifyToken] = useState("");
  const [topArtists1Month, setTopArtists1Month] = useState([]);
  const [topArtists6Month, setTopArtists6Month] = useState([]);
  const [topArtistsLifetime, setTopArtistsLifetime] = useState([]);
  const [topTracks1Month, setTopTracks1Month] = useState([]);
  const [topTracks6Month, setTopTracks6Month] = useState([]);
  const [topTracksLifetime, setTopTracksLifetime] = useState([]);
  const [topArtistsCur, setTopArtistsCur] = useState([]);
  const [topTracksCur, setTopTracksCur] = useState([]);

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

  // Preload all the data
  useEffect(() => {
    getUsersTopArtists("short_term");
    getUsersTopArtists("medium_term");
    getUsersTopArtists("long_term");

    getUsersTopTracks("short_term");
    getUsersTopTracks("medium_term");
    getUsersTopTracks("long_term");
  }, [useLocation()]);

  // When `time_range` changes, update the `topArtistsCur` and `topTracksCur` accordingly
  useEffect(() => {
    if (time_range === "short_term") {
      setTopArtistsCur(topArtists1Month);
      setTopTracksCur(topTracks1Month);
    } else if (time_range === "medium_term") {
      setTopArtistsCur(topArtists6Month);
      setTopTracksCur(topTracks6Month);
    } else if (time_range === "long_term") {
      setTopArtistsCur(topArtistsLifetime);
      setTopTracksCur(topTracksLifetime);
    }
  }, [time_range, topArtists1Month, topArtists6Month, topArtistsLifetime, topTracks1Month, topTracks6Month, topTracksLifetime, useLocation()]);

  // Fetches the user's top artists based on time range
  const getUsersTopArtists = (time_range) => {
    spotifyApi.getMyTopArtists({ time_range: time_range, limit: 50})
      .then((response) => {
        console.log(response);
        const artistNames = response.items.map((artist) => artist.name);
        // Update the state with fetched artist names based on the time range
        if (time_range === 'short_term') {
          setTopArtists1Month(artistNames);
        } else if (time_range === 'medium_term') {
          setTopArtists6Month(artistNames);
        } else if (time_range === 'long_term') {
          setTopArtistsLifetime(artistNames);
        }
      })
      .catch((err) => {
        console.error('Error fetching top artists:', err);
      });
  };

  // Fetches the user's top tracks based on time range
  const getUsersTopTracks = (time_range) => {
    spotifyApi.getMyTopTracks({ time_range: time_range, limit: 50})
      .then((response) => {
        console.log(response);
        const trackNames = response.items.map((track) => track.name);
        // Update the state with fetched track names based on the time range
        if (time_range === 'short_term') {
          setTopTracks1Month(trackNames);
        } else if (time_range === 'medium_term') {
          setTopTracks6Month(trackNames);
        } else if (time_range === 'long_term') {
          setTopTracksLifetime(trackNames);
        }
      })
      .catch((err) => {
        console.error('Error fetching top tracks:', err);
      });
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 text-white">
      {/* Intro Section */}
      <section className="flex justify-center items-center py-8 px-8">
        <div className="flex items-center space-x-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Your Music Insights</h2>
            <p className="text-gray-400">Explore your top artists, tracks, and more.</p>
          </div>
          <div className="w-64 h-64 bg-gray-700 rounded-lg"></div>
        </div>
      </section>
  
      {/* User Info Section */}
      <section className="flex justify-center bg-zinc-800 py-6 px-8">
        <div className="w-16 h-16 bg-gray-600 rounded-full mr-4"></div> {/* pfp placeholder */}
        <div className="text-left mt-2">
          <h3 className="text-lg font-semibold">usernameplaceholder123</h3>
          <p className="text-gray-300">Your stats are based on historical data from Spotify.</p>
        </div>
      </section>
  
      {/* Top Artists and Tracks Section */}
      <section className="py-10 px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Top Artists and Tracks</h2>
        <div className="flex justify-around">
          {/* Top Artists List */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-1/2 mx-4">
            <h3 className="text-xl font-semibold mb-4">Top Artists</h3>
            <ol className="space-y-2 text-gray-300">
              <li>1. Artist 1</li>
              <li>2. Artist 2</li>
              <li>3. Artist 3</li>
              <li>4. Artist 4</li>
              <li>5. Artist 5</li>
            </ol>
          </div>
  
          {/* Top Tracks List */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-1/2 mx-24">
            <h3 className="text-xl font-semibold mb-4 text-center">Top Tracks</h3>
            <ol className="space-y-2 text-gray-300">
              <li>1. Track 1</li>
              <li>2. Track 2</li>
              <li>3. Track 3</li>
              <li>4. Track 4</li>
              <li>5. Track 5</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;