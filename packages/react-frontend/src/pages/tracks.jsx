import '../index.css'
import React, {useState, useEffect} from 'react'
import { useSpotifyApi } from '../SpotifyContext'; 
import LoadingSpinner from '../components/loadingSpinner';

function TrackPage({time_range}) {
    const spotifyApi = useSpotifyApi();
    const [topArtists, setTopArtists] = useState([]);

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

  return (
    <LoadingSpinner/>
  )
}

export default TrackPage;
