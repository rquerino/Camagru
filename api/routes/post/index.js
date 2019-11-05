const router = require('express').Router();
const controller = require('./controller');

router.post('/newpost', controller.newpost);
router.get('/getposts', controller.getposts);
router.get('/likepost', controller.like);

module.exports = router;
