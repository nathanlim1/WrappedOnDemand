import "../index.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GenreBarGraph from "../components/visualizations/genreBarGraph";
import { useSpotifyApi } from "/src/SpotifyContext";
import ImageGrid from "../components/visualizations/ImageGrid";
import { getAlbumImages } from "../utils/getImages";
import PopularityBar from "../components/popularityBar";

function Home({
  time_range,
  genreCounts,
  allArtists,
  allTracks,
  allAlbums,
  username,
  profilePicture,
}) {
  // Current selections based on time_range
  const [topArtistsCur, setTopArtistsCur] = useState([]);
  const [topTracksCur, setTopTracksCur] = useState([]);
  const [topAlbumsCur, setTopAlbumsCur] = useState([]);
  const [genreDataCur, setGenreDataCur] = useState([]);

  // New state variables for image URLs
  const [albumImageUrls, setAlbumImageUrls] = useState([]);

  // Calculate genreChartYMax based on genreCounts
  const genreChartYMax = Math.min(
    Math.ceil(
      (Math.max(
        ...Object.values(genreCounts)
          .flat()
          .map((gc) => gc[1])
      ) +
        1) /
        10
    ) * 10,
    100
  );

  // Update current data based on time_range
  useEffect(() => {
    updateCurrentData();
  }, [time_range, allArtists, allTracks, allAlbums, genreCounts]);

  const updateCurrentData = () => {
    if (time_range === "short_term") {
      setTopArtistsCur(allArtists["1M"]);
      setTopTracksCur(allTracks["1M"]);
      setTopAlbumsCur(allAlbums["1M"]);
      setGenreDataCur(genreCounts["1M"]);
    } else if (time_range === "medium_term") {
      setTopArtistsCur(allArtists["6M"]);
      setTopTracksCur(allTracks["6M"]);
      setTopAlbumsCur(allAlbums["6M"]);
      setGenreDataCur(genreCounts["6M"]);
    } else if (time_range === "long_term") {
      setTopArtistsCur(allArtists["LT"]);
      setTopTracksCur(allTracks["LT"]);
      setTopAlbumsCur(allAlbums["LT"]);
      setGenreDataCur(genreCounts["LT"]);
    }

    // Extract image URLs whenever data updates
    setAlbumImageUrls(getAlbumImages(allAlbums[time_rangeKey(time_range)]));
  };

  // Helper function to map time_range to keys
  const time_rangeKey = (time_range) => {
    if (time_range === "short_term") return "1M";
    if (time_range === "medium_term") return "6M";
    if (time_range === "long_term") return "LT";
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 text-white pb-20">
      {/* Intro Section */}
      <section className="flex justify-center items-center px-8">
        <div className="flex items-center space-x-8">
          <div className="ml-24">
            <div className="flex items-center justify-center pt-10">
              {/* Logo */}
              <div className="logo-green w-12 h-12 mr-4 bg-[#1DB954]"></div>
              <h1 className="text-5xl font-bold">Wrapped On Demand</h1>
            </div>
            <hr className="w-full my-4 mx-auto max-w-md border-t border-gray-600" />
            <p className="text-gray-400">
              Explore and share your top artists, tracks, and more.
            </p>
          </div>
          <div className="scale-75">
            <div className="relative group">
              <ImageGrid
                imageUrls={albumImageUrls.slice(0, 2500)} // match grid size (50x50 = 2500)
                gridSize={50} // use max grid size of up to 50x50
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Info Section */}
      <section className="flex justify-center bg-zinc-800 py-6 px-8">
        <div className="flex bg-gradient-to-br from-zinc-700 rounded-lg shadow-xl p-4 scale-105">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="User Profile"
              className="w-16 h-16 text-lg rounded-full mr-4"
            />
          ) : (
            // Placeholder if profile picture could not be retrieved
            <div className="w-16 h-16 bg-gray-600 rounded-full mr-4"></div>
          )}
          <div className="text-left mt-2">
            <h3 className="text-lg font-semibold">{username}</h3>
            <p className="text-gray-300 text-sm">
              Your stats are based on historical data from Spotify.
            </p>
          </div>
        </div>
      </section>

      {/* Top Artists, Tracks, and Albums Section */}
      <section className="py-10 px-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Top Artists, Tracks, and Albums
        </h2>
        <hr className="mx-auto w-full max-w-3xl border-t border-gray-600 mb-8" />
        <div className="flex justify-around">
          {/* Top Artists List */}
          <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/2 mx-10 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
              <h3 className="text-xl font-semibold">Top Artists</h3>
            </div>
            <ol className="space-y-2 text-gray-300 mb-4 px-2">
              {topArtistsCur.slice(0, 5).map((artist, index) => (
                <li key={artist.id}>
                  {index + 1}. {artist.name}
                </li>
              ))}
            </ol>
            <Link
              to="/artists"
              className="bg-zinc-900 text-white py-2 px-4 rounded border-2 border-zinc-800 hover:border-[#1db954] hover:bg-[#1db954] hover:text-white transition duration-200"
            >
              View Details
            </Link>
          </div>

          {/* Top Tracks List */}
          <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/2 mx-10 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
              <h3 className="text-xl font-semibold">Top Tracks</h3>
            </div>
            <ol className="space-y-2 text-gray-300 mb-4 px-2">
              {topTracksCur.slice(0, 5).map((track, index) => (
                <li key={track.id}>
                  {index + 1}. {track.name}
                </li>
              ))}
            </ol>
            <Link
              to="/tracks"
              className="bg-zinc-900 text-white py-2 px-4 rounded border-2 border-zinc-800 hover:border-[#1db954] hover:bg-[#1db954] hover:text-white transition duration-200"
            >
              View Details
            </Link>
          </div>

          {/* Top Albums List */}
          <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/2 mx-10 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
              <h3 className="text-xl font-semibold">Top Albums</h3>
            </div>
            <ol className="space-y-2 text-gray-300 mb-4 px-2">
              {topAlbumsCur.slice(0, 5).map((album, index) => (
                <li key={album.id}>
                  {index + 1}. {album.name}
                </li>
              ))}
            </ol>
            <Link
              to="/albums"
              className="bg-zinc-900 text-white py-2 px-4 rounded border-2 border-zinc-800 hover:border-[#1db954] hover:bg-[#1db954] hover:text-white transition duration-200"
            >
              View Details
            </Link>
          </div>
        </div>
      </section>

      {/* Popularity Bar */}
      <PopularityBar artists={topArtistsCur} />

      {/* Genre Section */}
      <section className="flex justify-center py-6 px-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Genre Listening Trends
          </h2>
          <hr className="w-full mx-auto max-w-lg border-t border-gray-600 mb-8" />
          <GenreBarGraph genreData={genreDataCur} yMax={genreChartYMax} />
        </div>
      </section>
    </div>
  );
}

export default Home;
