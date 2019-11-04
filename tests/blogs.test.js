const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./list_helper.test");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe("Blog list tests", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(helper.initialBlogs.length);
  });

  test("unique identifier", async () => {
    const response = await api.get("/api/blogs");
    // Only first element needs to be checked
    // because the whole retuned object from db gets transformed by models/blog.js
    expect(response.body[0].id).toBeDefined();
    // Otherwise:
    // response.body.map(blog => expect(blog.id).toBeDefined());
  });

  test("a new blog can be added", async () => {
    const newBlog = {
      title: "SSH Handshake Explained",
      author: "Russell Jones",
      url: "https://gravitational.com/blog/ssh-handshake-explained/",
      likes: 6
    };

    // POST a newBlog to blogs API
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // GET from API should now be +1 from initialization
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(helper.initialBlogs.length + 1);

    // Create array of titles, this should contain 'SSH Handshake Explained'
    const titles = response.body.map(blog => blog.title);
    expect(titles).toContainEqual(newBlog.title);
  });

  test("default to 0 liked if not given", async () => {
    // Create a new blog without likes
    const newBlogUndefinedLikes = {
      title: "Getting started with security keys",
      author: "Paul Stamatiou",
      url: "https://paulstamatiou.com/getting-started-with-security-keys/"
    };

    await api
      .post("/api/blogs")
      .send(newBlogUndefinedLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    // grep newly created blog from server response
    const createdBlog = response.body.find(blog =>
      blog.title.includes(newBlogUndefinedLikes.title)
    );
    // Check if likes equal 0
    expect(createdBlog.likes).toEqual(0);
  });

  test("error 400 when blog title or url is missing", async () => {
    const newBlogNoTitleUrl = {
      author: "Moritz"
    };

    await api
      .post("/api/blogs")
      .send(newBlogNoTitleUrl)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const { body } = await api.get("/api/blogs");
    console.log(body[6]);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
