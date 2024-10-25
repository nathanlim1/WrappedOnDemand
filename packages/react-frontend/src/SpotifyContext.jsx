import React, { createContext, useContext, useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const SpotifyApiContext = createContext(null);

export const useSpotifyApi = () => {
    const context = useContext(SpotifyApiContext);
    if (!context) {
        throw new Error('useSpotifyApi must be used within a SpotifyProvider');
    }
    return spotifyApi;
};

// This helps trigger re-renders but keeps the clean API
const useForceUpdate = () => {
    const [, setValue] = useState(0);
    return () => setValue(value => value + 1);
};

export function SpotifyProvider({ children }) {
    const forceUpdate = useForceUpdate();

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('spotify_token');
        if (storedToken) {
            spotifyApi.setAccessToken(storedToken);
            forceUpdate();
        }
    }, []);

    // Override the original setAccessToken method to include re-rendering
    const originalSetAccessToken = spotifyApi.setAccessToken.bind(spotifyApi);
    spotifyApi.setAccessToken = (token) => {
        originalSetAccessToken(token);
        localStorage.setItem('spotify_token', token);
        forceUpdate();
    };

    return (
        <SpotifyApiContext.Provider value={spotifyApi}>
            {children}
        </SpotifyApiContext.Provider>
    );
}

/*
import React, { createContext, useContext } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

// This file makes it so there is one instance of the spotifyApi object
// When the user logs in, the spotifyApi object remembers the user's info
// Because it is remembered, this object can be used throughout the project
// without needing to get the user's login on each page

// This is a package that simplifies Spotify API calls
// I have no idea if it will be enough for our project but its a good start
const spotifyApi = new SpotifyWebApi();

const SpotifyApiContext = createContext(spotifyApi);
export const useSpotifyApi = () => useContext(SpotifyApiContext);

// Function to set the access token globally
export const setSpotifyAccessToken = (token) => {
    spotifyApi.setAccessToken(token);
};

// SpotifyProvider component to wrap the app
export function SpotifyProvider({ children }) {
    return (
        <SpotifyApiContext.Provider value={spotifyApi}>
            {children}
        </SpotifyApiContext.Provider>
    );
}
*/