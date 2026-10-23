const postService = require('./post.service');

const createPost = async (req, res) => {
try {
const post = await postService.createPost(req.body);

return res.status(201).json({
  message: 'Post created successfully',
  data: post,
});

} catch (error) {
if (
error.message === 'Title, content, and userId are required' ||
error.message === 'Invalid user ID'
) {
return res.status(400).json({
message: error.message,
});
}

if (error.message === 'User not found') {
  return res.status(404).json({
    message: error.message,
  });
}

console.error(error);

return res.status(500).json({
  message: 'Internal server error',
});

}
};

const deletePost = async (req, res) => {
try {
const { userId } = req.body;

await postService.deletePost(req.params.postId, userId);

return res.status(200).json({
  message: 'Post deleted successfully',
});

} catch (error) {
if (
error.message === 'Invalid post ID' ||
error.message === 'Invalid user ID'
) {
return res.status(400).json({
message: error.message,
});
}

if (error.message === 'Post not found') {
  return res.status(404).json({
    message: error.message,
  });
}

if (error.message === 'You are not the owner of this post') {
  return res.status(403).json({
    message: error.message,
  });
}

console.error(error);

return res.status(500).json({
  message: 'Internal server error',
});

}
};

const getPostsDetails = async (req, res) => {
try {
const posts = await postService.getPostsDetails();

return res.status(200).json({
  message: 'Posts retrieved successfully',
  data: posts,
});

} catch (error) {
console.error(error);

return res.status(500).json({
  message: 'Internal server error',
});

}
};

const getPostsCommentCount = async (req, res) => {
try {
const posts = await postService.getPostsCommentCount();

return res.status(200).json({
  message: 'Post comment counts retrieved successfully',
  data: posts,
});

} catch (error) {
console.error(error);

return res.status(500).json({
  message: 'Internal server error',
});

}
};

module.exports = {
createPost,
deletePost,
getPostsDetails,
getPostsCommentCount,
};