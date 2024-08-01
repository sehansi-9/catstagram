const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id }).select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            Post.find({ postedby: req.params.id }).populate("postedby", "_id name")
                .then(posts => {
                    res.json({ user, posts });
                })
                .catch(err => {
                    res.status(422).json({ error: err.message });
                });
        })
        .catch(err => {
            res.status(422).json({ error: err.message });
        });
});

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, { new: true })
    .then(result => {
        return User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select("-password"); 
    })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err.message });
    });
});


router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, { new: true })
    .then(result => {
        return User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }).select("-password");
    })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err.message });
    });
});


router.put('/updatepic', requireLogin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { pic: req.body.pic } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating pic:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/followers/:userId', requireLogin, (req, res) => {
    User.findById(req.params.userId)
        .populate('followers', '_id name pic')
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ followers: user.followers });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while fetching followers" });
        });
});


router.get('/following/:userId', requireLogin, (req, res) => {
    User.findById(req.params.userId)
        .populate('following', '_id name pic')
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ following: user.following });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while fetching followers" });
        });
});

router.put('/updatebio', requireLogin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { bio: req.body.bio } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ bio: updatedUser.bio });
    } catch (err) {
        console.error("Error updating bio:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;