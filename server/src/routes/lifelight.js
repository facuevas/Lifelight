const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Lifelight = require('../models/lifelight.model');
const Account = require('../models/account.model');

router.post('/create_lifelight', passport.authenticate('jwt', {session: false}), (req, res) => {
    const newLifelight = req.body;
    newLifelight.created_by = req.user._id;
    const lifelight = new Lifelight(newLifelight);
    lifelight.save(err => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
        }
        else {
            req.user.lifelights.push(lifelight);
            req.user.save(err => {
                if (err) {
                    res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
                }
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
            Account.find().where('_id').in(followings).exec((err, records) => {
                let lifelight_ids = [];
                if (err) {
                    res.status(500).json({message: {msgBody: "Error has occured", msgError: true}});
                }
                else {
                    // might be buggy. will need to fix later.
                    console.log(records);
                    for (let i = 0; i < records.length; i++) {
                        console.log(records[i].length);
                        for (let j = 0; j < records[i].length; j++) {
                            lifelight_ids.push(records.lifelights[i][j]);
                            console.log(records.lifelights[i][j]);
                        }
                    }
                    console.log(lifelight_ids);
                }
            });
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