import '../App.css'
import React, {useState, useEffect} from 'react'
import { useSpotifyApi } from '../SpotifyContext'; // needs ot be in eveyr page 

// When the user logs in their credentials go to the url
// This gets their credentials
const getTokenFromUrl = () => {
  return window.location.hash.substring(1).split('&').reduce((initial, item) => {
    let parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
    return initial
  }, {});
}

function Home({setLoggedIn, time_range}) {
  const spotifyApi = useSpotifyApi(); //needs to be in every page
  const [spotifyToken, setSpotifyToken] = useState("");
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  // when this page is first loaded, we get the user parameters from the URL 
  useEffect(() => {
    console.log("This is what we got from the url: ", getTokenFromUrl());
    const spotifyToken = getTokenFromUrl().access_token;
    // This removes the users credentials from the url, making it cleaner
    window.location.hash = "";
    console.log("this is our spotify token: ", spotifyToken);

    if (spotifyToken) {
      setSpotifyToken(spotifyToken);

      // Give the token to the api 
      spotifyApi.setAccessToken(spotifyToken);
      setLoggedIn(true);
      console.log("Current Access Token:", spotifyApi.getAccessToken());

      // Just a test to see if we can access the user, this does nothing
      spotifyApi.getMe()
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }, [spotifyApi])

  // uses spotifyApi to get users top artists
  const getUsersTopArtists = () => {
    spotifyApi.getMyTopArtists({time_range: time_range})
        .then((response) => {
            console.log(response);
            const artistNames = response.items.map(artist => artist.name);
            setTopArtists(artistNames);
        })
        .catch((err) => {
            console.error('Error fetching top artists:', err);
        });
  };  
  
  // uses spotifyApi to get users top tracks
  const getUsersTopTracks = () => {
    spotifyApi.getMyTopTracks({time_range: time_range})
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
        <h3>Home Page</h3>
        <button onClick={() => getUsersTopArtists()}>Get Top Artists</button>
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
        <button onClick={() => getUsersTopTracks()}>Get Top Tracks</button>
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
  )
}

export default Home;
