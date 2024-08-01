const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/allposts', requireLogin, (req, res) => {
    Post.find()
        .populate("postedby", "_id name pic")
        .populate("comments.postedby","_id name")
        .then(posts => {
            res.json({ posts: posts });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/post/:id', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .populate("postedby", "_id name pic")
        .populate("comments.postedby", "_id name")
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json({ post });
        })
        .catch(err => {
            res.status(422).json({ error: err.message });
        });
});

router.get('/myhome', requireLogin, (req, res) => {
    Post.find({postedby:{$in:req.user.following}})
        .populate("postedby", "_id name pic")
        .populate("comments.postedby","_id name")
        .then(posts => {
            res.json({ posts: posts });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        res.status(422).json({ error: "Please add all the fields" });
        return;
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        postedby: req.user,
    });
    post.save()
        .then(result => {
            res.json({ post: result });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/myposts', requireLogin, (req, res) => {
    Post.find({ postedby: req.user._id })
        .populate("postedby", "_id name")
        .then(mypost => {
            res.json({ mypost: mypost });
        })
        .catch(err => {
            console.log(err);
        });
});

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.user._id } },
        { new: true }
    )
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
});


router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
});

router.put('/comment', requireLogin, (req, res) => {
    const comment={
        text:req.body.text,
        postedby:req.user._id
    }
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: comment} },
        { new: true }
    )
    .populate("comments.postedby","_id name")
    .populate("postedby", "_id name")
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
});

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedby", "_id")
        .then(post => {
            if (post.postedby._id.toString() === req.user._id.toString()) {
                post.deleteOne()
                    .then(() => {
                        res.json({ _id: post._id }); // Explicitly send the post ID to the client
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "Failed to delete the post" });
                    });
            } 
        })
});

router.delete('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
        req.params.postId,
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true }
    )
        .populate("comments.postedby", "_id name")
        .populate("postedby", "_id name")
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/likedusers/:postId', requireLogin, (req, res) => {
    Post.findById(req.params.postId)
        .populate('likes', '_id name pic')
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json({ likedUsers: post.likes });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while fetching liked users" });
        });
});



module.exports = router;
