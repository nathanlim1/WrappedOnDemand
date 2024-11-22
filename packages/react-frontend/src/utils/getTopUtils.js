// function to delay for a specified number of milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (fetchFunction, retries = 5, attempt = 0) => {
  try {
    console.log(`Attempt ${attempt}...`);
    const response = await fetchFunction();

    // check if the response contains an error
    if (response && response.error) {
      const status = response.error.status;

      if (status === 429 && attempt < retries) {
        // rate limited
        const retryAfter = Math.pow(2, attempt) * 1000; // exponential backoff for delaying
        console.warn(`Rate limited. Retrying after ${retryAfter} ms...`);
        await delay(retryAfter);
        return fetchWithRetry(fetchFunction, retries, attempt + 1);
      } else {
        // other errors; throw the error to be caught below
        throw response.error;
      }
    }

    // if no errors, return the response
    return response;
  } catch (error) {
    const status = error.status || (error.response && error.response.status);

    if ((status === 429 || error instanceof SyntaxError) && attempt < retries) {
      // rate limited or SyntaxError due to non-JSON response (which Spotify sometimes returns as a rate limit error)
      const retryAfter = Math.pow(2, attempt) * 1000;
      console.warn(
        `Rate limited or SyntaxError. Retrying after ${retryAfter} ms...`
      );
      await delay(retryAfter);
      return fetchWithRetry(fetchFunction, retries, attempt + 1);
    } else {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
};

// returns the top n artists, or as many as possible if the max is less than n
async function getTopNArtists(spotifyApi, maxArtists, time_range) {
  const limit = 50;
  let allArtists = [];

  console.log("Getting top artists...");

  const firstResponse = await fetchWithRetry(() =>
    spotifyApi.getMyTopArtists({ time_range, offset: 0, limit })
  );

  allArtists = firstResponse.items;
  const totalAvailable = firstResponse.total;

  if (allArtists.length >= maxArtists || totalAvailable <= limit) {
    return allArtists.slice(0, maxArtists);
  }

  // calculate the number of batches needed
  const totalToFetch = Math.min(maxArtists, totalAvailable);
  const batchesNeeded = Math.ceil(totalToFetch / limit);

  // generate an array of offsets for remaining batches
  const offsets = [];
  for (let i = 1; i < batchesNeeded; i++) {
    offsets.push(i * limit);
  }

  // fetch the remaining batches in parallel
  const fetchPromises = offsets.map((offset) =>
    fetchWithRetry(() =>
      spotifyApi.getMyTopArtists({ time_range, offset, limit })
    )
  );

  const responses = await Promise.all(fetchPromises);

  for (const response of responses) {
    allArtists = allArtists.concat(response.items);
    if (allArtists.length >= maxArtists) {
      break;
    }
  }

  return allArtists.slice(0, maxArtists);
}

// returns the top n tracks, or as many as possible if the max is less than n
async function getTopNTracks(spotifyApi, maxTracks, time_range) {
  const limit = 50;
  let allTracks = [];

  console.log("Getting top tracks...");

  // first, fetch the first batch to get total number of available items
  const firstResponse = await fetchWithRetry(() =>
    spotifyApi.getMyTopTracks({ time_range, offset: 0, limit })
  );

  allTracks = firstResponse.items;
  const totalAvailable = firstResponse.total;

  if (allTracks.length >= maxTracks || totalAvailable <= limit) {
    return allTracks.slice(0, maxTracks);
  }

  // calculate the number of batches needed
  const totalToFetch = Math.min(maxTracks, totalAvailable);
  const batchesNeeded = Math.ceil(totalToFetch / limit);

  // generate an array of offsets for remaining batches
  const offsets = [];
  for (let i = 1; i < batchesNeeded; i++) {
    offsets.push(i * limit);
  }

  // fetch the remaining batches in parallel
  const fetchPromises = offsets.map((offset) =>
    fetchWithRetry(() =>
      spotifyApi.getMyTopTracks({ time_range, offset, limit })
    )
  );

  const responses = await Promise.all(fetchPromises);

  for (const response of responses) {
    allTracks = allTracks.concat(response.items);
    if (allTracks.length >= maxTracks) {
      break;
    }
  }

  return allTracks.slice(0, maxTracks);
}

// returns the top n albums, drawing from a list of tracks
async function getTopNAlbums(spotifyApi, maxAlbums, tracks) {
  // get the album ids from the given songs
  const trackIds = tracks.map((track) => track.album.id);

  // get the scores (how much the user listened) for each album
  const idScores = trackIds.reduce((acc, id, index) => {
    // albums at the beginning of the list have higher score
    const score = Math.pow(trackIds.length - index, 5);
    acc[id] = (acc[id] || 0) + score;
    return acc;
  }, {});

  // sort and only take the top n albums
  let sortedIds = Object.keys(idScores).sort(
    (a, b) => idScores[b] - idScores[a]
  );

  sortedIds = sortedIds.slice(0, maxAlbums);

  // remove duplicate album IDs
  const uniqueAlbumIds = [...new Set(sortedIds)];

  console.log(`Total unique album IDs: ${uniqueAlbumIds.length}`);

  // batch album IDs into groups of up to 20
  const batches = [];
  const batchSize = 20;

  for (let i = 0; i < uniqueAlbumIds.length; i += batchSize) {
    batches.push(uniqueAlbumIds.slice(i, i + batchSize));
  }

  console.log(`Number of batches: ${batches.length}`);

  // fetch all batches in parallel
  const fetchPromises = batches.map((batchIds) =>
    fetchWithRetry(() => spotifyApi.getAlbums(batchIds))
  );

  const responses = await Promise.all(fetchPromises);

  // map album IDs to album objects
  const albumMap = {};
  responses.forEach((response) => {
    response.albums.forEach((album) => {
      albumMap[album.id] = album;
    });
  });

  // reconstruct the sorted album list
  const sortedAlbums = uniqueAlbumIds.map((id) => albumMap[id]);

  // filter albums that are too short (singles basically)
  const filteredAlbums = sortedAlbums.filter(
    (album) => album && album.total_tracks > 2
  );

  return filteredAlbums;
}

export { getTopNArtists, getTopNTracks, getTopNAlbums };
