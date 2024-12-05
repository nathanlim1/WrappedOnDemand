import mongoose from "mongoose";

const UserAlbumsSchema = new mongoose.Schema({
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

const UserAlbums = mongoose.model("UserAlbums", UserAlbumsSchema);

export default UserAlbums;
