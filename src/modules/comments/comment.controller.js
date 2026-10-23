const commentService = require('./comment.service');

const handleError = (res, error) => {
const badRequestErrors = [
'Comments must be a non-empty array',
'Content is required',
'Search word is required',
'Invalid comment ID',
'Invalid user ID',
'Invalid post ID',
];

if (
badRequestErrors.includes(error.message) ||
error.message.startsWith('User ') ||
error.message.startsWith('Post ')
) {
if (
error.message === 'User not found' ||
error.message === 'Post not found' ||
error.message.endsWith('not found')
) {
return res.status(404).json({ message: error.message });
}

return res.status(400).json({ message: error.message });

}

if (
error.message === 'Comment not found' ||
error.message === 'User not found' ||
error.message === 'Post not found'
) {
return res.status(404).json({ message: error.message });
}

if (error.message === 'You are not the owner of this comment') {
return res.status(403).json({ message: error.message });
}

if (error.code === 'P2003') {
return res.status(400).json({
message: 'Invalid user ID or post ID',
});
}

console.error(error);

return res.status(500).json({
message: 'Internal server error',
});
};

// POST /comments
const createManyComments = async (req, res) => {
try {
const result = await commentService.createManyComments(
req.body.comments
);

return res.status(201).json({
  message: 'Comments created successfully',
  count: result.count,
});

} catch (error) {
return handleError(res, error);
}
};

// PATCH /comments/:commentId
const updateComment = async (req, res) => {
try {
const { userId, content } = req.body;

const comment = await commentService.updateComment(
  req.params.commentId,
  userId,
  content
);

return res.status(200).json({
  message: 'Comment updated successfully',
  data: comment,
});

} catch (error) {
return handleError(res, error);
}
};

// POST /comments/find-or-create
const findOrCreateComment = async (req, res) => {
try {
const result = await commentService.findOrCreateComment(req.body);

return res.status(result.created ? 201 : 200).json({
  message: result.created
    ? 'Comment created successfully'
    : 'Comment already exists',
  data: result.comment,
  created: result.created,
});

} catch (error) {
return handleError(res, error);
}
};

// GET /comments/search?word=...
const searchComments = async (req, res) => {
try {
const result = await commentService.searchComments(req.query.word);

return res.status(200).json({
  message: 'Comments retrieved successfully',
  count: result.count,
  data: result.comments,
});

} catch (error) {
return handleError(res, error);
}
};

// GET /comments/newest/:postId
const getNewestComments = async (req, res) => {
try {
const comments = await commentService.getNewestComments(
req.params.postId
);

return res.status(200).json({
  message: 'Newest comments retrieved successfully',
  count: comments.length,
  data: comments,
});

} catch (error) {
return handleError(res, error);
}
};

// GET /comments/details/:id
const getCommentDetails = async (req, res) => {
try {
const comment = await commentService.getCommentDetails(
req.params.id
);

return res.status(200).json({
  message: 'Comment details retrieved successfully',
  data: comment,
});

} catch (error) {
return handleError(res, error);
}
};

module.exports = {
createManyComments,
updateComment,
findOrCreateComment,
searchComments,
getNewestComments,
getCommentDetails,
};