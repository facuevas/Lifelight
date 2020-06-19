const router = require('express').Router();
const Lifelight = require('../models/lifelight.model');

router.route('/').get((req, res) => {
    Lifelight.find()
        .then(lifelight => res.json(lifelight))
        .catch(err => res.status(400).json("ERROR: " + err));
});

router.route('/:id').get((req, res) => {
    Lifelight.findById(req.params._id)
        .then(lifelight => res.json(lifelight))
        .catch(err => res.status(400).json("ERROR" + err));
});

