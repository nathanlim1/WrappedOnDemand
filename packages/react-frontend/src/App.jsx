import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx'; 

// This is the very first page "/"
// It will watch the URL and change whats on the screen based on that
// When the URL is "/" (the page is first opened) it redirects to the login page
// When the URL is "/home" it renders the home page
// Add more pages in the pages directory then add the routes here
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
