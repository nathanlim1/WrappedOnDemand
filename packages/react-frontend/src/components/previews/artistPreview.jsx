function ArtistPreview({ index, artist }) {
  function capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="w-[660px] h-[440px] bg-zinc-800 flex flex-col  rounded-t-3xl rounded-b-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out hover:scale-105">
      {/* Header */}
      <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-3xl px-4">
        <h2 className="text-3xl font-semibold truncate w-full">
          {index}. {artist.name}
        </h2>
      </div>

      {/* Body with left and right */}
      <div className="flex-1 flex space-x-4">
        {/* Left Section */}
        <div className="w-1/2 p-4 flex flex-col items-center justify-between">
          <div className="w-72 h-72 bg-zinc-600 rounded-lg mb-4">
            {/* Artist Photo */}
            <img
              src={artist.images[0].url}
              alt={`${artist.name} photo`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {/* Popularity */}
          <div className="text-center text-2xl font-bold">
            <p>Popularity: {(artist.popularity / 10).toFixed(1)}/10</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-4 flex flex-col items-center justify-between">
          {/* Genres */}
          <div className="w-72 h-72 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg mb-4 p-4 flex flex-col relative overflow-hidden">
            {/* Genres Title */}
            <p className="text-center font-semibold text-4xl mb-2">Genres</p>

            {/* Scrollable Genres List */}
            <ul className="flex-1 overflow-y-auto text-center text-2xl list-none pr-4">
              {artist.genres.map((g, index) => (
                <li key={index} className="truncate">
                  {capitalizeWords(g)}
                </li>
              ))}
            </ul>

            {/* Fade effect for scrolling genres */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-800 to-transparent pointer-events-none"></div>
          </div>


          <div className="text-center text-2xl font-bold">
            <p>Followers: {artist.followers.total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistPreview;
