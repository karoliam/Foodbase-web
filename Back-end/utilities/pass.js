'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const bcryptjs = require('bcryptjs');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { getUserLogin } = require('../models/userModel');

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
        const params = [username];
        try {
            const [user] = await getUserLogin(params);
            // TODO: Remove this log before final release
            console.log('Local strategy', user); // result is binary row
            if (user === undefined) {
                return done(null, false, {message: 'Incorrect email or password.'});
            }
            if (!await bcryptjs.compare(password, user.password)) {
                return done(null, false, {message: 'Incorrect email or password.'});
            }
            delete user.password;
            return done(null, {...user}, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
        } catch (err) {
            return done(err);
        }
    }));

// JWT strategy for handling bearer token
// added a line in .env for secret, e.g. secretOrKey: process.env.JWT_SECRET

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, done) => {
    done(null, jwtPayload);
}));


module.exports = passport;