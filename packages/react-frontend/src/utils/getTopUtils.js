
/*
This file has three functions that give the top artists, tracks, and albums
They each return a promise of a list of json objects
The json objects are just the ones spotify gives
Use these functions to get the lists with all the data, then call the fields you need
for whatever you are working on
*/

// Returns the top n artists, or as many as possible if the max is less than n
function getTopNArtists(spotifyApi, maxArtists, timerange) {
    let allArtists = [];
    let offset = 0;
    let limit = 50;

    // Function to get 50 artists at a time
    const fetchBatchOfArtists = () => {
        return spotifyApi.getMyTopArtists({ time_range: timerange, offset: offset, limit: limit })
            .then((response) => {
                allArtists = [...allArtists, ...response.items];

                if (allArtists.length >= maxArtists) { // Truncate list if we got too many artists
                    allArtists = allArtists.slice(0, maxArtists); 
                    return allArtists; 
                }

                // Recursively get 50 more artists if needed
                if (response.items.length === limit) {
                    offset += limit;
                    return fetchBatchOfArtists(); 
                }

                return allArtists; 
            })
            .catch((err) => {
                console.error("Error fetching top artists:", err);
                return []; 
            });
    };

    return fetchBatchOfArtists();
}

// Returns the top n tracks, or as many as possible if the max is less than n
function getTopNTracks(spotifyApi, maxTracks, timerange) {
    let allTracks = [];
    let offset = 0;
    let limit = 50;

    const fetchBatchOfTracks = () => {
        return spotifyApi.getMyTopTracks({ time_range: timerange, offset: offset, limit: limit })
            .then((response) => {
                allTracks = [...allTracks, ...response.items];

                if (allTracks.length >= maxTracks) {
                    allTracks = allTracks.slice(0, maxTracks); 
                    return allTracks;
                }

                if (response.items.length === limit) {
                    offset += limit;
                    return fetchBatchOfTracks(); 
                }

                return allTracks; 
            })
            .catch((err) => {
                console.error("Error fetching top artists:", err);
                return []; 
            });
    };
    
    return fetchBatchOfTracks();
}

// Drawing from a list of tracks, calculate the top n albums
async function getTopNAlbums(spotifyApi, maxAlbums, tracks) {
    const trackIds = tracks.map((track) => track.album.id);
    const idScores = trackIds.reduce((acc, id, index) => {
        const score = trackIds.length - index;
        if (acc[id]) {
            acc[id] += score;
        } else {
            acc[id] = score;
        }
        return acc;
    }, {});

    let sortedIds = Object.keys(idScores).sort((a, b) => idScores[b] - idScores[a]);
    sortedIds = sortedIds.slice(0, maxAlbums);
    const sortedAlbums = await Promise.all(sortedIds.map((id) => spotifyApi.getAlbum(id)));

    return sortedAlbums;
}

export {getTopNArtists, getTopNTracks, getTopNAlbums};
