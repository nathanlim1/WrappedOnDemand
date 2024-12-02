import mongoose from "mongoose";

const UserTracksSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
  term: {
    type: String,
    enum: ["short_term", "medium_term", "long_term"],
    required: true,
  },
  data: { type: Array, required: true },
});

const UserTracks = mongoose.model("UserTracks", UserTracksSchema);

export default UserTracks;
