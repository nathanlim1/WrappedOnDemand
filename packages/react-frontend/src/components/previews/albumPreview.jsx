function AlbumPreview({ album, index }) {
  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");

    if (!year || !month || !day) {
      return "Unknown";
    }

    return `${month}/${day}/${year}`;
  }

  return (
    <div className="w-[660px] h-[440px] bg-zinc-800 flex flex-col rounded-t-3xl rounded-b-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out hover:scale-105">
      {/* Header */}
      <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-3xl px-4">
        <h2 className="text-3xl font-semibold truncate w-full">
          {index}. {album.name}
        </h2>
      </div>

      {/* Body with left and right */}
      <div className="flex-1 flex space-x-4">
        {/* Left Section */}
        <div className="w-1/2 p-4 flex flex-col items-center justify-between">
          <div className="w-72 h-72 bg-zinc-600 rounded-lg mb-4">
            {/* Album Cover */}
            <img
              src={album.images[0].url}
              alt={`${album.name} photo`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="text-center text-2xl font-bold">
            <p className="truncate w-full">By: {album.artists[0].name}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-4 flex flex-col items-center justify-between">
          {/* Tracklist */}
          <div className="w-72 h-72 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg mb-4 p-4 flex flex-col relative overflow-hidden">
            {/* Tracklist Title */}
            <p className="text-center font-semibold text-4xl mb-2">Tracklist</p>

            {/* Scrollable Tracklist*/}
            <ol className="flex-1 overflow-y-auto text-lg list-decimal list-inside pr-4">
              {album.tracks.items.map((track, index) => (
                <li key={index} className="truncate">
                  {track.name}
                </li>
              ))}
            </ol>
            {/* Fade effect for scrolling tracklist */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-800 to-transparent pointer-events-none"></div>
          </div>

          <div className="text-center text-2xl font-bold">
            <p className="truncate w-full">
              Release Date: {formatDate(album.release_date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumPreview;
