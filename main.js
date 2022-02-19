const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let users = [];

//Returns all the users from the database
app.get("/allusers", (req, res) => {
  res.send(users);
});

// Creates a new user object into the database
app.post("/create", logger, (req, res) => {
  users.push(req.body);
  res.sendStatus(201);
});

// Returns the user specific to passed ID.
app.get("/user/:id", (req, res) => {
  res.send(users?.[req.params.id] || "No User is found with this id.");
});

// Edits the user specific to the passed ID.
app.put("/user/:id", logger, (req, res) => {
  users[req.params.id] = req.body;
  res.sendStatus(200);
});

// Deletes a user specific to the passed ID.
app.delete("/user/:id", logger, (req, res) => {
  users.splice(req.params.id, 1);
  res.sendStatus(200);
});

//Autenticating a user based on email and password
app.post("/login", authenticate, (req, res) => {
  res.sendStatus(200);
});

// Authenticate Middle ware function [with user credentials]
function authenticate(req, res, next) {
  let arr = users.filter((user) => {
    if (user.email === req.body.email && user.password === req.body.password)
      return true;
    return false;
  });
  arr.length ? next() : res.sendStatus(400);
}

function logger(req, res, next) {
  console.log(users);
  next();
}

app.listen(8080, () => {
  console.log("Server is running...");
});
