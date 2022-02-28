const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
const userSchema = require("./userModel");

mongoose.connect("mongodb://localhost/users");
let db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.once("open", () => {
  console.log("Connected");
});

//Returns all the users from the database
app.get("/allusers", async (req, res) => {
  let resp, code;
  try {
    resp = await userSchema.find();
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

// Creates a new user object into the database
app.post("/create", async (req, res) => {
  let resp, code;
  const user = new userSchema({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    resp = await user.save();
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json({ code, response: resp });
  }
});

// Returns the user specific to passed ID.
app.get("/user/:id", async (req, res) => {
  try {
    let resp = await userSchema.findById(req.params.id);
    res.status(200).json({ 200, response: resp });
  } catch (e) {
    res.status(200).json({ 200, response: resp });
    console.log(e);
  }
  resp ? (code = 200) : (code = 400);
});

// Edits the specific user with the passed ID.
app.put("/user/:id", async (req, res) => {
  try {
    let resp = await userSchema.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.status(200).json({ code:200,response:resp });
  } catch (e) {
    console.log(e);
    res.status(400).json({ code:400,response:e.message });
  }
});

// Deletes a user specific to the passed ID.
app.delete("/user/:id", async (req, res) => {
  try {
    let resp = await userSchema.findOneAndDelete({ _id: req.params.id });
    res.status(code).json({ code });
  } catch (e) {
    console.log(e);
    res.status(404).json({ code: 404, response: e.message });
  }
});

//Autenticating a user based on email and password
app.post("/login", async (req, res) => {
  try {
    let resp = await userSchema.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json({ code: 200, response: resp });
  } catch (e) {
    console.log(e);
    res.status(200).json({ code: 200, response: e.message });
  }
});

// TODO: Authenticate Middleware function [with user credentials]

app.listen(8080, () => {
  console.info("Server is running...");
});
