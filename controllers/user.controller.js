const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const registerUser = (req, res) => {
  let user = new User(req.body);
  user
    .save()
    .then((response) => {
      console.log(response, "Registration successful");
      res
        .status(200)
        .json({ status: true, message: "User saved successfully" });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        res
          .status(400)
          .json({ status: false, message: "Email already exists" });
      } else {
        res.status(400).json({
          status: false,
          message: "Please fill in all details correctly",
        });
      }
    });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        bcryptjs.compare(password, result.password, (err, response) => {
          if (response) {
            res.send({
              status: true,
              message: "Login Successful",
              user_id: result._id,
              user:result
            });
          } else {
            res.send({ status: false, message: "Incorrect Password" });
          }
        });
      } else {
        res.send({
          status: false,
          message: "Account not found. Please register ",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    });
};

const logOutUser = (req, res) => {
  const { userId } = req.body;
  User.findOneAndDelete({ _d: userId })
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json({ status: true, message: "User logged out successfully" });
      } else {
        res.status(404).json({ status: false, message: "User not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    });
};
module.exports = { registerUser, userLogin, logOutUser };
