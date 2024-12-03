
function TrackPreview({track, index}) {      
    return (
        <div className="w-192 h-128 bg-zinc-800 flex flex-col rounded-lg shadow-lg text-white">
            {/* Header */}
            <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg px-4">
                
                <h2 className="text-3xl font-semibold text-center px-4 break-words line-clamp-2">{index}. {track.name}</h2>
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
                        <p>By: {track.artists[0].name} </p>
                    </div>
                </div>

                {/* Play Button and Play Header */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => console.log(`Playing ${track.name}`)}
                        className="w-[300px] h-[300px] bg-[#1db954] rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-64 w-64 text-black"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M9 5c0.5-0.5 1-0.5 1.5 0l9 7c0.5 0.5 0.5 1 0 1.5l-9 7c-0.5 0.5-1 0.5-1.5 0v-16z" />
                        </svg>
                    </button>
                    <div className="text-center text-2xl mt-4">
                        <p>Play Track</p>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default TrackPreview;
