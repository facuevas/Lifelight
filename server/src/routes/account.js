const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Account = require('../models/account.model');
require('dotenv').config();

const signToken = accID => {
    return JWT.sign({
        iss: "LIFELIGHT-LTD",
        sub: accID
    }, process.env.SECRET_KEY, {expiresIn: "1h"});
}

router.post('/register', (req, res) => {
    const {username, password, email} = req.body;
    Account.findOne({username}, (err, acc) => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
        }
        if (acc) {
            res.status(401).json({message: {msgBody: "Username already taken. Try again.", msgError: true}});
        }
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

router.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
    if (req.isAuthenticated()) {
        const {_id, username} = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        res.status(200).json({isAuthenticated: true, user: {username}}); 
    }
});


router.get('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.clearCookie('access_token');
    res.json({user: {username: ""}, success: true});
});

router.get('/authenticated', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {username} = req.user;
    res.status(200).json({isAuthenticated: true, user: {username}});
})

router.get('/show_accounts', ((req, res) => {
    Account.find()
        .then(acc => res.json(acc))
        .catch(err => res.status(400).json('ERROR: ') + err);
}));

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
})

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
})

// router.post('/:username/unfollow', passport.authenticate('jwt', {session: false}), (req, res) => {
//     Account.findOne({username: req.params.username}).populate('_id').exec((err, document) => {
//         if (err) {
//             res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
//         }
//         else {
//             //console.log(document._id._id);
//             req.user.following = req.user.following.filter(id => id === document._id._id);
//             req.user.save(err => {
//                 if (err) {
//                     res.status(400).json({message: {msgBody: "Error has occured unfollowing", msgError: true}});
//                 }
//                 else {
//                     res.status(200).json({message: {msgBody: "You have stopped following this user", msgError: false}});
//                 }
//             })
//         }
//     })
// })

module.exports = router;