async function generatePlaylist(tracks, spotifyApi, playlistName) {
  try {
    // user info: userId is needed to generate playlist
    const userData = await spotifyApi.getMe();
    const userId = userData.id;
    console.log("Generating playlist for user ID:", userId);

    // create playlist
    const playlistResponse = await spotifyApi.createPlaylist(userId, {
      name: playlistName,
      public: true,
      collaborative: false,
    });

    const playlistId = playlistResponse.id;
    console.log("Created playlist with ID:", playlistId);

    // get track uris
    const trackUris = tracks.map((track) => track.uri);

    // add tracks to the playlist in chunks (API has hard limit of 100 tracks per req)
    const chunkSize = 100;
    for (let i = 0; i < trackUris.length; i += chunkSize) {
      const chunk = trackUris.slice(i, i + chunkSize);
      await spotifyApi.addTracksToPlaylist(playlistId, chunk);
    }

    console.log("Tracks added to playlist successfully!");
  } catch (error) {
    console.error("Error generating playlist:", error);
  }
}

export { generatePlaylist };
