
function AlbumPreview({album, index}) {
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
    
        // Check if any part of the date is undefined
        if (!year || !month || !day) {
            return "unknown";
        }
    
        return `${month}/${day}/${year}`;
    }
    
    
    return (
        <div className="w-[660px] h-[440px] bg-zinc-800 flex flex-col rounded-lg shadow-lg text-white">
            {/* Header (with wrapping) */}
            {/* <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg px-4">
                <h2 className="text-3xl font-semibold">{index}. {album.name}</h2>
            </div> */}

            {/* Header (with truncating) */}
            <div className="w-full h-16 bg-[#1db954] text-white flex items-center justify-center rounded-t-lg px-4">
                <h2 className="text-3xl font-semibold truncate w-full">{index}. {album.name}</h2>
            </div>

            {/* Body with left and right */}
            <div className="flex-1 flex space-x-4"> 
                {/* Left Section */}
                <div className="w-1/2 p-4 flex flex-col items-center justify-between"> 
                    <div className="w-72 h-72 bg-gray-600 rounded-lg mb-4">
                        {/* Album Cover */}
                        <img 
                            src={album.images[0].url} 
                            alt={`${album.name} photo`} 
                            className="w-full h-full object-cover rounded-lg" 
                        />
                    </div> 
                    {/* By */}
                    <div className="w-full text-center text-2xl">
                        <p className="truncate w-full">By: {album.artists[0].name} </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-1/2 p-4 flex flex-col items-center justify-between"> 
                    {/* Tracklist */}
                    <div className="w-72 h-72 bg-gray-600 rounded-lg mb-4 p-4 flex flex-col">
                        {/* Tracklist Title */}
                        <p className="text-center font-semibold text-2xl mb-4">Tracklist</p>

                        {/* Scrollable Tracklist */}
                        <ol className="flex-1 overflow-y-auto text-xl list-inside">
                            {album.tracks.items.map((track, index) => (
                                    <li key={index} className="list-decimal">{track.name}</li>
                            ))}
                        </ol>
                    </div>

                    <div className="w-full text-center text-2xl">
                        <p className="truncate w-full">Release Date: {formatDate(album.release_date)}</p>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default AlbumPreview;