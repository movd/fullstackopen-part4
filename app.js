const config = require("./utils/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Fix deprecation warnings:
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model("Blog", blogSchema);

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

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then(result => {
    response.status(201).json(result);
  });
});
