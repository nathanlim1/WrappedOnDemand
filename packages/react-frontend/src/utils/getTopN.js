
// Returns the top n artists, or as many as possible if the max is less than n
export function getTopNArtists(spotifyApi, maxArtists, timerange) {
    let allArtists = [];
    let offset = 0;
    let limit = 50;

    // Function to fetch a batch of artists
    const fetchBatchOfArtists = () => {
        return spotifyApi.getMyTopArtists({ time_range: timerange, offset: offset, limit: limit })
            .then((response) => {
                allArtists = [...allArtists, ...response.items];

                if (allArtists.length >= maxArtists) {
                    allArtists = allArtists.slice(0, maxArtists); // Truncate to maxArtists
                    return allArtists; // Return the final list once we have enough artists
                }

                // If more artists are needed, increment the offset and fetch the next batch
                if (response.items.length === limit) {
                    offset += limit;
                    return fetchBatchOfArtists(); // Recursively fetch more artists
                }

                return allArtists; // Return the current batch if no more are needed
            })
            .catch((err) => {
                console.error("Error fetching top artists:", err);
                return []; // Return an empty array if an error occurs
            });
    };

    // Start fetching artists and return the resulting promise
    return fetchBatchOfArtists();
}
