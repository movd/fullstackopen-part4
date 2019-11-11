const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

const newUser = {
  username: "kmarx",
  name: "kalle",
  password: "trier"
};

beforeEach(async () => {
  try {
    // cleanup
    const deleteUser = await User.findOneAndDelete({
      username: newUser.username
    });
    // register new user before test run
    await api.post("/api/users").send(newUser);
    await Promise.all(deleteUser.toString());
  } catch (error) {
    console.log(error);
  }
});

describe("login tests", () => {
  const UsernamePassword = {
    username: newUser.username,
    password: newUser.password
  };

  test("login as new user and get token", async () => {
    const res = await api
      .post("/api/login")
      .send(UsernamePassword)
      .expect(200);

    const token = `bearer ${res.body.token}`;
    console.log(token);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
