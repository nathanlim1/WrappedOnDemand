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
  time_range
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const location = useLocation();
  const statsRef = useRef(null);

  // Current selections based on time_range
  const [topArtistsCur, setTopArtistsCur] = useState([]);
  const [topTracksCur, setTopTracksCur] = useState([]);
  const [topAlbumsCur, setTopAlbumsCur] = useState([]);
  const [titleText, setTitleText] = useState("")
  const [displayedUsername, setDisplayedUsername] = useState("")
  const [showingMe, setShowingMe] = useState(true)

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
          topArtists: allArtists,
          topTracks: allTracks,
          topAlbums: allAlbums,
        });
        setShowingMe(true);
        setDisplayedUsername(username);
      } else {
        // search is not the logged in user; fetch user data based on spotifyId
        const response = await axios.get(`${appUrl}/user_data`, {
          params: { spotifyId },
        });

        const data = response.data;
        console.log(data)
        console.log(data.username)

        setFoundUser({
          username: data.username,
          uid: spotifyId,
          profilePicture: data.profilePicture,
          topArtists: data.allArtists,
          topTracks: data.allTracks,
          topAlbums: data.allAlbums,
        });
        setShowingMe(false);
        setDisplayedUsername(data.username);
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

  // Update page when the time range changes
  useEffect(() => {
    if (foundUser) {
      if (showingMe) {
        if (time_range === "short_term") {
          setTitleText("1 Month")
          setTopArtistsCur(foundUser.topArtists["1M"])
          setTopTracksCur(foundUser.topTracks["1M"])
          setTopAlbumsCur(foundUser.topAlbums["1M"])
        }
        else if (time_range === "medium_term") {
          setTitleText("6 Month")
          setTopArtistsCur(foundUser.topArtists["6M"])
          setTopTracksCur(foundUser.topTracks["6M"])
          setTopAlbumsCur(foundUser.topAlbums["6M"])
        }
        else if (time_range === "long_term") {
          setTitleText("Lifetime")
          setTopArtistsCur(foundUser.topArtists["LT"])
          setTopTracksCur(foundUser.topTracks["LT"])
          setTopAlbumsCur(foundUser.topAlbums["LT"])
        }
      } else {
        if (time_range === "short_term") {
          setTitleText("1 Month")
          setTopArtistsCur(foundUser.topArtists.short_term)
          setTopTracksCur(foundUser.topTracks.short_term)
          setTopAlbumsCur(foundUser.topAlbums.short_term)
        }
        else if (time_range === "medium_term") {
          setTitleText("6 Month")
          setTopArtistsCur(foundUser.topArtists.medium_term)
          setTopTracksCur(foundUser.topTracks.medium_term)
          setTopAlbumsCur(foundUser.topAlbums.medium_term)
        }
        else if (time_range === "long_term") {
          setTitleText("Lifetime")
          setTopArtistsCur(foundUser.topArtists.long_term)
          setTopTracksCur(foundUser.topTracks.long_term)
          setTopAlbumsCur(foundUser.topAlbums.long_term)
        }
      }
    }
  }, [time_range, foundUser])

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
        link.download = `${displayedUsername.trim()}'s ${titleText} Summary.png`;
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
      {foundUser && foundUser.uid && (
        <>
          <section
            className="flex flex-col items-center py-10 px-8 bg-zinc-900"
            ref={statsRef}
          >
            {/* Title */}
            <div className="flex items-center justify-center gap-4">
              {foundUser.profilePicture ? (
                <img
                  src={foundUser.profilePicture}
                  alt="Found User Profile"
                  className="w-16 h-16 text-lg rounded-full my-2"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
              )}

              <p className="font-bold text-4xl">
                {`${displayedUsername.trim()}'s ${titleText} Summary`}
              </p>
            </div>

            {/* Top Artists, Tracks, and Albums Section */}
            <section className="py-10 px-8">
              <div className="grid grid-cols-3 gap-8">
                {/* Top Artists */}
                <div className="bg-zinc-800 bg-opacity-50 rounded-lg shadow-md pb-4 transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                  <div className="w-full mb-4 h-12 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg">
                    <h3 className="text-xl font-semibold">Top Artists</h3>
                  </div>
                  <div className="space-y-2 text-gray-300 mb-4 px-4">
                    {topArtistsCur.slice(0, 20).map((artist, index) => (
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
                    {topTracksCur.slice(0, 20).map((track, index) => (
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
                    {topAlbumsCur.slice(0, 20).map((album, index) => (
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

              <h3 className="text-gray-300 text-sm mt-8">
                Stats Provided by Wrapped On Demand | Spotify ID: {foundUser.uid}
              </h3>
            </section>
          </section>

          {/* User Info and Download Section */}
          <div className="flex justify-center space-x-4">
            {/* Found User Download Button */}
            <button
              className="flex items-center space-x-4 w-72 bg-zinc-800 rounded-3xl border border-transparent hover:border-[#00FF7F] transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none"
              onClick={handleDownloadImage}
            >
              {foundUser.profilePicture ? (
                <img
                  src={foundUser.profilePicture}
                  alt="Found User Profile"
                  className="w-16 h-16 text-lg rounded-full my-2 ml-2"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-600 rounded-full ml-2 flex-shrink-0"></div>
              )}
              <div className="text-left">
                <h3 className="text-lg font-semibold">{foundUser.username}</h3>
                <p className="text-gray-300 text-sm">Download this users stats as a .png!</p>
              </div>
            </button>

            {/* Logged In User Share Button */}
            {loggedIn && (
              <button
                className="flex items-center space-x-4 w-72 bg-zinc-800 rounded-3xl border border-transparent hover:border-[#00FF7F] transform transition-transform hover:scale-105 hover:shadow-xl focus:outline-none"
                onClick={handleCopyLink}
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="User Profile"
                    className="w-16 h-16 text-lg rounded-full ml-2"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-full ml-2"></div>
                )}
                <div className="text-left">
                  <h3 className="text-lg font-semibold">{username}</h3>
                  <p className="text-gray-300 text-sm">
                    Share your stats with friends using this link!
                  </p>
                </div>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SharingPage;
