const express = require("express");
const req = require("express/lib/request");
const { sendStatus } = require("express/lib/response");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let users = [
  {
    username: "ABC",
    email: "abc@email.com",
    password: "password",
    id: 1,
  },
];
let userId = 2;

//Returns all the users from the database
app.get("/allusers", (req, res) => {
  res.send(users);
});

// Creates a new user object into the database
app.post("/create", logger, (req, res) => {
  req.body.id = userId++;
  users.push(req.body);
  res.sendStatus(201);
});

// Returns the user specific to passed ID.
app.get("/user/:id", getUserIndex, (req, res) => {
  res.send(req.body.user);
});

// Edits the specific user with the passed ID.
app.put("/user/:id", getUserIndex, (req, res) => {
  users[req.body.arrIndex] = { ...req.body.user, ...req.body.edit };
  res.sendStatus(200);
});

// Deletes a user specific to the passed ID.
app.delete("/user/:id", getUserIndex, (req, res) => {
  users.splice(req.body.arrIndex, 1);
  res.sendStatus(200);
});

//Autenticating a user based on email and password
app.post("/login", authenticate, (req, res) => {
  res.sendStatus(200);
});

function getUserIndex(req, res, next) {
  let index = users.findIndex((user, index) => {
    return user.id == req.params.id;
  });
  req.body.user = users[index];
  req.body.arrIndex = index;
  index != -1 ? next() : res.sendStatus(400);
}

// Authenticate Middleware function [with user credentials]
function authenticate(req, res, next) {
  users.some((user) => {
    return user.email === req.body.email && user.password === req.body.password;
  })
    ? next()
    : res.sendStatus(400);
}

app.listen(8080, () => {
  console.info("Server is running...");
});
