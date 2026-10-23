const express = require('express');
const postController = require('./post.controller');

const router = express.Router();

router.post('/', postController.createPost);

router.get('/details', postController.getPostsDetails);

router.get('/comment-count', postController.getPostsCommentCount);

router.delete('/:postId', postController.deletePost);

module.exports = router;