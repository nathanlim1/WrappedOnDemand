import React, { createContext, useContext, useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

// This is the top level spotify api object
// It will store user login for the entire page
// Use this import on each page to use the spotifyApi object:
// import { useSpotifyApi } from '../SpotifyContext'; 


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
