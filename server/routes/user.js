import express from 'express';
const router = express.Router();
import requireLogin from '../middleware/requireLogin.js';
import {
    getUserWithPosts,
    followUser,
    unfollowUser,
    updateProfilePic,
    getFollowers,
    getFollowing,
    updateBio,
    updateName
} from '../services/userService.js';

router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        const result = await getUserWithPosts(req.params.id);
        res.json(result);
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(422).json({ error: err.message });
    }
});

router.put('/follow', requireLogin, async (req, res) => {
    try {
        const result = await followUser(req.body.followId, req.user._id);
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const result = await unfollowUser(req.body.unfollowId, req.user._id);
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

router.put('/updatepic', requireLogin, async (req, res) => {
    try {
        const result = await updateProfilePic(req.user._id, req.body.pic);
        res.json(result);
    } catch (err) {
        console.error("Error updating pic:", err);
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/followers/:userId', requireLogin, async (req, res) => {
    try {
        const followers = await getFollowers(req.params.userId);
        res.json({ followers });
    } catch (err) {
        console.log(err);
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "An error occurred while fetching followers" });
    }
});

router.get('/following/:userId', requireLogin, async (req, res) => {
    try {
        const following = await getFollowing(req.params.userId);
        res.json({ following });
    } catch (err) {
        console.log(err);
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "An error occurred while fetching following" });
    }
});

router.put('/updatebio', requireLogin, async (req, res) => {
    try {
        const result = await updateBio(req.user._id, req.body.bio);
        res.json({ bio: result.bio });
    } catch (err) {
        console.error("Error updating bio:", err);
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/updatename', requireLogin, async (req, res) => {
    try {
        const result = await updateName(req.user._id, req.body.name, req.user.name);
        res.json({ name: result.name });
    } catch (err) {
        console.error("Error updating name:", err);
        if (err.message.includes("username is unavailable")) {
            return res.status(422).json({ error: err.message, name: req.user.name });
        }
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;

