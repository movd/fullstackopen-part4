const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/destroy", async (req, res) => {
  await Blog.deleteMany({});
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1
  });

  res.json(blogs);
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

  // Add any user (Ex. 4.17)
  const user = await User.findOne({});

  const blog = new Blog({ ...newBlog, user: user._id });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    return response.status(201).json(savedBlog.toJSON());
  } catch (error) {
    console.error(error);
  }
});

blogsRouter.get("/:id", async (request, response) => {
  // response.json(request.params.id);
  try {
    const blog = await Blog.findById(request.params.id);
    response.json(blog).status(200);
  } catch (error) {
    response.status(404).end();
  }
});

// DELETE Route (Ex. 4.13)
blogsRouter.delete("/:id", async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).end();
  }
});

// PUT Route (Ex. 4.14)
blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  // Only proceed if 'likes' exists and is a number
  if (!isNaN(body.likes)) {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        {
          likes: Number(body.likes)
        },
        { new: true }
      );
      response.json(updatedBlog.toJSON());
    } catch (error) {
      response.status(400).end();
    }
  } else {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
