const prisma = require('../../config/db');

const createPost = async (postData) => {
return await prisma.post.create({
data: postData,
});
};

const findPostById = async (postId) => {
return await prisma.post.findFirst({
where: {
id: postId,
deletedAt: null,
},
});
};

const softDeletePost = async (postId) => {
return await prisma.post.update({
where: {
id: postId,
},
data: {
deletedAt: new Date(),
},
});
};

const findAllPostsDetails = async () => {
return await prisma.post.findMany({
where: {
deletedAt: null,
},
select: {
id: true,
title: true,
user: {
select: {
id: true,
name: true,
},
},
comments: {
select: {
id: true,
content: true,
},
},
},
});
};

const findAllPostsWithCommentCount = async () => {
return await prisma.post.findMany({
where: {
deletedAt: null,
},
select: {
id: true,
title: true,
_count: {
select: {
comments: true,
},
},
},
});
};

module.exports = {
createPost,
findPostById,
softDeletePost,
findAllPostsDetails,
findAllPostsWithCommentCount,
};