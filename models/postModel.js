const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: { type: String }, // Text content of the post
  image: { type: String }, // URL for image/video
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
