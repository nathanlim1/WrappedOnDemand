import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  username: String,
  profilePicture: String,
  allArtists: {
    short_term: Array,
    medium_term: Array,
    long_term: Array,
  },
  allTracks: {
    short_term: Array,
    medium_term: Array,
    long_term: Array,
  },
  allAlbums: {
    short_term: Array,
    medium_term: Array,
    long_term: Array,
  },
  genreCounts: {
    short_term: Array,
    medium_term: Array,
    long_term: Array,
  },
  last_updated: { type: Date, default: Date.now },
});

const UserData = mongoose.model("UserData", UserDataSchema);

export default UserData;
