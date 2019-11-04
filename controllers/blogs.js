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
  const blog = new Blog(newBlog);

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog.toJSON());
  } catch (error) {
    console.error(error);
  }
});

module.exports = blogsRouter;
