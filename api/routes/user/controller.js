const model = require('./model');
const postModel = require('../post/model');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
        user: config.email_user,
        pass: config.email_password
    }
});

module.exports = {
    login: (req, res) => {
        // Function just to verify transporter connection
        // transporter.verify(function(error, success) {
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log("Server is ready to take our messages");
        //     }
        //   });
        model.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                res.send({ auth: false, msg: 'Username does not exist.' });
                return;
            }

            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    let token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
                    let u = user.toObject();
                    delete u.password;
                    res.status(200).send({ auth: true, token, user: u });
                    return;
                }
                res.send({ auth: false, msg: 'Password is incorrect.' });
            });
        })
        .catch(err => {
            res.send({ auth: false, msg: 'An internal server error has occurred.' });
            return;
        });
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
        newUser.save()
        .then(result => {
            let token = jwt.sign({ id: result._id }, config.secret, { expiresIn: 86400 });
            let email_token = jwt.sign({ id: result._id }, config.email_secret, { expiresIn: 86400 });
            let u = result.toObject();
            // Need to implement the email verification part
            const email_url = `http://localhost:3000/user/confirmation/${email_token}`;
            transporter.sendMail({
                to: result.email,
                from: 'Camagru <donotreply@camagru42.com>',
                subject: 'Camagru - E-mail confirmation',
                html: `Please click this link to confirm your e-mail: <a href="${email_url}">${email_url}</a>`
            }).then(response => {
                return res.status(200).send({ auth: true, token, user: u });
            }).catch(err => {
                return res.status(200).send({ auth: true, token, user: u });
            })
            // // u = user, send token and new user as result.
            // let u = result.toObject();
            // console.log(u);
            // return res.status(200).send({ auth: true, token, user: u });
        })
        .catch(err => {
            if (err.code == 11000) {
                return res.send({ auth: false, msg: 'Username or e-mail already registered.' });
            } else {
                return res.send({ auth: false, msg: 'An internal server error has occurred.' });
            }
        })
    },
    emailVerification: async (req, res) => {
        let user_id = jwt.verify(req.params.token, config.email_secret).id;
        try {
            let doc = await model.findOne({ _id: user_id });
            if (!doc) {
                return res.send({ success: false, msg: 'Invalid token. E-mail verification failed.' });
            }
            doc.verified = true;
            await doc.save();
            //res.send({ success: true, msg: 'E-mail verified.' });
            return res.redirect('http://localhost:8080/');
        }
        catch(err) {
            return res.send({ success: false, msg: 'An internal server error has occurred.' });
        }
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
    },
    getData: (req, res) => {
        let user_id = jwt.decode(req.body.auth_token).id;
        model.findById(user_id).select('-password')
            .then(user => {
                if (!user) {
                    res.send({ success: false, msg: 'User not found' });
                }
                else {
                    res.send( {
                        success: true,
                        details: user
                    })
                }
            });
    },
    updateInformation: async (req, res) => {
        let user_id = jwt.decode(req.body.auth_token).id;

        try {
            let doc = await model.findOne({ _id: user_id });
            if (!doc) {
                return res.send({ auth: false, msg: 'User ID not found.' });
            }
            let update = {}
            let fields = ['username', 'email', 'password', 'notifications'];
            for (const key in req.body) {
                if (fields.indexOf(key) === -1 || req.body[key] === '') continue;
                // example: key = username, req.body[key] = 'Renato'
                if (key === 'username') {
                    if (req.body[key].length < 6 || req.body[key].length > 12) {
                        return res.send({ auth: false, msg: 'Username needs to have between 6 and 12 characters.' });
                    }
                    if (await model.findOne({username: req.body[key]})) {
                        return res.send({ auth: false, msg: 'Username already in use.' });
                    }
                    doc.username = req.body[key];
                } else if (key === 'email') {
                    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body[key])) {
                        return res.send({ auth: false, msg: 'Please enter a valid e-mail.' });
                    }
                    if (await model.findOne({email: req.body[key]})) {
                        return res.send({ auth: false, msg: 'E-mail already in use.' });
                    }
                    doc.verified = false;
                    // Insert sendEmail function!!
                    doc.email = req.body[key];
                } else if (key === 'password') {
                    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+-]).{8,}$/.test(req.body[key])) {
                        return res.send({ auth: false, msg: 'Password needs at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.' });
                    }
                    doc.password = req.body[key];
                } else if (key === 'notifications') {
                    doc.notifications = req.body[key];
                }
            }
            await doc.save();
            return res.send({ auth: true, msg: 'User information updated.'})
        }
        catch(err) {
            return res.send({ auth: false, msg: 'An internal server error has occurred.' });
        }
    },
    getUsername: (req, res) => {
        model.findOne({ _id: req.body.userId }, (err, user) => {
                if (!user) {
                    res.send({ success: false, msg: 'ID not found' });
                }
                else {
                    res.send( {
                        success: true,
                        username: user.username
                    })
                }
            });
    },
    resetPassword: async (req, res) => {
        let new_password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        // Resetting the password
        try {
            let doc = await model.findOne({ email: req.body.email });
            if (!doc) {
                return res.send({ success: false, msg: 'E-mail was not found.' });
            }
            doc.password = new_password;
            await doc.save();
        }
        catch(err) {
            return res.send({ success: false, msg: 'An internal server error has occurred resetting the password.' });
        }
        // Now sending email!
        try {
            transporter.sendMail({
                to: req.body.email,
                from: 'Camagru <donotreply@camagru42.com>',
                subject: 'Camagru - Reset password',
                html: `Your new password is: <strong>${new_password}</strong><br>Please don't forget to change it.`
            });
            return res.send({ success: true, msg: 'The e-mail has been sent.' });
        }
        catch(err) {
            return res.send({ success: false, msg: 'An internal server error has occurred while trying to sent the e-mail.' });
        }
    },
    notificationEmail: async (req, res) => {
        try {
            let doc = await model.findOne({ _id: req.body.id });
            if (!doc) {
                return res.send({ success: false, msg: 'E-mail was not found.' });
            }
            transporter.sendMail({
                to: doc.email,
                from: 'Camagru <donotreply@camagru42.com>',
                subject: 'Camagru - Notificatoin',
                html: `You received a comment in your picture, check it out!!`
            });
        }
        catch(err) {
            throw err;
        }
    }
}
