const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const JwtStrategy = require('passport-jwt').Strategy;
const Account = require('./models/account.model');
require('dotenv').config();

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }
    return token;
}

// authenticate the user
passport.use(new LocalStrategy((username, password, done) => {
    Account.findOne({username}, (err, acc) => {
        if (err) {
            return done(err);
        }
        if (!acc) {
            return done(null, false);
        }
        acc.comparePassword(password, done);
    });
}));

// authorize the user
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.SECRET_KEY
}, (payload, done) => {
    Account.findById({_id: payload.sub}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }) 
}));