var express = require('express');
var router = express.Router();

var userRouter = require('./user.router') 
var userController = require('../controller/user.controller');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post(
  "/auth/login",
  userController.signin
);

router.get(
  "/auth/user",
  userController.currentUser
);

router.use(
  "/api",
  userRouter)


module.exports = router;
