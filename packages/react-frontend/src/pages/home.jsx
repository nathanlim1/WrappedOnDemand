import '../index.css'
import React, {useState, useEffect} from 'react'
import { useSpotifyApi } from '../SpotifyContext'; 

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
  const spotifyApi = useSpotifyApi();
  const [spotifyToken, setSpotifyToken] = useState("");
  const [topArtists1Month, setTopArtists1Month] = useState("");
  const [topArtists6Month, setTopArtists6Month] = useState("");
  const [topArtistsLifetime, setTopArtistsLifetime] = useState("");
  const [topTracks1Month, setTopTracks1Month] = useState("");
  const [topTracks6Month, setTopTracks6Month] = useState("");
  const [topTracksLifetime, setTopTracksLifetime] = useState("");
  const [topArtistsCur, setTopArtistsCur] = useState([]);
  const [topTracksCur, setTopTracksCur] = useState([]);

  // when this page is first loaded, we get the user parameters from the URL 
  useEffect(() => {
    const spotifyToken = getTokenFromUrl().access_token;
    // This removes the users credentials from the url, making it cleaner
    window.location.hash = "";

    // Checks login went okay
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);

      // Give the token to the api 
      spotifyApi.setAccessToken(spotifyToken);
      setLoggedIn(true);
      console.log("Current Access Token:", spotifyApi.getAccessToken());

      // Load information that is needed on this page
      setTopArtists1Month(getUsersTopArtists("short_term"));
      setTopArtists6Month(getUsersTopArtists("medium_term"));
      setTopArtistsLifetime(getUsersTopArtists("long_term"));

      setTopTracks1Month(getUsersTopTracks("short_term"));
      setTopTracks6Month(getUsersTopTracks("medium_term"));
      setTopTracksLifetime(getUsersTopTracks("long_term"));

      if (time_range === "short_term") {
        setTopArtistsCur(topArtists1Month);
        setTopTracksCur(topTracks1Month);
      } else if (time_range === "medium_term") {
        setTopArtistsCur(topArtists6Month);
        setTopTracksCur(topTracks6Month);
      } else {
        setTopArtistsCur(topArtistsLifetime);
        setTopTracksCur(topTracksLifetime);
      }
    }
  }, [spotifyApi])

  // uses spotifyApi to get users top artists
  const getUsersTopArtists = (time_range) => {
    spotifyApi.getMyTopArtists({time_range: time_range, limit: 5})
        .then((response) => {
            console.log(response);
            const artistNames = response.items.map(artist => artist.name);
            setTopArtistsCur(artistNames);
        })
        .catch((err) => {
            console.error('Error fetching top artists:', err);
        });
  };  
  
  // uses spotifyApi to get users top tracks
  const getUsersTopTracks = (time_range) => {
    spotifyApi.getMyTopTracks({time_range: time_range, limit: 5})
        .then((response) => {
            console.log(response);
            const trackNames = response.items.map(track => track.name);
            setTopTracksCur(trackNames);
        })
        .catch((err) => {
            console.error('Error fetching top artists:', err);
        });
  };

  return (
    <>
        <h3>Home Page</h3>
        <button onClick={() => getUsersTopArtists(time_range)}>Get Top Artists</button>
        {topArtistsCur.length > 0 && (
        <div>
            Your Top Artists:
            <ol>
            {topArtistsCur.map((artist, index) => (
                <li key={index}>{artist}</li>
            ))}
            </ol>
        </div>
        )}
        <button onClick={() => getUsersTopTracks(time_range)}>Get Top Tracks</button>
        {topTracksCur.length > 0 && (
        <div>
            Your Top Tracks:
            <ol>
            {topTracksCur.map((track, index) => (
                <li key={index}>{track}</li>
            ))}
            </ol>
        </div>
        )}
    </>
  )
}

export default Home;
