const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema = Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
});

const model = mongoose.model('post', postSchema);

module.exports = model;
