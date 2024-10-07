const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: { type: String }, // Text content of the post
  image: { type: String }, // URL for the image
  video: { type: String }, // URL for the video
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to user who created the post
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users who liked the post
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users who saved the post
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the post was created
});

module.exports = mongoose.model("Post", PostSchema);
