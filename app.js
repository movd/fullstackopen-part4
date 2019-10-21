const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB:", mongoUrl);
  })
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(bodyParser.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
