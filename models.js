const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
    default: "Check out my blogs.",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const blogComponentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      lowercase: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const PersonDetailsSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const commentdMetadata = mongoose.Schema(
  {
    date: {
      type: Date,
      default: new Date(),
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const commentSchema = mongoose.Schema({
  commentedOnId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
    trim: true,
  },
  commenter: {
    type: PersonDetailsSchema,
    required: true,
  },
  meta: commentdMetadata,
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  components: [blogComponentSchema],
  likes: {
    type: Number,
    default: 0,
  },
  authorDetails: {
    type: PersonDetailsSchema,
    required: true,
  },
  comments: [commentSchema],
  tags: [String],
  date: {
    type: Date,
    default: new Date(),
  },
});

// blogSchema.index({title:'text', })

const userModel = mongoose.model("userSchema", userSchema);
const blogModel = mongoose.model("blogModel", blogSchema);
const commentModel = mongoose.model("commentModel", commentSchema);

module.exports = { userModel, blogModel, commentModel };
