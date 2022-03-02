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
  let resp, code;
  try {
    resp = await userModel.find();
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

// Creates a new user object into the database
app.post("/create", async (req, res, next) => {
  let resp, code;
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    resp = await user.save();
  } catch (e) {
    console.log(e);
    next(e);
    // } finally {
    //   resp ? (code = 200) : (code = 400);
    //   res.status(code).json({ code, response: resp });
  }
});

// Returns the user specific to passed ID.
app.get("/user/:id", async (req, res) => {
  let resp, code;
  try {
    resp = await userModel.findById(req.params.id);
  } catch (e) {
    console.log(e);
  }
  resp ? (code = 200) : (code = 400);
  res.status(code).json({ code, response: resp });
});

// Edits the specific user with the passed ID.
app.put("/user/:id", async (req, res) => {
  let resp, code;
  try {
    resp = await userModel.findOneAndUpdate({ _id: req.params.id }, req.body);
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code });
  }
});

// Deletes a user specific to the passed ID.
app.delete("/user/:id", async (req, res) => {
  let resp, code;
  try {
    resp = await userModel.findOneAndDelete({ _id: req.params.id });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code });
  }
});

//Autenticating a user based on email and password
app.post("/login", async (req, res) => {
  let resp, code;
  try {
    resp = await userModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

/*
=> Blogs ROUTES
*/
//Get All blogs created by an author
app.get("/blogs/:authorId", async (req, res) => {
  let resp, code;
  try {
    resp = await blogModel.find({ "authorDetails.id": req.params.authorId });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

//Get a blog by a specific Id
app.get("/blog/:blogId", async (req, res) => {
  let resp, code;
  try {
    resp = await blogModel.findOne({ _id: req.params.blogId });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

//Create a Blog
app.post("/createblog", async (req, res) => {
  let resp, code;
  const blog = new blogModel({
    title: req.body.title,
    components: req.body.components,
    authorDetails: req.body.authorDetails,
    comments: req.body.comments,
    tags: req.body.tags,
  });
  try {
    resp = await blog.save();
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

//Delete a Blog [only if the current loggedIn user is the author]
app.delete("/deleteblog/:blogId", async (req, res) => {
  let resp, code;
  try {
    resp = await blogModel.deleteOne({ _id: req.params.blogId });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).send(resp);
  }
});

//Edits a Blog [Only if the current loggedIn user is the author]
app.put("/editblog/:blogId", async (req, res) => {
  let resp, code;
  try {
    resp = await blogModel.findOneAndUpdate(
      { _id: req.params.blogId },
      req.body
    );
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).send(resp);
  }
});

/*
=> COMMENTS ROUTES
*/

//Create a comment
app.post("/createcomment", async (req, res) => {
  let resp, code;
  const comment = new commentModel({
    commentedOnId: req.body.commentedOnId,
    commentText: req.body.commentText,
    commenter: req.body.commenter,
  });
  try {
    resp = comment.save();
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json(resp);
  }
});

//Get all comments by an Id
app.get("/comments/:id", async (req, res) => {
  let resp, code;
  try {
    resp = await commentModel.find({ commentedOnId: req.params.id });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json(resp);
  }
});

//Delete a comment [only if the loggedIn user is the commenter]
app.delete("/deletecomment/:commentId", async (req, res) => {
  let resp, code;
  try {
    resp = commentModel.deleteOne({ _id: req.params.commentId });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json(resp);
  }
});

/*
Miscellaneous Routes
*/
//Serch route to search the blogs.
app.get("/search/:term", async (req, res) => {
  let resp, code;
  try {
    resp = await blogModel.find({ $text: { $search: req.params.term } });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

app.use(errorHandler);

app.listen(8080, () => {
  console.info("Server is running...");
});
