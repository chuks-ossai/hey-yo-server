const passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    appConfig = require('../config/app'),
    User = require('../models/user');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = appConfig.jwtSecret;

module.exports = passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log('sub', jwt_payload.sub);
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
        if (err) {
            console.log('error',err);
            return done(err, false, {message: `No token to verify`});
        }
        if (user) {
            const userObj = user.toObject();
            delete userObj.password
            return done(null, userObj);
        } else {
            return done(null, false, {message: `Sorry we don't have your details in our database. Kindly register`});
            // or you could create a new account
        }
    });
}));