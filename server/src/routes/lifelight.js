const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Lifelight = require('../models/lifelight.model');
const Account = require('../models/account.model');

// This POST request is to create a new lifelight for the user.
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

// This GET request is to retrieve all of the user's lifelights
router.get('/lifelights', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Query the database to retrieve the user's account
    Account.findById({_id: req.user._id}).populate('lifelights').exec((err, document) => {
        // Throw error if it exists
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
        }
        // Return the user's list of lifelights
        else {
            res.status(200).json({lifelights: document.lifelights, authenicated: true});
        }
    });
});

// This GET request is to retrieve the lifelights of the users they are following sorted by newly created 
router.get('/feed', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Query the Account collection and find the user's Account
    Account.findById({_id: req.user._id}, (err, acc) => {
        // Throw error if it exists
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
        }
        // Otherwise do the following:
        else {
            // Grab the followers list
            const followings = acc.following;
            // Query the Lifelight collection to grab all the lifelights that are created by 
            // the IDs in the followings list
            Lifelight.find().where('created_by').in(followings).exec((err, records) => {
                // Throw error if it exists
                if (err) {
                    res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
                }
                else {
                    // Sort the records found in order of newly created
                    const sortedLifelights = records.sort((a, b) => b.createdAt - a.createdAt);
                    // Send a response with the sorted lifelights
                    res.status(200).json({feed: sortedLifelights, authenticated: true});
                }
            })
        }
    })
});

// This GET request retrieves the lifelights of the requested username
router.get('/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Query the database and find an Account with the requested username parameter
    Account.findOne({username: req.params.username}).populate('lifelights').exec((err, document) => {
        // Throw error if it exists
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
        }
        else {
            // If there is no document found, no Account of that username exists
            if (!document) {
                res.status(404).json({message: {msgBody: "User not found", msgError: true}});
            }
            // Send a response with the requested username's lifelights
            else {
                res.status(200).json({lifelights: document.lifelights, authenicated: true});
            }
        }
    });
});

// This GET request retrieves an individual lifelight from the requested username
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
                    // Grab the lifelight by the id
                    Lifelight.findById({_id: lifelight}, (err, document) => {
                        // Throw error if it exists
                        if (err) {
                            res.status(500).json({message: {msgBody: "Error retrieving lifelight", msgError: true}});
                        }
                        // Send a response back with the requested username and lifelight
                        else {
                            res.status(200).json({username: req.params.username, lifelight: document});
                        }
                    });
                }
                // Throw an error if the lifelight id is not in the list of lifelights for the requested username
                else {
                    res.status(404).json({message: {msgBody: "Lifelight not found", msgError: true}});
                }
            }
        }
    })
});

//TODO? -> Since we added a created_by field, we can use that to verify if the lifelight is owned by the requested user
// Will do later. The current route still works.

// This DELETE request deletes a lifelight
router.delete('/:username/:lifelight_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Check if the requested username also matches the request user's username
    // If they do not match, we do now allow them to delete. It is not their lifelight.
    if (req.params.username !== req.user.username) {
        res.status(401).json({message: {msgBody: "You can only delete your own lifelights.", msgError: true}});
    }
    // Find the lifelight and delete it
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