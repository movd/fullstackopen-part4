const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoUrl = config.MONGODB_URI;

// Use mongoose with async/await using Immediately-invoked Function Expressions (IIFE)
// https://stackoverflow.com/a/54892088

(async () => {
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true });
    console.log("Connected to MongoDB:", mongoUrl);
  } catch (error) {
    console.error("error connecting to MongoDB:", error.message);
  }
})();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
