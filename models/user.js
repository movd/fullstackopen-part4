const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
// Fix deprecation warnings:
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const userSchema = mongoose.Schema({
  username: { type: String, minlength: 3, required: true, unique: true },
  name: String,
  passwordHash: { type: String, required: true }
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = User;
