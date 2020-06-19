const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lifelightSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        unique: true,
        auto: true
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    is_positive: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    }
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Lifelight = mongoose.model('Lifelight', lifelightSchema);

module.exports = Lifelight;