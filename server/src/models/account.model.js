const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');

const Schema = mongoose.Schema;

const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
    lifelights: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lifelight'}]
}, {
    timestamps: true
});

accountSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrpyt.hash(this.password, 10, (err, passwordHash) => {
        if (err) {
            return next(err);
        }
        this.password = passwordHash;
        next();
    });
});

accountSchema.methods.comparePassword = function(password, callback) {
    bcrpyt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return callback(error);
        }
        else {
            if (!isMatch) {
                return callback(null, isMatch);
            }
            return callback(null, this);
        }
    });
}

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;