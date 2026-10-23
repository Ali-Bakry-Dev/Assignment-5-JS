const express = require('express');

const app = express();

const userRoutes = require('./src/modules/users/user.routes');
const postRoutes = require('./src/modules/posts/post.routes');
const commentRoutes = require('./src/modules/comments/comment.routes');
app.use(express.json());


app.use('/comments', commentRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
module.exports = app;