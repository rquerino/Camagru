const model = require('./model');
const postModel = require('../post/model');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

module.exports = {
    login: (req, res) => {
        model.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                res.send({ auth: false, msg: 'An internal server error has occurred.' });
                return;
            }
            if (!user) {
                res.send({ auth: false, msg: 'Username does not exist.' });
                return;
            }
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    let token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
                    res.status(200).send({ auth: true, token });
                    return;
                }
                res.send({ auth: false, msg: 'Password is incorrect.' });
            });
        })
    },
    register: (req, res) => {

        let newUser = new model({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        // Checking formats!
        if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(newUser.email)) {
            res.send({ auth: false, msg: 'Please enter a valid e-mail.' });
            return;
        }
        if (newUser.username.length < 6 || newUser.username.length > 12) {
            res.send({ auth: false, msg: 'Username needs to have between 6 and 12 characters.' });
            return;
        }
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+-]).{8,}$/.test(newUser.password)) {
            res.send({ auth: false, msg: 'Password needs at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.' });
            return;
        }
        // It's saving the user and creating a token.
        // Need to implement the email verification part
        newUser.save()
        .then(result => {
            let token = jwt.sign({ id: result._id }, config.secret, { expiresIn: 86400 });
            res.status(200).send({ auth: true, token });
        })
        .catch(err => {
            if (err.code == 11000) {
                res.send({ auth: false, msg: 'Username or e-mail already registered.' });
            } else {
                res.send({ auth: false, msg: 'An internal server error has occurred.' });
            }
        })
    },
    getProfile: (req, res) => {
        let user_id = jwt.decode(req.body.auth_token).id;
        model.findById(user_id)
            .then(user => {
                if (!user) {
                    res.send({ success: false, msg: 'User not found' });
                }

                postModel.find({ user_id: user_id })
                    .then(posts => {
                        res.send({
                            success: true,
                            details: {
                                username: user.username,
                                posts: posts
                            }
                        })
                    })
            });
    }
}
