import "../index.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function SharingPage({ loggedIn, username, profilePicture, spotifyId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const location = useLocation();

  // Handle copy link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/sharing?user=${spotifyId}`;
    navigator.clipboard.writeText(link);
    alert("Sharing link copied to clipboard!");
  };

  // Handle search
  const handleSearch = async (spotifyId) => {
    try {
      console.log("Searching for Spotify ID:", spotifyId);

      // fetch user data based on spotifyId
      const response = await axios.get("http://localhost:8000/user_data", {
        params: { spotifyId },
      });

      const data = response.data;

      setFoundUser({
        username: data.username,
        profilePicture: data.profilePicture,
        topArtists: data.allArtists.short_term.slice(0, 10),
        topTracks: data.allTracks.short_term.slice(0, 10),
        topAlbums: data.allAlbums.short_term.slice(0, 10),
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("User not found.");
    }
  };

  // extract 'user' parameter representing spotify ID from URL and fetch data
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");

    if (userParam) {
      // automatically search for the user specified in the URL
      handleSearch(userParam);
    }
  }, [location.search]);

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 text-white pb-20 min-h-screen">
      <div className="flex items-center mb-4 justify-center pt-5">
        <img
          src="https://i.imgur.com/bgy6nAs.png"
          alt="Wrapped On Demand Logo White"
          className="w-10 h-10 mr-3"
        />
        <h1 className="text-5xl font-bold">Wrapped On Demand</h1>
      </div>
      {/* User Info Section */}
      {loggedIn && (
        <section className="flex flex-col items-center pt-6 px-8">
          <button
            className="flex bg-zinc-800 rounded-lg p-4 shadow-lg border border-transparent hover:border-[#00FF7F] transform transition-transform hover:scale-105 hover:shadow-xl focus:outline-none"
            onClick={handleCopyLink}
          >
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
                Click here to get a link to share your stats
              </p>
            </div>
          </button>
        </section>
      )}

      {!loggedIn && (
        <section className="flex flex-col items-center px-8">
          <h3 className="text-lg pb-3">Want to see your own stats?</h3>
          <Link
            to="/login"
            className="bg-[#1ED760] text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 hover:shadow-xl hover:text-white focus:outline-none"
            style={{ border: "none", textDecoration: "none" }}
          >
            Take Me To Login
          </Link>
        </section>
      )}

      <hr className="w-full mt-5 mx-auto max-w-lg border-t border-gray-600" />

      {/* Search Section */}
      <section className="flex justify-center items-center py-10 px-8">
        <div className="flex w-full max-w-4xl bg-zinc-800 rounded-3xl shadow-xl">
          {/* Left Side */}
          <div className="w-1/2 p-6 opacity-90">
            <h2 className="text-2xl font-bold mb-2">Search for Friends</h2>
            <p className="text-gray-400">
              Enter their Spotify ID to view their stats
            </p>
          </div>
          {/* Right Side */}
          <div className="w-1/2 p-6 flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full p-4 pl-12 pr-4 rounded-full bg-zinc-700 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1db954] transition duration-300"
                placeholder="Enter Spotify ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img
                src="https://icones.pro/wp-content/uploads/2021/02/loupe-et-icone-de-recherche-de-couleur-grise.png"
                alt="Search Icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 pointer-events-none"
              />
            </div>
            <button
              className="ml-4 bg-gradient-to-r from-[#1db954] to-[#17a44b] text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none"
              onClick={() => handleSearch(searchQuery)}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Found User Stats */}
      {foundUser && (
        <section className="flex flex-col items-center py-10 px-8">
          {/* Found User Info */}
          <div className="flex items-center space-x-4 mb-6">
            {foundUser.profilePicture ? (
              <img
                src={foundUser.profilePicture}
                alt="Found User Profile"
                className="w-16 h-16 text-lg rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
            )}
            <div className="text-left">
              <h3 className="text-lg font-semibold">{foundUser.username}</h3>
            </div>
          </div>

          {/* Found User Stats */}
          <div className="w-full max-w-4xl">
            <div className="flex justify-around">
              {/* Top Artists */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/3 mx-4 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
                  <h3 className="text-xl font-semibold">Top Artists</h3>
                </div>
                <ol className="space-y-2 text-gray-300 mb-4 px-2">
                  {foundUser.topArtists.map((artist, index) => (
                    <li key={artist.id}>
                      {index + 1}. {artist.name}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Top Tracks */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/3 mx-4 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
                  <h3 className="text-xl font-semibold">Top Tracks</h3>
                </div>
                <ol className="space-y-2 text-gray-300 mb-4 px-2">
                  {foundUser.topTracks.map((track, index) => (
                    <li key={track.id}>
                      {index + 1}. {track.name}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Top Albums */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md w-1/3 mx-4 pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
                  <h3 className="text-xl font-semibold">Top Albums</h3>
                </div>
                <ol className="space-y-2 text-gray-300 mb-4 px-2">
                  {foundUser.topAlbums.map((album, index) => (
                    <li key={album.id}>
                      {index + 1}. {album.name}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default SharingPage;
