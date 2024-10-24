import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, {useState, useEffect} from 'react'
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const getTokenFromUrl = () => {
  return window.location.hash.substring(1).split('&').reduce((initial, item) => {
    let parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
    return initial
  }, {});
}

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);


  useEffect(() => {
    console.log("This is what we got from the url: ", getTokenFromUrl());
    const spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";
    console.log("this is our spotify token: ", spotifyToken);

    if (spotifyToken) {
      setSpotifyToken(spotifyToken);

      // use spotify api
      spotifyApi.setAccessToken(spotifyToken);
      console.log("Current Access Token:", spotifyApi.getAccessToken());

      spotifyApi.getMe()
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err)
      });

      setLoggedIn(true);
    }
  }, [])

  const getMyTopArtists = () => {
    spotifyApi.getMyTopArtists()
        .then((response) => {
            console.log(response);
            const artistNames = response.items.map(artist => artist.name);
            setTopArtists(artistNames);
        })
        .catch((err) => {
            console.error('Error fetching top artists:', err);
        });
  };

  const getMyTopTracks = () => {
    spotifyApi.getMyTopTracks()
        .then((response) => {
            console.log(response);
            const trackNames = response.items.map(track => track.name);
            setTopTracks(trackNames);
        })
        .catch((err) => {
            console.error('Error fetching top artists:', err);
        });
  };


  return (
    <>
      {!loggedIn && <a href="http://localhost:8000/login">Login to Spotify</a>}
      {loggedIn && (
        <>
          <div>Yay you logged in!</div>
          <div>Let's try an API call to get some information about you...</div>
          <button onClick={() => getMyTopArtists()}>Get Top Artists</button>
          {topArtists.length > 0 && (
            <div>
              Your Top Artists:
              <ol>
                {topArtists.map((artist, index) => (
                  <li key={index}>{artist}</li>
                ))}
              </ol>
            </div>
          )}
          <button onClick={() => getMyTopTracks()}>Get Top Artists</button>
          {topTracks.length > 0 && (
            <div>
              Your Top Tracks:
              <ol>
                {topTracks.map((track, index) => (
                  <li key={index}>{track}</li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default App
