const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Account = require('../models/account.model');
require('dotenv').config();

// Sign token for our JWT authentication passport service
const signToken = accID => {
    return JWT.sign({
        iss: "LIFELIGHT-LTD",
        sub: accID
    }, process.env.SECRET_KEY, {expiresIn: "1h"});
};

// This POST request allows a new account to be registered and created
router.post('/register', (req, res) => {
    // Grab the username, password, and email fields from the request body
    const {username, password, email} = req.body;
    // Query the database to see if a username that the request body contains already exists
    Account.findOne({username}, (err, acc) => {
        // Throw an error if it exists
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
        }
        // If the account already exists with that username, throw an error and do not let it create an account
        if (acc) {
            res.status(401).json({message: {msgBody: "Username already taken. Try again.", msgError: true}});
        }
        // Create the account
        else {
            const newAccount = new Account({username, password, email});
            newAccount.save(err => {
                if (err) {
                    res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
                }
                else {
                    res.status(201).json({message: {msgBody: "Account successfully created", msgError: true}});
                }
            });
        }
    });
});

// This POST request allows our user to login our service
router.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
    // Check if the requested body is authenticated
    if (req.isAuthenticated()) {
        const {_id, username} = req.user;
        // Sign on with the sign token
        const token = signToken(_id);
        // Send a cookie back with the access token
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        // Send a response back verifying the login
        res.status(200).json({isAuthenticated: true, account: {username}}); 
    }
});

// This GET request allows our user to logout of our service
router.get('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Clear the session access token from the cookies
    res.clearCookie('access_token');
    // Send a response back with an empty username indicated that they logged out
    res.json({account: {username: ""}, success: true});
});

// Used for our clientside to check if the user is logged into our service
router.get('/authenticated', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {username} = req.user;
    res.status(200).json({isAuthenticated: true, account: {username}});
});

// Gets a user's list they are following
router.get('/following', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findById({_id: req.user._id}).populate('following').exec((err, document) => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured displaying following list.", msgError: true}});
        }
        else {
            res.status(200).json({following: document.following, authenticated: true});
        }
    })
});

// Gets a user's list of followers
router.get('/followers', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findById({_id: req.user._id}).populate('followers').exec((err, document) => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured displaying followers list", msgError: true}});
        }
        else {
            res.status(200).json({followers: document.followers, authenticated: true});
        }
    })
});

// Adds a another user to the user's following list
// and conversely adds the user to the other user's followers list
router.post('/:username/follow', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findOne({username: req.params.username}, (err, acc) => {
        acc.followers.push(req.user._id);
        let followedUser = acc._id;
        acc.save((err) => {
            if (err) {
                res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
            }
            else {
                Account.findOne({username: req.user.username}, (err, acc) => {
                    acc.following.push(followedUser);
                    acc.save((err) => {
                        if (err) {
                            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
                        }
                        else {
                            res.status(500).json({message: {msgBody: "Success", msgError: false}});
                        }
                    })
                })
            }
        })
    })
});


// Unfollows the account. Removes the other user from the user's following list.
// Conversely, Removes the user from the other user's followers list
router.post('/:username/unfollow', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findOne({username: req.params.username}, (err, acc) => {
        acc.followers.pull(req.user._id);
        let followedUser = acc._id;
        acc.save((err) => {
            if (err) {
                res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
            }
            else {
                Account.findOne({username: req.user.username}, (err, acc) => {
                    acc.following.pull(followedUser);
                    acc.save((err) => {
                        if (err) {
                            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
                        }
                        else {
                            res.status(500).json({message: {msgBody: "Success", msgError: false}});
                        }
                    })
                })
            }
        })
    })
});

module.exports = router;