import mongoose from 'mongoose';
const Post = mongoose.model("Post");

export const getAllPosts = async () => {
    return await Post.find()
        .populate("postedby", "_id name pic")
        .populate("comments.postedby", "_id name");
};

export const getPostById = async (id) => {
    const post = await Post.findOne({ _id: id })
        .populate("postedby", "_id name pic")
        .populate("comments.postedby", "_id name");
    if (!post) {
        throw new Error("Post not found");
    }
    return post;
};

export const getSubscribedPosts = async (user) => {
    return await Post.find({ postedby: { $in: user.following } })
        .populate("postedby", "_id name pic")
        .populate("comments.postedby", "_id name");
};

export const createNewPost = async (title, body, pic, user) => {
    if (!title || !body || !pic) {
        throw new Error("Please add all the fields");
    }
    user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        postedby: user,
    });
    return await post.save();
};

export const getMyPosts = async (userId) => {
    return await Post.find({ postedby: userId })
        .populate("postedby", "_id name");
};

export const likePost = async (postId, userId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
    );
};

export const unlikePost = async (postId, userId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
    );
};

export const addComment = async (text, postId, userId) => {
    const comment = {
        text: text,
        postedby: userId
    };
    return await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true }
    )
        .populate("comments.postedby", "_id name")
        .populate("postedby", "_id name");
};

export const deletePost = async (postId, userId) => {
    const post = await Post.findOne({ _id: postId }).populate("postedby", "_id");
    if (!post) {
        throw new Error("Post not found");
    }
    if (post.postedby._id.toString() === userId.toString()) {
        await post.deleteOne();
        return post;
    } else {
        throw new Error("Unauthorized to delete this post");
    }
};

export const deleteComment = async (postId, commentId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
    )
        .populate("comments.postedby", "_id name")
        .populate("postedby", "_id name");
};

export const getLikedUsers = async (postId) => {
    const post = await Post.findById(postId).populate('likes', '_id name pic');
    if (!post) {
        throw new Error("Post not found");
    }
    return post.likes;
};
