import "../index.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import ListItem from "../components/listItem";

function SharingPage({
  loggedIn,
  allArtists,
  allTracks,
  allAlbums,
  username,
  profilePicture,
  userId,
  appUrl,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const location = useLocation();
  const statsRef = useRef(null);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/sharing?user=${userId}`;
    navigator.clipboard.writeText(link);
    alert("Sharing link copied to clipboard!");
  };

  const handleSearch = async (spotifyId) => {
    try {
      if (spotifyId === userId) {
        // on entry to page, if user is logged in, display the logged-in user's data
        setFoundUser({
          username,
          uid: userId,
          profilePicture,
          topArtists: allArtists.slice(0, 20),
          topTracks: allTracks.slice(0, 20),
          topAlbums: allAlbums.slice(0, 20),
        });
      } else {
        // search is not the logged in user; fetch user data based on spotifyId
        const response = await axios.get(`${appUrl}/user_data`, {
          params: { spotifyId },
        });

        const data = response.data;

        setFoundUser({
          username: data.username,
          uid: spotifyId,
          profilePicture: data.profilePicture,
          topArtists: data.allArtists.long_term.slice(0, 20),
          topTracks: data.allTracks.long_term.slice(0, 20),
          topAlbums: data.allAlbums.long_term.slice(0, 20),
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert(
        "User Spotify ID not found. Let them know to link their Spotify account using Wrapped On Demand!"
      );
    }
  };

  // extract 'user' parameter representing spotify ID from URL and fetch data
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");

    if (userParam) {
      handleSearch(userParam);
    } else if (loggedIn && userId) {
      // display logged in user's data by default
      handleSearch(userId);
    }
  }, [location.search, loggedIn, userId]);

  const handleDownloadImage = async () => {
    // download stats as image
    if (statsRef.current) {
      try {
        const canvas = await html2canvas(statsRef.current, {
          useCORS: true,
          scale: 2,
        });
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${foundUser.username}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <div className="bg-zinc-900 text-white pb-20 min-h-screen">
      <div className="flex items-center mb-4 justify-center pt-5">
        {/* Logo */}
        <div className="logo-green w-12 h-12 mr-4 bg-[#1DB954]"></div>
        <h1 className="text-5xl font-bold pr-2">Wrapped On Demand</h1>
      </div>
      {/* User Info Section */}
      {loggedIn && (
        <section className="flex flex-col items-center pt-6 px-8">
          <button
            className="flex bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl p-4 shadow-lg border border-transparent hover:border-[#00FF7F] transform transition-transform hover:scale-105 hover:shadow-xl focus:outline-none"
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
        <div className="flex w-full max-w-4xl bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-3xl shadow-xl">
          {/* Left Side */}
          <div className="w-1/2 p-6 opacity-95">
            <h2 className="text-2xl font-bold mb-2">Search for Friends</h2>
            <p className="text-gray-400">
              Enter their Spotify ID to view their lifetime stats
            </p>
          </div>
          {/* Right Side */}
          <div className="w-1/2 p-6 flex flex-col items-center">
            <div className="flex items-center w-full">
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
        </div>
      </section>

      {/* Found User Stats */}
      {foundUser && (
        <>
          {/* Found User Info and Download */}
          <button
            className="flex items-center space-x-4 mb-6 bg-zinc-800 rounded-3xl border border-transparent hover:border-[#00FF7F] transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none"
            onClick={handleDownloadImage}
          >
            {foundUser.profilePicture ? (
              <img
                src={foundUser.profilePicture}
                alt="Found User Profile"
                className="w-16 h-16 text-lg rounded-full my-2"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
            )}
            <div className="text-left">
              <h3 className="text-lg font-semibold">{foundUser.username}</h3>
              <p className="text-gray-300 text-sm">Download stats as .png</p>
            </div>
          </button>

          {/* Top Artists, Tracks, and Albums Section */}
          <section className="py-10 px-8">
            
            <div className="grid grid-cols-3 gap-8">
              {/* Top Artists */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
                  <h3 className="text-xl font-semibold">Top Artists</h3>
                </div>
                <div className="space-y-2 text-gray-300 mb-4 px-4">
                  {foundUser.topArtists.slice(0, 20).map((artist, index) => (
                    <ListItem
                      key={index}
                      index={index + 1}
                      image={artist.images[0].url}
                      name={artist.name}
                    />
                  ))}
                </div>
              </div>

              {/* Top Tracks */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
                  <h3 className="text-xl font-semibold">Top Tracks</h3>
                </div>
                <div className="space-y-2 text-gray-300 mb-4 px-4">
                  {foundUser.topTracks.slice(0, 20).map((track, index) => (
                    <ListItem
                      key={index}
                      index={index + 1}
                      image={track.album.images[0].url}
                      name={track.name}
                    />
                  ))}
                </div>
              </div>

              {/* Top Albums */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
                  <h3 className="text-xl font-semibold">Top Albums</h3>
                </div>
                <div className="space-y-2 text-gray-300 mb-4 px-4">
                  {foundUser.topAlbums.slice(0, 20).map((album, index) => (
                    <ListItem
                      key={index}
                      index={index + 1}
                      image={album.images[0].url}
                      name={album.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <h3 className="text-gray-300 text-sm mt-4">
              Stats Provided by Wrapped On Demand | Spotify ID: {foundUser.uid}
            </h3>
          </section>
        </>
      )}
    </div>
  );
}

export default SharingPage;
