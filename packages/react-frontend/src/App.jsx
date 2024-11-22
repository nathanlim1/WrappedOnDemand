import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx'; 
import ArtistPage from "./pages/artists.jsx";
import TrackPage from "./pages/tracks.jsx";
import AlbumPage from "./pages/albums.jsx";
import Layout from "./components/layout/layout.jsx";
import { useSpotifyApi } from "/src/SpotifyContext";
import {
  getTopNArtists,
  getTopNTracks,
  getTopNAlbums,
} from "./utils/getTopUtils.js";
import LoadingSpinner from "./components/loadingSpinner.jsx";
import { getUsersGeneralGenreCounts } from "./utils/getGenres.js";

const App = () => {
  /*
  Here are the load times of some different options for this value
  50: 5 seconds
  250: 11 seconds
  500: 17 seconds
  750: 21 seconds (first number to get 100+ albums for each time frame)
  1000: 26 seconds 
  */
  const MAX_NUMBER_TO_BE_LOADED = 750;
  const NUM_ARTISTS_FOR_GENRE_CALCULATION = 10000;

  const spotifyApi = useSpotifyApi();
  const [timeRange, setTimeRange] = useState("short_term")
  const [loggedIn, setLoggedIn] = useState(false);
  const [contentIsLoaded, setContentIsLoaded] = useState(false);

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
    const fetchAllData = async () => {
      if (loggedIn) {
        // Fetch all artists
        console.log("Loading all Artists");
        setAllArtists1M(await getTopNArtists(spotifyApi, MAX_NUMBER_TO_BE_LOADED, "short_term"));
        setAllArtists6M(await getTopNArtists(spotifyApi, MAX_NUMBER_TO_BE_LOADED, "medium_term"));
        setAllArtistsLT(await getTopNArtists(spotifyApi, MAX_NUMBER_TO_BE_LOADED, "long_term"));
        
        // Fetch all tracks
        console.log("Loading all Tracks");
        setAllTracks1M(await getTopNTracks(spotifyApi, MAX_NUMBER_TO_BE_LOADED, "short_term"));
        setAllTracks6M(await getTopNTracks(spotifyApi, MAX_NUMBER_TO_BE_LOADED, "medium_term"));
        setAllTracksLT(await getTopNTracks(spotifyApi, MAX_NUMBER_TO_BE_LOADED, "long_term"));
      }
    }

    fetchAllData();
  }, [loggedIn]);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (loggedIn && allTracks1M.length > 0 && allTracks6M.length > 0 && allTracksLT.length > 0) {
        // Fetch all albums after the tracks have loaded
        console.log("Loading all Albums");
        setAllAlbums1M(await getTopNAlbums(spotifyApi, MAX_NUMBER_TO_BE_LOADED, allTracks1M));
        setAllAlbums6M(await getTopNAlbums(spotifyApi, MAX_NUMBER_TO_BE_LOADED, allTracks6M));
        setAllAlbumsLT(await getTopNAlbums(spotifyApi, MAX_NUMBER_TO_BE_LOADED, allTracksLT));
        console.log("Genre counts LT:", genreCountsLT);
        setContentIsLoaded(true);
      }
    }

    fetchAlbums();
  }, [allTracks1M, allTracks6M, allTracksLT]);

  // When the artists have loaded, calculate the genre counts
  useEffect(() => {
    if (allArtists1M.length > 0) {
      setGenreCounts1M(getUsersGeneralGenreCounts(allArtists1M));
      console.log("Genre counts 1M:", genreCounts1M);
    }
  }, [allArtists1M]);
  
  useEffect(() => {
    if (allArtists6M.length > 0) {
      setGenreCounts6M(getUsersGeneralGenreCounts(allArtists6M));
      console.log("Genre counts 6M:", genreCounts6M);
    }
  }, [allArtists6M]);
  
  useEffect(() => {
    if (allArtistsLT.length > 0) {
      setGenreCountsLT(getUsersGeneralGenreCounts(allArtistsLT));
      console.log("Genre counts LT:", genreCountsLT);
    }
  }, [allArtistsLT]);
  
  

  if (loggedIn && !contentIsLoaded) {
    return (<LoadingSpinner/>)
  }

  return (
    <Router>
      <Layout loggedIn={loggedIn} timeRange={timeRange} setTimeRange={setTimeRange}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={
            <Home 
              setLoggedIn={setLoggedIn} 
              time_range={timeRange}
              genreCounts={{"1M": genreCounts1M, "6M": genreCounts6M, "LT": genreCountsLT}}
            />}
          />
          <Route path="/artists" element={
            <ArtistPage 
              time_range={timeRange} 
              allArtists={{"1M": allArtists1M, "6M": allArtists6M, "LT": allArtistsLT}}
            />}
          />
          <Route path="/tracks" element={
              <TrackPage 
                time_range={timeRange}
                allTracks={{"1M": allTracks1M, "6M": allTracks6M, "LT": allTracksLT}}
              />}
            />
          <Route path="/albums" element={
            <AlbumPage 
              time_range={timeRange}
              allAlbums={{"1M": allAlbums1M, "6M": allAlbums6M, "LT": allAlbumsLT}}
            />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

