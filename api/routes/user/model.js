const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    account_created: {
        type: String,
        default: Date.now()
    },
    verified: {
        type: Boolean,
        default: false
    },
    notifications: {
        type: Boolean,
        default: true
    }
});

// Pre-save (before saving)
userSchema.pre('save', function (next) {
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// cb = callback
userSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
      if (err) {
        return cb(err, false);
      }
      return cb(null, isMatch);
    });
};

// Need to create using Nodemailer
// userSchema.methods.verifyEmail = function() {

// }

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
