const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("../utils/test_helper");
const api = supertest(app);

const User = require("../models/user");

describe("Adding users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany([
      {
        username: "rosa",
        name: "Rosa",
        passwordHash: "berlin"
      }
    ]);
  });

  test("success with new user", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "karl",
      name: "Karl",
      password: "berlin"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("error 400 with to short password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "karl",
      name: "Karl",
      password: "be"
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400);

    expect(res.body).toEqual({
      error: "password must at least 3 chars"
    });

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test("error 400 with empty 'username'", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserNoUsername = {
      username: "",
      name: "Karl",
      password: "berlin"
    };

    const res = await api
      .post("/api/users")
      .send(newUserNoUsername)
      .expect(400);

    expect(res.body.error).toContain("User validation failed");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
  afterAll(() => {
    mongoose.connection.close();
  });
});
