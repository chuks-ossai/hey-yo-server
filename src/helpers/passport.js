const passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    appConfig = require('../config/app')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = appConfig.jwtSecret;
module.exports = passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload.sub);
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
        if (err) {
            return done(err, false, `Sorry we don't have your details in our database. Kindly login`);
        }
        if (user) {
            return done(null, user.toObject());
        } else {
            return done(null, false, `Sorry we don't have your details in our database. Kindly register`);
            // or you could create a new account
        }
    });
}));