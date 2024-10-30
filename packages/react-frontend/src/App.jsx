import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx'; 
import Navbar from "./components/navbar/navbar.jsx";
import TimeRangeSelector from "./components/timerangeSelector/timerangeSelector.jsx";
import Page2 from "./pages/page2.jsx";
import Page3 from "./pages/page3.jsx";

// This is the very first page "/"
// It will watch the URL and change whats on the screen based on that
// When the URL is "/" (the page is first opened) it redirects to the login page
// When the URL is "/home" it renders the home page
// Add more pages in the pages directory then add the routes here
const App = () => {
  const [timeRange, setTimeRange] = useState("short_term")
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router>
      <Navbar loggedIn={loggedIn}></Navbar>
      <TimeRangeSelector currentRange={timeRange} setRange={setTimeRange} loggedIn={loggedIn}></TimeRangeSelector>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home setLoggedIn={setLoggedIn} time_range={timeRange}/>} />
        <Route path="/page2" element={<Page2 time_range={timeRange}/>}/>
        <Route path="/page3" element={<Page3 time_range={timeRange}/>}/>
      </Routes>
    </Router>
  );
};

export default App;
