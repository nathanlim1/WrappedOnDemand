import { useSpotifyApi } from "../SpotifyContext";

// generate playlist based on currently shown tracks
async function generatePlaylist(displayedTracks) {
    const spotifyApi = useSpotifyApi();
    let userId = "";
    let playlistId = "";
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
    playlistId = response.id;

    // all tracks we pass into tracks.jsx are tracks objects
    // index into external_urls and then spotify
    let trackUrls = []
    for (let i = 0; i < displayedTracks.length; i++) {
        trackUrls.push(displayedTracks[i]["external_urls"]["spotify"]);
    }

    for (let i = 0; i < trackUrls.length; i++) {
        spotifyApi.addTracksToPlaylist(playlistId, trackUrls[i]);
    }
}
