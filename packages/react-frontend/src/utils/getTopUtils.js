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

// Returns the top n albums, drawing from a list of tracks
function getTopNAlbums(spotifyApi, maxAlbums, tracks) {
  const trackIds = tracks.map((track) => track.album.id);

  // get the scores (how much the user listened) for each album
  const idScores = trackIds.reduce((acc, id, index) => {
    const score = trackIds.length - index;
    acc[id] = (acc[id] || 0) + score;
    return acc;
  }, {});

  // sort and only take the top n albums
  let sortedIds = Object.keys(idScores).sort(
    (a, b) => idScores[b] - idScores[a]
  );

  sortedIds = sortedIds.slice(0, maxAlbums);

  // batch album IDs into groups of up to 20, the max allowed for getAlbums API call
  const batches = [];
  const batchSize = 20;

  for (let i = 0; i < sortedIds.length; i += batchSize) {
    batches.push(sortedIds.slice(i, i + batchSize));
  }

  const albumPromises = batches.map((batchIds) => {
    return fetchWithRetry(() => spotifyApi.getAlbums(batchIds));
  });

  return Promise.all(albumPromises)
    .then((responses) => {
      // put all responses into a single array
      const albums = responses.reduce((acc, response) => {
        return acc.concat(response.albums);
      }, []);

      // map album IDs to album objects
      const albumMap = {};
      albums.forEach((album) => {
        albumMap[album.id] = album;
      });

      // reconstruct the sorted album list
      const sortedAlbums = sortedIds.map((id) => albumMap[id]);

      return sortedAlbums;
    })
    .catch((error) => {
      console.error("Error fetching albums:", error);
      return [];
    });
}

export { getTopNArtists, getTopNTracks, getTopNAlbums };
