const express = require('express');
const commentController = require('./comment.controller');

const router = express.Router();

router.post('/find-or-create', commentController.findOrCreateComment);
router.get('/search', commentController.searchComments);
router.get('/newest/:postId', commentController.getNewestComments);
router.get('/details/:id', commentController.getCommentDetails);

router.post('/', commentController.createManyComments);
router.patch('/:commentId', commentController.updateComment);

module.exports = router;