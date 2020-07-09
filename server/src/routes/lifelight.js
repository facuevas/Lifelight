const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Lifelight = require('../models/lifelight.model');
const Account = require('../models/account.model');

router.post('/create_lifelight', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Store the new requested lifelight into a variable
    const newLifelight = req.body;
    // Append the created_by field by the requested user's id
    newLifelight.created_by = req.user._id;
    // Create the new lifelight into a Lifelight object
    const lifelight = new Lifelight(newLifelight);
    // Save into the database
    lifelight.save(err => {
        // Throw error if there is one
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
        }
        else {
            // Push into the lifelights list on the Account model
            req.user.lifelights.push(lifelight);
            // Save the changes.
            req.user.save(err => {
                // Throw error if there is one
                if (err) {
                    res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
                }
                // Send a response indicating that the lifelight was successfully created
                else {
                    res.status(200).json({message: {msgBody: "Lifelight successfully created!", msgError: false}});
                }
            })
        }
    })
});

router.get('/lifelights', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findById({_id: req.user._id}).populate('lifelights').exec((err, document) => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
        }
        else {
            res.status(200).json({lifelights: document.lifelights, authenicated: true});
        }
    });
});

// TODO -> GO TO THE REQUEST USER'S FOLLOWING LIST. IN THE FOLLOWING LIST, QUERY ALL LIFELIGHTS THAT ARE CREATED BY THAT USER
// STORE IN A TEMPORARY JSON OBJECT. RETURN IT AS THE RESULT.
// HAS SOME BUGS. WILL WORK ON LATER.
//
router.get('/feed', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findById({_id: req.user._id}, (err, acc) => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
        }
        else {
            // Grab the followers list
            const followings = acc.following;
            let results = [];
            Lifelight.find().where('created_by').in(followings).exec((err, records) => {
                if (err) {
                    res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
                }
                else {
                    const sortedLifelights = records.sort((a, b) => b.createdAt - a.createdAt);
                    res.status(200).json({feed: sortedLifelights, authenticated: true});
                }
            })
        }
    })
});

router.get('/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findOne({username: req.params.username}).populate('lifelights').exec((err, document) => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
        }
        else {
            if (!document) {
                res.status(404).json({message: {msgBody: "User not found", msgError: true}});
            }
            else {
                res.status(200).json({lifelights: document.lifelights, authenicated: true});
            }
        }
    });
});


router.get('/:username/:lifelight_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Query the account
    let lifelight = req.params.lifelight_id;
    Account.findOne({username: req.params.username}, (err, acc) => {
        // If there is an error, throw one
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
        }
        else {
            // Check if the account exists
            if (!acc) {
                res.status(404).json({message: {msgBody: "User not found", msgError: true}});
            }
            else {
                // Check if the lifelight belongs to the user
                if (acc.lifelights.includes(lifelight)) {
                    Lifelight.findById({_id: lifelight}, (err, document) => {
                        if (err) {
                            res.status(500).json({message: {msgBody: "Error retrieving lifelight", msgError: true}});
                        }
                        else {
                            res.status(200).json({username: req.params.username, lifelight: document});
                        }
                    });
                }
                else {
                    res.status(404).json({message: {msgBody: "Lifelight not found", msgError: true}});
                }
            }
        }
    })
});

router.delete('/:username/:lifelight_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (req.params.username !== req.user.username) {
        res.status(401).json({message: {msgBody: "You can only delete your own lifelights.", msgError: true}});
    }
    else {
        Lifelight.deleteOne({_id: req.params.lifelight_id}, (err, ll) => {
            if (err) {
                res.status(401).json({message: {msgBody: "Lifelight cannot be deleted", msgError: true}});
            }
            else {
                res.status(200).json({message: {msgBody: "LIfelight successfully deleted", msgError: false}});
            }
        })
    }
});

module.exports = router;