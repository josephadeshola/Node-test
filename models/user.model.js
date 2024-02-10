const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

let saltRound = 10;
userSchema.pre("save", function (next) {
  bcryptjs.hash(this.password, saltRound, (err, hash) => {
    if (err) return next(err);
    else this.password = hash;
    next();
  });
  console.log(this.password);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
