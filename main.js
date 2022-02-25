const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
let users = [
  {
    username: "ABC",
    email: "abc@email.com",
    password: "password",
    id: 1,
  },
];
let userId = 2;
let connection;

async function connectToDb() {
  try {
    connection = await client.connect();
  } catch (e) {
    console.log(e);
  }
}

connectToDb();

client.on("open", () => {
  console.log("Connected");
});

//Returns all the users from the database
app.get("/allusers", async (req, res) => {
  let resp = {},
    code;
  try {
    resp = await connection.db("users").collection("users").find({}).toArray();
    code = 200;
  } catch (e) {
    console.log(e);
    code = 400;
  } finally {
    res.status(code).json(resp);
  }
});

// Creates a new user object into the database
app.post("/create", async (req, res) => {
  let resp = {},
    code;
  try {
    resp = await connection.db("users").collection("users").insertOne(req.body);
    code = 200;
  } catch (e) {
    code = 400;
    console.log(e);
  } finally {
    res.status(code).json(resp);
  }
});

// Returns the user specific to passed ID.
app.get("/user/:id", (req, res) => {
  let resp = {},
    code;
  try {
    resp = await connection
      .db("users")
      .collection("users")
      .find({ _id: req.params.id })
      .toArray();
    code = 200;
  } catch (e) {
    console.log(e);
    code = 400;
  }
  res.status(code).json(resp);
});

// Edits the specific user with the passed ID.
app.put("/user/:id", getUserIndex, (req, res) => {
  users[req.body.arrIndex] = { ...req.body.user, ...req.body.edit };
  res.send({ code: 202, status: "User Edited Successfully" });
});

// Deletes a user specific to the passed ID.
app.delete("/user/:id", getUserIndex, (req, res) => {
  users.splice(req.body.arrIndex, 1);
  res.send({ code: 202, status: "User Deleted Successfully" });
});

//Autenticating a user based on email and password
app.post("/login", authenticate, (req, res) => {
  res.send({ code: 200, status: "User LoggedIn Successfully" });
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
