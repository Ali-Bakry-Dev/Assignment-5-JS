const postRepository = require('./post.repository');
const userRepository = require('../users/user.repository');

const createPost = async (postData) => {
const { title, content, userId } = postData;

if (
typeof title !== 'string' ||
!title.trim() ||
typeof content !== 'string' ||
!content.trim() ||
userId === undefined ||
userId === null
) {
throw new Error('Title, content, and userId are required');
}

const parsedUserId = Number(userId);

if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
throw new Error('Invalid user ID');
}

const user = await userRepository.findUserById(parsedUserId);

if (!user) {
throw new Error('User not found');
}

return await postRepository.createPost({
title: title.trim(),
content: content.trim(),
userId: parsedUserId,
});
};

const deletePost = async (postId, userId) => {
const parsedPostId = Number(postId);
const parsedUserId = Number(userId);

if (!Number.isInteger(parsedPostId) || parsedPostId <= 0) {
throw new Error('Invalid post ID');
}

if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
throw new Error('Invalid user ID');
}

const post = await postRepository.findPostById(parsedPostId);

if (!post) {
throw new Error('Post not found');
}

if (post.userId !== parsedUserId) {
throw new Error('You are not the owner of this post');
}

return await postRepository.softDeletePost(parsedPostId);
};

const getPostsDetails = async () => {
return await postRepository.findAllPostsDetails();
};

const getPostsCommentCount = async () => {
const posts = await postRepository.findAllPostsWithCommentCount();

return posts.map((post) => ({
id: post.id,
title: post.title,
commentCount: post._count.comments,
}));
};

module.exports = {
createPost,
deletePost,
getPostsDetails,
getPostsCommentCount,
};