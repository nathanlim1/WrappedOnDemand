import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import ArtistPage from "./pages/artists.jsx";
import TrackPage from "./pages/tracks.jsx";
import AlbumPage from "./pages/albums.jsx";
import SharingPage from "./pages/sharing.jsx";
import Layout from "./components/layout/layout.jsx";
import LoadingSpinner from "./components/loadingSpinner.jsx";
import axios from "axios";
import { useSpotifyApi } from "./SpotifyContext.jsx";

// const DEV_URL = "http://localhost:8000";
const PROD_FE_URL = "https://ashy-rock-030ba391e.4.azurestaticapps.net";
const PROD_BE_URL = "https://wrappedondemand.azurewebsites.net";

const App = () => {
  const feUrl = PROD_FE_URL;
  const beUrl = PROD_BE_URL;
  const [timeRange, setTimeRange] = useState("short_term");
  const [loggedIn, setLoggedIn] = useState(false);
  const [contentIsLoaded, setContentIsLoaded] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [spotifyId, setSpotifyId] = useState("");

  const [allArtists1M, setAllArtists1M] = useState([]);
  const [allArtists6M, setAllArtists6M] = useState([]);
  const [allArtistsLT, setAllArtistsLT] = useState([]);

  const [allTracks1M, setAllTracks1M] = useState([]);
  const [allTracks6M, setAllTracks6M] = useState([]);
  const [allTracksLT, setAllTracksLT] = useState([]);

  const [allAlbums1M, setAllAlbums1M] = useState([]);
  const [allAlbums6M, setAllAlbums6M] = useState([]);
  const [allAlbumsLT, setAllAlbumsLT] = useState([]);

  const [genreCounts1M, setGenreCounts1M] = useState([]);
  const [genreCounts6M, setGenreCounts6M] = useState([]);
  const [genreCountsLT, setGenreCountsLT] = useState([]);

  const spotifyApi = useSpotifyApi();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");

      console.log("Access token:", accessToken);

      if (accessToken) {
        setLoggedIn(true);
        spotifyApi.setAccessToken(accessToken);
        console.log("Set spotifyApi access token to:", accessToken);
        try {
          // Get the user's Spotify ID using the access token
          const userResponse = await axios.get(
            "https://api.spotify.com/v1/me",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          const spotifyId = userResponse.data.id;

          // Now fetch user data from your backend using the Spotify ID
          const response = await axios.get(`${beUrl}/user_data`, {
            params: { spotifyId },
          });

          const data = response.data;

          // Update state with fetched data
          setSpotifyId(spotifyId);
          setUsername(data.username);
          setProfilePicture(data.profilePicture);
          setAllArtists1M(data.allArtists.short_term);
          setAllArtists6M(data.allArtists.medium_term);
          setAllArtistsLT(data.allArtists.long_term);
          setAllTracks1M(data.allTracks.short_term);
          setAllTracks6M(data.allTracks.medium_term);
          setAllTracksLT(data.allTracks.long_term);
          setAllAlbums1M(data.allAlbums.short_term);
          setAllAlbums6M(data.allAlbums.medium_term);
          setAllAlbumsLT(data.allAlbums.long_term);
          setGenreCounts1M(data.genreCounts.short_term);
          setGenreCounts6M(data.genreCounts.medium_term);
          setGenreCountsLT(data.genreCounts.long_term);

          setContentIsLoaded(true);

          // Clear the URL hash
          window.location.hash = "";
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }

      // Indicate that authentication check is complete
      setAuthChecked(true);
    };

    fetchData();
  }, [spotifyApi]);

  if (!authChecked) {
    // Still checking auth state, show a loading indicator
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Layout
        loggedIn={loggedIn}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      >
        <Routes>
          {/* Sharing page accessible regardless of whether they are logged in or not */}
          <Route
            path="/sharing"
            element={
              <SharingPage
                loggedIn={loggedIn}
                username={username}
                allArtists={allArtistsLT}
                allTracks={allTracksLT}
                allAlbums={allAlbumsLT}
                profilePicture={profilePicture}
                userId={spotifyId}
                appUrl={beUrl}
              />
            }
          />
          {loggedIn ? (
            contentIsLoaded ? (
              // Authenticated routes
              <>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route
                  path="/home"
                  element={
                    <Home
                      time_range={timeRange}
                      genreCounts={{
                        "1M": genreCounts1M,
                        "6M": genreCounts6M,
                        LT: genreCountsLT,
                      }}
                      allArtists={{
                        "1M": allArtists1M,
                        "6M": allArtists6M,
                        LT: allArtistsLT,
                      }}
                      allTracks={{
                        "1M": allTracks1M,
                        "6M": allTracks6M,
                        LT: allTracksLT,
                      }}
                      allAlbums={{
                        "1M": allAlbums1M,
                        "6M": allAlbums6M,
                        LT: allAlbumsLT,
                      }}
                      username={username}
                      profilePicture={profilePicture}
                    />
                  }
                />
                <Route
                  path="/artists"
                  element={
                    <ArtistPage
                      time_range={timeRange}
                      allArtists={{
                        "1M": allArtists1M,
                        "6M": allArtists6M,
                        LT: allArtistsLT,
                      }}
                    />
                  }
                />
                <Route
                  path="/tracks"
                  element={
                    <TrackPage
                      time_range={timeRange}
                      allTracks={{
                        "1M": allTracks1M,
                        "6M": allTracks6M,
                        LT: allTracksLT,
                      }}
                      spotifyApi={spotifyApi}
                    />
                  }
                />
                <Route
                  path="/albums"
                  element={
                    <AlbumPage
                      time_range={timeRange}
                      allAlbums={{
                        "1M": allAlbums1M,
                        "6M": allAlbums6M,
                        LT: allAlbumsLT,
                      }}
                    />
                  }
                />
                {/* Catch-all route for logged-in users */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            ) : (
              // Content is loading
              <Route path="*" element={<LoadingSpinner />} />
            )
          ) : (
            // Not logged in
            <>
              <Route path="/login" element={<Login appUrl={feUrl} />} />
              {/* Catch-all route for not logged-in users */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
