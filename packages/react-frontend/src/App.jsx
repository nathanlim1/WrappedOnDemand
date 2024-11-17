import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx'; 
import ArtistPage from "./pages/artists.jsx";
import TrackPage from "./pages/tracks.jsx";
import AlbumPage from "./pages/albums.jsx";
import Layout from "./components/layout/layout.jsx";

const App = () => {
  const [timeRange, setTimeRange] = useState("short_term")
  const [loggedIn, setLoggedIn] = useState(false);
  
  return (
    <Router>
      <Layout loggedIn={loggedIn} timeRange={timeRange} setTimeRange={setTimeRange}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home setLoggedIn={setLoggedIn} time_range={timeRange}/>} />
          <Route path="/artists" element={<ArtistPage time_range={timeRange}/>}/>
          <Route path="/tracks" element={<c time_range={timeRange}/>}/>
          <Route path="/albums" element={<AlbumPage time_range={timeRange}/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

