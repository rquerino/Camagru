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
    },
    likes: {
        type: [String],
        required: false
    },
    comments: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        text: {
            type: String
        }
    }]
});

const model = mongoose.model('post', postSchema);

module.exports = model;
