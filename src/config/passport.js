const passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    appConfig = require('../config/app'),
    User = require('../models/user');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = appConfig.jwtSecret;

module.exports = passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload.sub);
    User.findOne({ _id: jwt_payload.sub }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            const userObj = user.toObject();
            delete userObj.password
            return done(null, userObj);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));