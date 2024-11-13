import React from 'react';
import { useSpotifyApi } from '../SpotifyContext'; 


// Display the top 5 (artists/tracks/genre/album).

// Take in argument "artist" or "track" or "genre" or "album"
// Spotify API call to get the top 5, or use one of the functions we made for genres and albums
// Display the information in an interesting way

// Could be the number, name, and their picture from spotify

// Make the component as reusable as possible


function top5Visualizer({time_range, arg}) {
    const spotifyApi = useSpotifyApi();
    const [spotifyToken, setSpotifyToken] = useState("");
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);

    // can i even do this??
    const [topAlbums, setTopAlbums] = useState([]);
    const [topGenres, setTopGenres] = useState([]);
    
    // uses spotifyApi to get users top artists
    const getUsersTopArtists = () => {
        spotifyApi.getMyTopArtists({time_range: time_range})
            .then((response) => {
                console.log(response);
                const artistNames = response.items.map(artist => artist.name);
                setTopArtists(artistNames);
            })
            .catch((err) => {
                console.error('Error fetching top artists:', err);
            });
    };
  
    // uses spotifyApi to get users top tracks
    const getUsersTopTracks = () => {
        spotifyApi.getMyTopTracks({time_range: time_range})
            .then((response) => {
                console.log(response);
                const trackNames = response.items.map(track => track.name);
                setTopTracks(trackNames);
            })
            .catch((err) => {
                console.error('Error fetching top artists:', err);
            });
    };

    // get users top albums using top tracks
    const getUsersTopAlbums = () => {
        // built-in function to get album listing from track data?
        // spotifyApi.topAlbums?
        
    };

    // get users top genres using top tracks and top albums
    const getUsersTopGenres = () => {
        // same thing as album listing
        // built-in function to get genre from track/album data?
        // spotifyApi.topGenres?
    };

    // copy top 5 artists/tracks display layout for albums/genres
    // if topArtists/topTracks/etc are lists, is there a method to only get first 5
    // (assuming most played track etc. is first in the list)
    return (
        <>
        <button onClick={() => getUsersTopArtists()}>Get Top 5 Artists</button>
        {topArtists.length > 0 && (
        <div>
            Your Top 5 Artists:
            <ol>
            {topArtists.map((artist, index) => (
                <li key={index}>{artist}</li>
            ))}
            </ol>
        </div>
        )}
        <button onClick={() => getUsersTopTracks()}>Get Top 5 Tracks</button>
        {topTracks.length > 0 && (
        <div>
            Your Top 5 Tracks:
            <ol>
            {topTracks.map((track, index) => (
                <li key={index}>{track}</li>
            ))}
            </ol>
        </div>
        )}
        
        </>
    );


};

export default top5Visualizer