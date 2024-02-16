const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

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
            const token = jwt.sign({ email }, SECRET, { expiresIn: "3h" });
            res.send({
              status: true,
              message: "Login Successful",
              userId: result._id,
              user: result,
              token,
            });
            console.log(result._id);
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

// const logOutUser = (req, res) => {
//   const { userId } = req.body;
//   console.log(userId);
//   User.findOneAndDelete({ _d: userId })
//     .then((result) => {
//       if (result) {
//         res
//           .status(200)
//           .json({ status: true, message: "User logged out successfully" });
//       } else {
//         res.status(404).json({ status: false, message: "User not found" });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ status: false, message: "Internal Server Error" });
//     });
// };

const authUser = async (req, res) => {
  const token = req.headers.authorization.split("VanLife")[1];
  jwt.verify(token, SECRET, (err, result) => {
    if (err) {
      res.status(500).json({
        result: err,
        message: "token expire",
        status: false,
      });
      console.log(err);
    } else {
      let email = result.email;
      User.findOne({ email })
        .then((result) => {
          res.status(200).json({
            result: result,
            message: "good",
            status: true,
          });
        })
        .catch((err) => {
          res.status(500).json({
            result: err,
            message: "token expire",
            status: false,
          });
          console.log(err);
        });
    }
  });
};

const userEdit = (req, res) => {
  const { userId, firstname, lastname, email } = req.body.Val;
  if (!userId) {
    return res
      .status(400)
      .json({ status: false, message: "User ID is required" });
  } else {
    User.findOneAndUpdate(
      { _id: userId },
      { $set: { firstname: firstname, lastname: lastname, email: email } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res
            .status(404)
            .json({ status: false, message: "User not found" });
        }
        console.log("User updated:", updatedUser);
        res
          .status(200)
          .json({
            status: true,
            message: "User updated successfully",
            user: updatedUser,
          });
      })
      .catch((error) => {
        console.error("User edit error:", error);
        res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      });
  }

};
module.exports = { registerUser, userLogin, authUser, userEdit };
