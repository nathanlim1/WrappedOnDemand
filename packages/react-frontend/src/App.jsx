import React, { useEffect, useState } from "react";
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

const App = () => {
  const [timeRange, setTimeRange] = useState("short_term");
  const [loggedIn, setLoggedIn] = useState(false);
  const [contentIsLoaded, setContentIsLoaded] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");

      console.log("Access token:", accessToken);

      if (accessToken) {
        setLoggedIn(true);
        try {
          const response = await axios.get("http://localhost:8000/user_data", {
            params: { access_token: accessToken },
          });

          const data = response.data;

          // Update state with fetched data
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
  }, []);

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
          {loggedIn ? (
            contentIsLoaded ? (
              // Authenticated routes
              <>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route
                  path="/home"
                  element={
                    <Home
                      setLoggedIn={setLoggedIn}
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
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            ) : (
              // Content is loading
              <Route path="*" element={<LoadingSpinner />} />
            )
          ) : (
            // Not logged in
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
