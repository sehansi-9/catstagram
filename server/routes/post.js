import express from 'express';
const router = express.Router();
import requireLogin from '../middleware/requireLogin.js';
import {
    getAllPosts,
    getPostById,
    getSubscribedPosts,
    createNewPost,
    getMyPosts,
    likePost,
    unlikePost,
    addComment,
    deletePost,
    deleteComment,
    getLikedUsers
} from '../services/postService.js';

router.get('/allposts', requireLogin, async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json({ posts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/post/:id', requireLogin, async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        res.json({ post });
    } catch (err) {
        if (err.message === "Post not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(422).json({ error: err.message });
    }
});

router.get('/myhome', requireLogin, async (req, res) => {
    try {
        const posts = await getSubscribedPosts(req.user);
        res.json({ posts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/createpost', requireLogin, async (req, res) => {
    try {
        const { title, body, pic } = req.body;
        const result = await createNewPost(title, body, pic, req.user);
        res.json({ post: result });
    } catch (err) {
        if (err.message === "Please add all the fields") {
            return res.status(422).json({ error: err.message });
        }
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/myposts', requireLogin, async (req, res) => {
    try {
        const mypost = await getMyPosts(req.user._id);
        res.json({ mypost });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/like', requireLogin, async (req, res) => {
    try {
        const result = await likePost(req.body.postId, req.user._id);
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

router.put('/unlike', requireLogin, async (req, res) => {
    try {
        const result = await unlikePost(req.body.postId, req.user._id);
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

router.put('/comment', requireLogin, async (req, res) => {
    try {
        const result = await addComment(req.body.text, req.body.postId, req.user._id);
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    try {
        const post = await deletePost(req.params.postId, req.user._id);
        res.json({ _id: post._id });
    } catch (err) {
        console.log(err);
        if (err.message === "Unauthorized to delete this post") {
            return res.status(401).json({ error: err.message });
        }
        res.status(500).json({ error: "Failed to delete the post" });
    }
});

router.delete('/deletecomment/:postId/:commentId', requireLogin, async (req, res) => {
    try {
        const result = await deleteComment(req.params.postId, req.params.commentId);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(422).json({ error: err.message });
    }
});

router.get('/likedusers/:postId', requireLogin, async (req, res) => {
    try {
        const likedUsers = await getLikedUsers(req.params.postId);
        res.json({ likedUsers });
    } catch (err) {
        console.log(err);
        if (err.message === "Post not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "An error occurred while fetching liked users" });
    }
});

export default router;

