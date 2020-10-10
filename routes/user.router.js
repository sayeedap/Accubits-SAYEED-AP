var express =require( "express");
var router = express.Router();

var jwtSecurityConfig  = require( "../config/jwtSecurityConfig");
//import { userController } from "";
var userController = require('../controller/user.controller');
router
  .route("/users")
  .get([jwtSecurityConfig.authenticateJwt],userController.getAllUsers)
  .post(userController.createUser);
  

router
  .route("/users/:id")
  .get([jwtSecurityConfig.authenticateJwt],userController.getSingleUser)
//   .delete(userController.removeUser);
// export default router;

module.exports = router;
