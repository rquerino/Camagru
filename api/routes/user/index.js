const router = require('express').Router();
const controller = require('./controller');

// All links are http://localhost:3000/user/WHATEVER
router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/confirmation/:token', controller.emailVerification);
router.post('/getprofile', controller.getProfile);
router.post('/getdata', controller.getData);
router.post('/getusername', controller.getUsername);
router.post('/config', controller.updateInformation);
// reset password link to email
router.post('/resetpassword', controller.resetPassword);
router.post('/notification', controller.notificationEmail);
// router.post('/verify', controller.verifyEmail);

module.exports = router;
