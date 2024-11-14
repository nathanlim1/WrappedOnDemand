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
    <>
      <h3 className="text-3xl font-bold">Home Page</h3>
      
      {/* Display the current top artists */}
      {topArtistsCur.length > 0 && (
        <div>
          <p className="font-bold">Your Top Artists:</p>
          <ol>
            {topArtistsCur.map((artist, index) => (
              <li>{index + 1}. {artist}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Display the current top tracks */}
      {topTracksCur.length > 0 && (
        <div>
          <p className="font-bold">Your Top Tracks:</p>          
          <ol>
            {topTracksCur.map((track, index) => (
              <li>{index + 1}. {track}</li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}

export default Home;