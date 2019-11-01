const router = require('express').Router();
const controller = require('./controller');

router.post('/login', controller.login); // http://host/user/login
router.post('/register', controller.register);

module.exports = router;