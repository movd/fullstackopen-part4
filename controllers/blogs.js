const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  let newBlog = request.body;
  const token = request.token;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    // Set likes to zero if undefined
    if (!newBlog.likes) {
      newBlog.likes = 0;
    }

    // respond with 'bad request' and POST payload when 'title' or 'url' are undefined or empty
    if (!newBlog.title || !newBlog.url) {
      return response
        .status(400)
        .json({ error: "title or url missing" })
        .end();
    }

    // get user sent in token from db
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({ ...newBlog, user: user._id });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    return response.status(201).json(savedBlog.toJSON());
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  console.log(request.params.id);
  try {
    const blog = await Blog.findById(request.params.id).populate("user", {
      username: 1,
      name: 1
    });
    response.json(blog).status(200);
  } catch (error) {
    next(error);
  }
});

// DELETE Route
blogsRouter.delete("/:id", async (request, response, next) => {
  console.log(request.params.id);
  const token = request.token;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const foundBlog = await Blog.findById(request.params.id);
    const userIdFromDb = foundBlog.user.toString();

    if (decodedToken.id === userIdFromDb) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      return response.status(401).json({ error: "wrong user" });
    }
  } catch (error) {
    next(error);
  }
});

// PUT Route (Ex. 4.14)
blogsRouter.put("/:id", async (request, response, next) => {
  const { author, title, url, likes } = request.body;
  const blog = {
    author,
    title,
    url,
    likes
  };
  // Only proceed if 'likes' exists and is a number
  if (!isNaN(likes)) {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true }
      ).populate("user", { username: 1, name: 1 });
      response.json(updatedBlog.toJSON());
    } catch (error) {
      next(error);
    }
  } else {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
