const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  let newBlog = request.body;
  // Set likes to zero if undefined
  if (!newBlog.likes) {
    newBlog.likes = 0;
  }

  // respond with 'bad request' and POST payload when 'title' or 'url' are undefined or empty
  if (!newBlog.title || !newBlog.url) {
    return response.status(400).json(newBlog);
  }

  const blog = new Blog(newBlog);

  try {
    const savedBlog = await blog.save();
    return response.status(201).json(savedBlog.toJSON());
  } catch (error) {
    console.error(error);
  }
});

module.exports = blogsRouter;
