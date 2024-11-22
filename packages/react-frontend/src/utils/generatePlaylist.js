import { useSpotifyApi } from "../SpotifyContext";

// generate playlist based on currently shown tracks
async function generatePlaylist(displayedTracks) {
    const spotifyApi = useSpotifyApi();
    let userId = "";
    let playlistName = "New playlist";

    spotifyApi.getMe().then(function(data) {
        userId = data.body.id;
    })
    .catch(function(error) {
        console.error("Error getting user ID:", error);
    });
    
    const response = await spotifyApi.createPlaylist(String(userId), {
        name: playlistName,
        public: true,
        collaborative: false
    });
    console.log(response);

    // use addTracksToPlaylist method to add tracks from
    // displayedTracks to created playlist
    // spotifyApi.addTracksToPlaylist();
}