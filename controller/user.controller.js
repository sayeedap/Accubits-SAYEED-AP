var userService = require("../service/user.service");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const jwtSecurityConfig = require("../config/jwtSecurityConfig");
const passport = require("passport");
const strategy = jwtSecurityConfig.strategy;
const getAllUsers = (req, res, next) => {
  userService
    .getAllUsers(req)
    .then((data) => {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL users",
      });
    })
    .catch((err) => {

      return next(err);
    });
};

const getSingleUser = (req, res, next) => {
  var pupID = req.params.id;
  userService
    .getSingleUser(pupID)
    .then((data) => {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ONE user",
      });
    })
    .catch((err) => {
      return next(err);
    });
};

const createUser = (req, res, next) => {
  userService
    .createUser(req, res, (user) => {
      res.status(200).json({
        status: "success",
        data: user.user_id,
        message: "Create user successfully",
      });
    })
    .catch((err) => {
      return next(err);
    });
};

// const removeUser = (req, res, next) => {
//   var userID = req.params.id;
//   userService
//     .removeUser(userID)
//     .then(() => {
//       res.status(200).json({
//         status: "success",
//         message: `Removed successfully`,
//       });
//     })
//     .catch((err) => {
//       return next(err);
//     });
// };

const signin = async (req, res, next) => {
  userService
    .getByEmail(req.body.email)
    .then(async (user) => {

      if (!user) {
        return res.status(401).send({
          auth: false,
          accessToken: null,
          reason: "Invalid User!",
        });
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          auth: false,
          accessToken: null,
          reason: "Invalid Password!",
        });
      }

      let token = jwt.sign(
        { email: req.body.email, id: user.id },
        "86400",
        {
          expiresIn: 86400,
        }
      );
      let users = await userService.getSingleUser(user.id);

      let basicDetails = JSON.parse(JSON.stringify(users));
      // delete basicDetails["password"];
      res.status(200).send({
        auth: true,
        basicDetails: users,

        accessToken: token,
      });
    })
    .catch((err) => {
      return next(err);
    });
};

const currentUser =async (req, res, next) => {


  
  const usertoken = req.headers.authorization;
  const token = usertoken.split(' ');
  const decoded = jwt.verify(token[1], '86400');
  let users = await userService.getSingleUser(decoded.id);

  res.status(200).json({
    status: "success",
    data: users,
    message: "Current user",
  });
};


const userController = {
  getAllUsers,
  getSingleUser,
  createUser,
  signin,
  currentUser
  //   removeUser,
};

module.exports = userController;
