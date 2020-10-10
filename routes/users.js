var express = require('express');
var router = express.Router();

// /* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router
//   .route("/users")
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route("/users/:id")
//   .get(userController.getSingleUser)
//   .delete(userController.removeUser);

module.exports = router;
