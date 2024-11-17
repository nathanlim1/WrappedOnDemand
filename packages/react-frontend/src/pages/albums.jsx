import '../index.css';
import React, { useState, useEffect } from 'react';
import { useSpotifyApi } from '../SpotifyContext';
import { getTopNArtists, getTopNTracks, getTopNAlbums } from '../utils/getTopUtils';

function AlbumPage({ time_range }) {
  const spotifyApi = useSpotifyApi();

  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topArtists = await getTopNArtists(spotifyApi, 5, time_range);
        setArtists(topArtists);
        
        const topTracks = await getTopNTracks(spotifyApi, 5, time_range);
        setTracks(topTracks);
        
        const topAlbums = await getTopNAlbums(spotifyApi, 5, await getTopNTracks(spotifyApi, 200, time_range));
        setAlbums(topAlbums);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [spotifyApi, time_range]);

  const artistNames = artists.map((a) => a.name);
  const trackNames = tracks.map((t) => t.name);
  const albumNames = albums.map((a) => a.name);

  return (
    <>
      <h1>Top {artists.length} Artists</h1>
      <ul>
        {artistNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
      
      <h1>Top {tracks.length} Tracks</h1>
      <ul>
        {trackNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>

      <h1>Top {albums.length} Albums</h1>
      <ul>
        {albumNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>

      <h1>Top {artists.length} Genres</h1>
      <ul>
      {artists.map((artist, index) => (
          <li key={index}>{artist.genres[0]}</li>
        ))}
      </ul>
    </>
  );
}

export default AlbumPage;