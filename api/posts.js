const postsRouter = require('express').Router();
const { getPosts, updatePost, deletePost, getTagById, getPostsByTagName } = require('../db');
postsRouter.use((req, res, next) => {
    console.log('a request is being made to /posts');
    next();
});
postsRouter.get('/', async (res, next) => {
   try {
       const posts = await getPosts();
       res.send(posts);
   } catch (error) {
       next(error);
   }
});

postsRouter.get('/:tagId', async (req, res, next)=>{
    try {
        const tagId = req.params.tagId;
        const tag = await getTagById(tagId);
        const posts = await getPostsByTagName(tag.name);
        res.send(posts);
    } catch (error) {
        next(error);
    }
});

postsRouter.post('/:postId', async (req, res, next) =>{
    try {
        const { title, content } = req.body;
        const postId = req.params.postId;
        const updatedPost = await updatePost({title, content, postId});
        res.send(updatedPost);
    } catch (error) {
        next(error);
    }
});
postsRouter.delete('/:postId', async (req, res, next) =>{
    try {
        const postId = req.params.postId;
        await deletePost(postId);
        res.send("Successful Delete");
    } catch (error) {
        next(error);
    }
});
module.exports = postsRouter