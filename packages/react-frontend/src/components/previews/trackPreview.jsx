function TrackPreview({ track, index }) {
  return (
    <div className="w-[660px] h-[440px] bg-zinc-800 flex flex-col rounded-t-3xl rounded-b-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out hover:scale-105">
      {/* Header */}
      <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-3xl px-4">
        <h2 className="text-3xl font-semibold text-center truncate w-full">
          {index}. {track.name}
        </h2>
      </div>

      {/* Body for track cover and additional info */}
      <div className="flex-1 flex items-center justify-center space-x-4">
        {/* Left Section: Track Image */}
        <div className="w-1/2 p-4 flex flex-col items-center justify-center">
          <div className="w-72 h-72 bg-zinc-600 rounded-lg mb-4">
            <img
              src={track.album.images[0].url}
              alt={`${track.name} photo`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Right Section: Artist and Album Info */}
        <div className="w-1/2 p-4 flex flex-col items-center space-y-4">
          {/* Artist Info */}
          <div className="w-72 h-36 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg p-4 flex flex-col">
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-center font-semibold text-3xl mb-1">
                {track.artists.length === 1 ? "Artist" : "Artists"}
              </p>
              <div className="overflow-y-auto max-h-24 w-full text-center text-2xl">
                {track.artists.map((artist, index) => (
                  <p key={index} className="truncate">
                    {artist.name}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Album Info */}
          <div className="w-72 h-36 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg p-4 flex flex-col">
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-center font-semibold text-3xl mb-1">Album</p>
              <p className="text-center text-2xl truncate w-full">
                {track.album.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackPreview;
