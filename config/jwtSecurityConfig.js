var userService = require("../service/user.service");
var passport = require("passport");
var passportJWT = require("passport-jwt");
var HeaderAPIKeyStrategy = require("passport-headerapikey");
// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;

// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

jwtOptions.secretOrKey = "86400";
jwtOptions.expiresIn = 86400;

// lets create our strategy for web token
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  let user = userService.getSingleUser(jwt_payload.id);
  console.log('@2222222222',jwt_payload.id)
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

const passport_authenticate_jwt = (callback) => {
  const authenticate = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).send({
          auth: false,
          reason: "Unauthorized",
        });
      }
      req.user = user;
      console.log("useee4444e",user)
    })(req, res, next);
  };
  return authenticate;
};

const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
        
      return res.status(401).send({
        auth: false,
        reason: "Unauthorized",
      });
    }
    req.user = user;
    console.log("33333333",req.user)
    next();
  })(req, res, next);
};

const intercept = (req, res, next) => {
  console.log("Starts--******************");
  next();
};

const jwtSecurityConfig = {
  strategy,
  passport_authenticate_jwt,
  authenticateJwt,
  intercept,
};

module.exports = jwtSecurityConfig;
