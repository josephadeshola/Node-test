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
        console.log(result);
        bcryptjs.compare(
          req.body.password,
          result.password,
          (err, response) => {
            if (response) {
              console.log(response);
              //   const token = jwt.sign({ email }, SECRET, { expiresIn: "3h" });
              //   console.log(token);
              res.send({
                status: true,
                message: "Login Successful",
                firstname: result.firstname,
              });
            } else {
              console.log(err);
              res.send({ status: false, message: "Incorrect Password" });
            }
          }
        );
      } else {
        res.send({ status: false, message: "Incorrect email or password" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = { registerUser, userLogin };
