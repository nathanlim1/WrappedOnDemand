
function AlbumPreview({album, index}) {
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    }
    
    return (
        <div className="w-192 h-128 bg-zinc-800 flex flex-col rounded-lg shadow-lg text-white">
            {/* Header */}
            <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg px-4">
                <h2 className="text-3xl font-semibold">{index}. {album.name}</h2>
            </div>

            {/* Body with left and right */}
            <div className="flex-1 flex space-x-4"> {/* Adjusted the space between sections */}
                {/* Left Section */}
                <div className="w-1/2 p-4 flex flex-col items-center justify-between"> {/* Reduced padding */}
                    <div className="w-72 h-72 bg-gray-600 rounded-lg mb-4">
                        {/* Artist Photo */}
                        <img 
                            src={album.images[0].url} 
                            alt={`${album.name} photo`} 
                            className="w-full h-full object-cover rounded-lg" 
                        />
                    </div> 
                    {/* Popularity */}
                    <div className="text-center text-2xl">
                        <p>By: {album.artists[0].name} </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-1/2 p-4 flex flex-col items-center justify-between"> {/* Reduced padding */}
                    {/* Genres */}
                    <div className="w-72 h-72 bg-gray-600 rounded-lg mb-4 p-4 flex flex-col">
                        {/* Tracklist Title */}
                        <p className="text-center font-semibold text-2xl mb-4">Tracklist</p>

                        {/* Scrollable Genres List */}
                        <ol className="flex-1 overflow-y-auto text-xl list-inside">
                            {album.tracks.items.map((track, index) => (
                                    <li key={index} className="list-decimal">{track.name}</li>
                            ))}
                        </ol>
                    </div>

                    <div className="text-center text-2xl">
                        <p>Release Date: {formatDate(album.release_date)}</p>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default AlbumPreview;