const router = require('express').Router();
const Account = require('../models/account.model');

router.route('/create_account').post((req, res) => {
    const accountInfo = {
        username: req.body.username,
        email: req.body.email,
    };
    const newAccount = new Account(accountInfo);
    newAccount.save()
        .then(() => res.json("Account created successfully!"))
        .catch(err => res.status(400).json('ERROR: ' + err));
});

router.route('/show_accounts').get((req, res) => {
    Account.find()
        .then(acc => res.json(acc))
        .catch(err => res.status(400).json('ERROR: ') + err);
});

module.exports = router;