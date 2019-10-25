const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

// static functions are not related to documents, methods are.
// example: schema.methods.name // schema.statics.name

// await: read more about
schema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', schema);
