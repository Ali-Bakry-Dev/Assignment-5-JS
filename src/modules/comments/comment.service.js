const commentRepository = require('./comment.repository');
const userRepository = require('../users/user.repository');
const postRepository = require('../posts/post.repository');

const parsePositiveId = (value, fieldName) => {
const id = Number(value);

if (!Number.isInteger(id) || id <= 0) {
throw new Error("Invalid ${fieldName}");
}

return id;
};

const validateContent = (content) => {
if (typeof content !== 'string' || !content.trim()) {
throw new Error('Content is required');
}

return content.trim();
};

// 1. Bulk create comments
const createManyComments = async (comments) => {
if (!Array.isArray(comments) || comments.length === 0) {
throw new Error('Comments must be a non-empty array');
}

const validatedComments = [];

for (const comment of comments) {
const content = validateContent(comment.content);
const postId = parsePositiveId(comment.postId, 'post ID');
const userId = parsePositiveId(comment.userId, 'user ID');

const user = await userRepository.findUserById(userId);
if (!user) {
  throw new Error(`User ${userId} not found`);
}

const post = await postRepository.findPostById(postId);
if (!post) {
  throw new Error(`Post ${postId} not found`);
}

validatedComments.push({
  content,
  postId,
  userId,
});

}

return await commentRepository.createManyComments(validatedComments);
};

// 2. Update comment content only if the requester owns it
const updateComment = async (commentId, userId, content) => {
const id = parsePositiveId(commentId, 'comment ID');
const requesterId = parsePositiveId(userId, 'user ID');
const updatedContent = validateContent(content);

const comment = await commentRepository.findCommentById(id);

if (!comment) {
throw new Error('Comment not found');
}

if (comment.userId !== requesterId) {
throw new Error('You are not the owner of this comment');
}

return await commentRepository.updateCommentContent(
id,
updatedContent
);
};

// 3. Find a comment or create it if it doesn't exist
const findOrCreateComment = async (commentData) => {
const postId = parsePositiveId(commentData.postId, 'post ID');
const userId = parsePositiveId(commentData.userId, 'user ID');
const content = validateContent(commentData.content);

const user = await userRepository.findUserById(userId);
if (!user) {
throw new Error('User not found');
}

const post = await postRepository.findPostById(postId);
if (!post) {
throw new Error('Post not found');
}

const existingComment =
await commentRepository.findCommentByPostUserContent(
postId,
userId,
content
);

if (existingComment) {
return {
comment: existingComment,
created: false,
};
}

const comment = await commentRepository.createComment({
postId,
userId,
content,
});

return {
comment,
created: true,
};
};

// 4. Search comments and count matches
const searchComments = async (word) => {
if (typeof word !== 'string' || !word.trim()) {
throw new Error('Search word is required');
}

const searchWord = word.trim();

const [comments, count] = await Promise.all([
commentRepository.searchComments(searchWord),
commentRepository.countMatchingComments(searchWord),
]);

return {
count,
comments,
};
};

// 5. Get the newest three comments for a post
const getNewestComments = async (postId) => {
const id = parsePositiveId(postId, 'post ID');

const post = await postRepository.findPostById(id);

if (!post) {
throw new Error('Post not found');
}

return await commentRepository.findNewestComments(id);
};

// 6. Get one comment with its user and post information
const getCommentDetails = async (commentId) => {
const id = parsePositiveId(commentId, 'comment ID');

const comment = await commentRepository.findCommentDetails(id);

if (!comment) {
throw new Error('Comment not found');
}

return comment;
};

module.exports = {
createManyComments,
updateComment,
findOrCreateComment,
searchComments,
getNewestComments,
getCommentDetails,
};