import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx'; 
import Page2 from "./pages/page2.jsx";
import Page3 from "./pages/page3.jsx";
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
          <Route path="/page2" element={<Page2 time_range={timeRange}/>}/>
          <Route path="/page3" element={<Page3 time_range={timeRange}/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

