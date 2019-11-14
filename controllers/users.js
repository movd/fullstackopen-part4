const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    const saltRounds = 10;
    let passwordHash;
    if (body.password.length >= 3) {
      passwordHash = await bcrypt.hash(body.password, saltRounds);
    } else {
      // validation for to short passwords
      return response
        .status(400)
        .json({ error: "password must at least 3 chars" });
    }

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1
  });
  response.json(users.map(u => u.toJSON()));
});

module.exports = usersRouter;
