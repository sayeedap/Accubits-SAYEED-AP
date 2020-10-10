var model = require("../models");
const User = model.User;

var bcrypt = require("bcryptjs");


const getAllUsers = (req, res) => {
  var filter = {
    offset: parseInt(req.query.page) * parseInt(req.query.limit) || 0,
    limit: parseInt(req.query.limit) || 10,
    order: [["updatedAt", "DESC"]],
    attributes: { exclude: ["password"] },
  };
  return User.findAndCountAll(filter);
};

const getByEmail = (email) => {
  return User.findOne({
    where: {
      email: email,
    },
  });
};

const getSingleUser = (id) => {
  User.findByPk(id).then((user) => {});

  return User.findOne({
    where: {
      id: id,
    },
    attributes: { exclude: ["password"] },
  });
};

const isUserExist = (email) => {
  return User.count({
    where: {
      email: email,
    },
  }).then((count) => {
    if (count == 0) {
      return false;
    }
    return true;
  });
};

const createUser = async (req, res, next) => {
  var status = true;
  await isUserExist(req.body.email).then((email) => {
    if (email == true) {
      status = false;
    }
  });
  if (status) {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    next(user);
  } else {
    res.status(200).json({
      status: "failed",
      message: "Email already exist",
    });
  }
};
const userService = {
  getAllUsers,
  getSingleUser,
  createUser,
  getByEmail,
};
module.exports = userService;
