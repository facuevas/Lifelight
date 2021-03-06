const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lifelightSchema = new Schema({
    lifelight_type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Account'
    }
}, {
    timestamps: true
});

const Lifelight = mongoose.model('Lifelight', lifelightSchema);

module.exports = Lifelight;