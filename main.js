const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("./errorHandler");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
const { userModel, blogModel, commentModel } = require("./models");

mongoose.connect("mongodb://localhost/users");
let db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.once("open", () => {
  console.log("Connected");
});

/*
=> USER ROUTES
*/
//Returns all the users from the database
app.get("/allusers", async (req, res) => {
  try {
    const response = await userModel.find();
    res.json(response);
  } catch (e) {
    next(e);
  }
});

// Creates a new user object into the database
app.post("/create", async (req, res, next) => {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const response = await user.save();
    res.json(response);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// Returns the user specific to passed ID.
app.get("/user/:id", async (req, res, next) => {
  try {
    const response = await userModel.findById(req.params.id);
    res.json(response);
  } catch (e) {
    next(e);
  }
});

// Edits the specific user with the passed ID.
app.put("/user/:id", async (req, res, next) => {
  try {
    const response = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.json(response);
  } catch (e) {
    next(e);
  }
});

// Deletes a user specific to the passed ID.
app.delete("/user/:id", async (req, res, next) => {
  try {
    const response = await userModel.findOneAndDelete({ _id: req.params.id });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

//Autenticating a user based on email and password
app.post("/login", async (req, res, next) => {
  try {
    const response = await userModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

/*
=> Blogs ROUTES
*/
//Get All blogs created by an author
app.get("/blogs/:authorId", async (req, res, next) => {
  try {
    const response = await blogModel.find({
      "authorDetails.id": req.params.authorId,
    });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

//Get a blog by a specific Id
app.get("/blog/:blogId", async (req, res, next) => {
  try {
    const response = await blogModel.findOne({ _id: req.params.blogId });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

//Create a Blog
app.post("/createblog", async (req, res, next) => {
  const blog = new blogModel({
    title: req.body.title,
    components: req.body.components,
    authorDetails: req.body.authorDetails,
    comments: req.body.comments,
    tags: req.body.tags,
  });
  try {
    const response = await blog.save();
    res.json(response);
  } catch (e) {
    next(e);
  }
});

//Delete a Blog [only if the current loggedIn user is the author]
app.delete("/deleteblog/:blogId", async (req, res, next) => {
  try {
    const response = await blogModel.deleteOne({ _id: req.params.blogId });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

//Edits a Blog [Only if the current loggedIn user is the author]
app.put("/editblog/:blogId", async (req, res, next) => {
  try {
    const response = await blogModel.findOneAndUpdate(
      { _id: req.params.blogId },
      req.body
    );
    res.json(response);
  } catch (e) {
    next(e);
  }
});

/*
=> COMMENTS ROUTES
*/

//Create a comment
app.post("/createcomment", async (req, res, next) => {
  const comment = new commentModel({
    commentedOnId: req.body.commentedOnId,
    commentText: req.body.commentText,
    commenter: req.body.commenter,
  });
  try {
    const response = comment.save();
    res.json(response);
  } catch (e) {
    next(e);
  }
});

//Get all comments by an Id
app.get("/comments/:id", async (req, res, next) => {
  try {
    const response = await commentModel.find({ commentedOnId: req.params.id });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

//Delete a comment [only if the loggedIn user is the commenter]
app.delete("/deletecomment/:commentId", async (req, res, next) => {
  try {
    const response = commentModel.deleteOne({ _id: req.params.commentId });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

/*
Miscellaneous Routes
*/
//Serch route to search the blogs.
app.get("/search/:term", async (req, res, next) => {
  try {
    const response = await blogModel.find({
      $text: { $search: req.params.term },
    });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

app.use(errorHandler);

app.listen(8080, () => {
  console.info("Server is running...");
});
