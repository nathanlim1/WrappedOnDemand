import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx'; 
import Page2 from "./pages/artists.jsx";
import Page3 from "./pages/tracks.jsx";
import Page4 from "./pages/albums.jsx";
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
          <Route path="/artists" element={<Page2 time_range={timeRange}/>}/>
          <Route path="/tracks" element={<Page3 time_range={timeRange}/>}/>
          <Route path="/albums" element={<Page4 time_range={timeRange}/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

