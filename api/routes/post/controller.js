const model = require('./model');
const jwt = require('jsonwebtoken');
const userModel = require('../user/model');

module.exports = {
    newpost: (req, res) => {
        let user_id = jwt.decode(req.body.auth_token).id;

        userModel.findById(user_id)
        .then(result => {
            if (!result) {
                res.send({ success: false, msg: 'Username could not be found' })
                return;
            }
            let newpost = new model({
                user_id: user_id,
                username: result.username,
                image: req.body.image,
                desc: req.body.desc
            });

            newpost.save()
                .then(result => {
                    res.send({ success: true, result: result });
                })
                .catch(err => {
                    if (err) res.send({ success: false, error: err })
                });
        })
    },
    getposts: (req, res) => {
        model.find().sort({ $natural: -1}).skip(req.body.offset).limit(10).populate({
            path: 'comments.user_id',
            select: 'username'
        }).then(result => {
            res.send(result);
        });
        // model.find().sort({ $natural: -1}).populate({
        //     path: 'comments.user_id',
        //     select: 'username'
        //     })
        //     .then(result => {
        //         res.send(result);
        //     });
    },
    like: (req, res) => {
        let user_id = jwt.decode(req.body.auth_token).id;
        model.findById(req.body.postId, function (err, user) {
            if (err) {
                res.send({ liked: false });
            } else {
                let index = user.likes.indexOf(user_id);
                if (index == -1) {
                    user.likes.push(user_id);
                    user.save();
                    res.send({ liked: true });
                } else {
                    user.likes.pull(user_id);
                    user.save();
                    res.send({ liked: false });
                }
            }
        });
    },
    comment: (req, res) => {
        model.findById(req.body.postId, function (err, user) {
            if (err) {
                res.send({ success: false });
            } else {
                user.comments.push({
                    user_id: req.body.userId,
                    text: req.body.text
                });
                user.save();
                res.send({ success: true });
            }
        });
    },
    delete: (req, res) => {
        model.findByIdAndDelete(req.body.id, function (err) {
            if(err) {
                return res.send({ success: false, msg: 'An internal error has occurred.'});
            }
            return res.send({ success: true, msg: 'Post deleted.'});
        });
    }
}
