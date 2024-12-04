function TrackPreview({track, index}) {
    
    return (
        <div className="w-192 h-128 bg-zinc-800 flex flex-col rounded-lg shadow-lg text-white">
            {/* Header */}
            <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg px-4">
                <h2 className="text-3xl font-semibold text-center">{index}. {track.name}</h2>
            </div>

            {/* Body for track cover and play button */}
            <div className="flex-1 flex items-center justify-center"> {/* Center content */}

                {/* Track Cover on the Left */}
                <div className="w-1/2 p-4 flex flex-col items-center justify-between"> {/* Center content */}

                    <div className="w-72 h-72 bg-gray-600 rounded-lg mb-4">
                        {/* Track Image */}
                        <img 
                            src={track.album.images[0].url} 
                            alt={`${track.name} photo`} 
                            className="w-full h-full object-cover rounded-lg" 
                        />
                    </div> 
                    {/* By: ARTIST */}
                    <div className="text-center text-2xl">
                        <p>Album: {track.album.name} </p>
                    </div>
                </div>

                {/* Right Grey Text Box */}
                <div className="w-1/2 p-4 flex flex-col items-center justify-between"> {/* Reduced padding */}
                    {/* Grey Box */}
                    <div className="w-72 h-72 bg-gray-600 rounded-lg mb-4 p-4 flex flex-col">
                        {/* Title */}
                        <p className="text-center font-semibold text-2xl mb-4">Info</p>

                        {/* Scrollable List */}
                        <ul className="flex-1 overflow-y-auto text-xl">
                            <p>By: {(track.artists[0].name).toLocaleString()}</p>
                            <p>Track Number: {(track.track_number).toLocaleString()}</p>
                            <p>Popularity Score: {(track.popularity).toLocaleString()}</p>
                        </ul>
                    </div>

                    <div className="text-center text-2xl">
                        <p>Release Date: {(track.album.release_date).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrackPreview