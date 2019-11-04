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
    // console.log("response: ", response.body.length);
    // console.log("should be: ", helper.initialBlogs.length);
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

  afterAll(() => {
    mongoose.connection.close();
  });
});
