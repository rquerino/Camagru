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
        model.find()
            .then(result => {
                res.send(result);
            });
    }
}
