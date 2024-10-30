import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx'; 
import Navbar from "./components/navbar/navbar.jsx";
import Page2 from "./pages/page2.jsx";
import Page3 from "./pages/page3.jsx";

// This is the very first page "/"
// It will watch the URL and change whats on the screen based on that
// When the URL is "/" (the page is first opened) it redirects to the login page
// When the URL is "/home" it renders the home page
// Add more pages in the pages directory then add the routes here
const App = () => {
  return (
    <Router>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/page2" element={<Page2 />}/>
        <Route path="/page3" element={<Page3 />}/>
      </Routes>
    </Router>
  );
};

export default App;
