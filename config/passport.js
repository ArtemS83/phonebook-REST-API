const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const Users = require('../model/users');

require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer JWT_TOKEN
  secretOrKey: JWT_SECRET_KEY,
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      if (!user) {
        return done(new Error('User not found'), false);
      }

      if (!user.token) {
        return done(null, false);
      }

      if (!user.verify) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);

// // =====passport-jwt============
// var JwtStrategy = require('passport-jwt').Strategy,
//   ExtractJwt = require('passport-jwt').ExtractJwt;
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
// passport.use(
//   new JwtStrategy(opts, function (jwt_payload, done) {
//     User.findOne({ id: jwt_payload.sub }, function (err, user) {
//       if (err) {
//         return done(err, false);
//       }
//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//         // or you could create a new account
//       }
//     });
//   }),
// );
