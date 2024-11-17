/*
This file has three functions that give the top artists, tracks, and albums
They each return a promise of a list of json objects
The json objects are just the ones spotify gives
Use these functions to get the lists with all the data, then call the fields you need
for whatever you are working on
*/

// function to delay for a specified number of milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// retry mechanism for fetching (when rate limited)
const fetchWithRetry = async (fetchFunction, retries = 3) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchFunction();
    } catch (error) {
      if (error.status === 429 && attempt < retries) {
        // 429 = rate limited
        const retryAfter = error.headers?.["Retry-After"]
          ? parseInt(error.headers["Retry-After"], 10) * 1000
          : 2 ** attempt * 1000; // exponential backoff
        console.warn(`Rate limited. Retrying after ${retryAfter} ms...`);
        await delay(retryAfter); // use the delay function to wait
      } else {
        console.error("Error fetching data:", error);
        throw error; // if another error, rethrow
      }
    }
  }
};

// Returns the top n artists, or as many as possible if the max is less than n
function getTopNArtists(spotifyApi, maxArtists, timerange) {
  let allArtists = [];
  let offset = 0;
  let limit = 50;

  const fetchBatchOfArtists = async () => {
    return spotifyApi
      .getMyTopArtists({ time_range: timerange, offset, limit })
      .then((response) => {
        allArtists = [...allArtists, ...response.items];

        if (allArtists.length >= maxArtists) {
          allArtists = allArtists.slice(0, maxArtists);
          return allArtists;
        }

        if (response.items.length === limit) {
          offset += limit;
          return fetchBatchOfArtists();
        }

        return allArtists;
      });
  };

  return fetchWithRetry(fetchBatchOfArtists);
}

// Returns the top n tracks, or as many as possible if the max is less than n
function getTopNTracks(spotifyApi, maxTracks, timerange) {
  let allTracks = [];
  let offset = 0;
  let limit = 50;

  const fetchBatchOfTracks = async () => {
    return spotifyApi
      .getMyTopTracks({ time_range: timerange, offset, limit })
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
      });
  };

  return fetchWithRetry(fetchBatchOfTracks);
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

  let sortedIds = Object.keys(idScores).sort(
    (a, b) => idScores[b] - idScores[a]
  );
  sortedIds = sortedIds.slice(0, maxAlbums);
  const sortedAlbums = await Promise.all(
    sortedIds.map((id) => spotifyApi.getAlbum(id))
  );

  return sortedAlbums;
}

export { getTopNArtists, getTopNTracks, getTopNAlbums };
