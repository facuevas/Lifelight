const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Lifelight = require('../models/lifelight.model');
const Account = require('../models/account.model');

router.post('/create_lifelight', passport.authenticate('jwt', {session: false}), (req, res) => {
    const lifelight = new Lifelight(req.body);
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

router.get('/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Account.findOne({username: req.params.username}).populate('lifelights').exec((err, document) => {
        if (err) {
            res.status(500).json({message: {msgBody: "Error has occured. Try again", msgError: true}});
        }
        else {
            res.status(200).json({lifelights: document.lifelights, authenicated: true})
        }
    });
});

module.exports = router;