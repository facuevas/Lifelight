const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Account = require('../models/account.model');
const Lifelight = require('../models/lifelight.model');

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

router.route('/show_accounts').get((req, res) => {
    Account.find()
        .then(acc => res.json(acc))
        .catch(err => res.status(400).json('ERROR: ') + err);
});

module.exports = router;