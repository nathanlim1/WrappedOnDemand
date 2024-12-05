import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  username: String,
  profilePicture: String,
  allArtists: {
    short_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserArtists" },
    medium_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserArtists" },
    long_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserArtists" },
  },
  allTracks: {
    short_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserTracks" },
    medium_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserTracks" },
    long_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserTracks" },
  },
  allAlbums: {
    short_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserAlbums" },
    medium_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserAlbums" },
    long_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserAlbums" },
  },
  genreCounts: {
    short_term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserGenreCounts",
    },
    medium_term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserGenreCounts",
    },
    long_term: { type: mongoose.Schema.Types.ObjectId, ref: "UserGenreCounts" },
  },
  last_updated: { type: Date, default: Date.now },
});

const UserData = mongoose.model("UserData", UserDataSchema);

export default UserData;
