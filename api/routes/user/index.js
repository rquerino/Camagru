const router = require('express').Router();
const controller = require('./controller');

router.post('/login', controller.login); // http://host/user/login
router.post('/register', controller.register);
router.post('/getprofile', controller.getProfile);
router.post('/getdata', controller.getData);
router.post('/getusername', controller.getUsername);
// router.post('/password', controller.changePassword);
router.post('/config', controller.updateInformation);
// router.post('/verify', controller.verifyEmail);

module.exports = router;
