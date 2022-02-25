const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));

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
  let resp, code;
  try {
    resp = await connection.db("users").collection("users").find({}).toArray();
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json(resp);
  }
});

// Creates a new user object into the database
app.post("/create", async (req, res) => {
  let resp, code;
  try {
    resp = await connection.db("users").collection("users").insertOne(req.body);
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json(resp);
  }
});

// Returns the user specific to passed ID.
app.get("/user/:id", async (req, res) => {
  let resp, code;
  try {
    resp = await connection
      .db("users")
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
  } catch (e) {
    console.log(e);
  }
  resp ? (code = 200) : (code = 400);
  res.status(code).json(resp);
});

// Edits the specific user with the passed ID.
app.put("/user/:id", async (req, res) => {
  let resp, code;
  try {
    resp = await connection
      .db("users")
      .collection("users")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body });
  } catch (e) {
    console.log(e);
  } finally {
    resp.matchedCount > 0 ? (code = 200) : (code = 400);
    res.sendStatus(code);
  }
});

// Deletes a user specific to the passed ID.
app.delete("/user/:id", async (req, res) => {
  let resp, code;
  try {
    resp = await connection
      .db("users")
      .collection("users")
      .deleteOne({ _id: ObjectId(req.params.id) });
  } catch (e) {
    console.log(e);
  } finally {
    resp.deletedCount > 0 ? (code = 202) : (code = 400);
    res.sendStatus(code);
  }
});

//Autenticating a user based on email and password
app.post("/login", async (req, res) => {
  let resp, code;
  try {
    resp = await connection
      .db("users")
      .collection("users")
      .findOne({ email: req.body.email, password: req.body.password });
  } catch (e) {
    console.log(e);
  } finally {
    resp ? (code = 200) : (code = 400);
    res.status(code).json(resp);
  }
});

// TODO: Authenticate Middleware function [with user credentials]

app.listen(8080, () => {
  console.info("Server is running...");
});
