const router = require('express').Router();
const controller = require('./controller');

router.post('/newpost', controller.newpost);
router.get('/getposts', controller.getposts);
router.post('/likepost', controller.like);
router.post('/comment', controller.comment);
router.post('/delete', controller.delete);

module.exports = router;
