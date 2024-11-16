import '../index.css'
import React, {useState, useEffect} from 'react'
import { useSpotifyApi } from '../SpotifyContext'; 

function Page2({time_range}) {
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
    <>
        <h3>Page 2</h3>
        <p>This is just here for testing the navbar</p>
        <button onClick={() => getUsersTopArtists()}>Get Top Artists</button>
        {topArtists.length > 0 && (
        <div>
            Your Top Artists:
            <ol>
            {topArtists.map((artist, index) => (
                <li key={index}>{artist}</li>
            ))}
            </ol>
        </div>
        )}
    </>
  )
}

export default Page2;
