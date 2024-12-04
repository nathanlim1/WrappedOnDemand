
function TrackPreview({track, index}) {      
    return (
        <div className="w-[660px] h-[440px] bg-zinc-800 flex flex-col rounded-lg shadow-lg text-white">
            {/* Header */}
            <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg px-4">
                <h2 className="text-3xl font-semibold text-center truncate w-full">{index}. {track.name}</h2>
            </div>
            
            {/* Body for track cover and play button */}
            <div className="flex-1 flex items-center justify-center"> 

                {/* Left side */}
                <div className="w-1/2 p-4 flex flex-col items-center justify-between"> 

                    <div className="w-76 h-76 bg-gray-600 rounded-lg mb-4">
                        {/* Track Image */}
                        <img 
                            src={track.album.images[0].url} 
                            alt={`${track.name} photo`} 
                            className="w-full h-full object-cover rounded-lg" 
                        />
                    </div> 
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-center">
                    {/* First grey box */}
                    <div className="w-72 h-36 bg-gray-600 rounded-lg mb-4 p-4 flex flex-col">
                        {/* Flex container for centering */}
                        <div className="flex flex-col items-center justify-center h-full">
                            {/* Artist Title */}
                            <p className="text-center font-semibold text-3xl">
                                {track.artists.length === 1 ? "Artist" : "Artists"}
                            </p>

                            {/* Artist Name List (scrollable if too many artists) */}
                            <div className="overflow-y-auto max-h-24 w-full">
                                {track.artists.map((artist, index) => (
                                    <p key={index} className="text-center text-2xl truncate w-full">{artist.name}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Second grey box */}
                    <div className="w-72 h-36 bg-gray-600 rounded-lg mb-4 p-4 flex flex-col">
                        <div className="flex flex-col items-center justify-center h-full">
                            {/* Album Title */}
                            <p className="text-center font-semibold text-3xl">Album</p>
                            {/* Album Name */}
                            <p className="text-center text-2xl truncate w-full">{track.album.name}</p>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    )

};

export default TrackPreview;