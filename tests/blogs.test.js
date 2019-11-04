const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./list_helper.test");

const api = supertest(app);

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

  afterAll(() => {
    mongoose.connection.close();
  });
});
