const prisma = require('../../config/db');

const createManyComments = async (comments) => {
return await prisma.comment.createMany({
data: comments,
});
};

const findCommentById = async (id) => {
return await prisma.comment.findUnique({
where: { id },
});
};

const updateCommentContent = async (id, content) => {
return await prisma.comment.update({
where: { id },
data: { content },
});
};

const findCommentByPostUserContent = async (postId, userId, content) => {
return await prisma.comment.findFirst({
where: { postId, userId, content },
});
};

const createComment = async (commentData) => {
return await prisma.comment.create({
data: commentData,
});
};

const searchComments = async (word) => {
return await prisma.comment.findMany({
where: {
content: {
contains: word,
mode: 'insensitive',
},
},
orderBy: { createdAt: 'desc' },
});
};

const countMatchingComments = async (word) => {
return await prisma.comment.count({
where: {
content: {
contains: word,
mode: 'insensitive',
},
},
});
};

const findNewestComments = async (postId) => {
return await prisma.comment.findMany({
where: { postId },
orderBy: { createdAt: 'desc' },
take: 3,
});
};

const findCommentDetails = async (id) => {
return await prisma.comment.findUnique({
where: { id },
include: {
user: {
select: {
id: true,
name: true,
email: true,
},
},
post: {
select: {
id: true,
title: true,
content: true,
},
},
},
});
};

module.exports = {
createManyComments,
findCommentById,
updateCommentContent,
findCommentByPostUserContent,
createComment,
searchComments,
countMatchingComments,
findNewestComments,
findCommentDetails,
};