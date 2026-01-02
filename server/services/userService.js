import mongoose from 'mongoose';
const User = mongoose.model("User");
const Post = mongoose.model("Post");

export const getUserWithPosts = async (userId) => {
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    const posts = await Post.find({ postedby: userId }).populate("postedby", "_id name");
    return { user, posts };
};

export const followUser = async (followId, currentUserId) => {
    await User.findByIdAndUpdate(followId, {
        $push: { followers: currentUserId }
    }, { new: true });

    return await User.findByIdAndUpdate(currentUserId, {
        $push: { following: followId }
    }, { new: true }).select("-password");
};

export const unfollowUser = async (unfollowId, currentUserId) => {
    await User.findByIdAndUpdate(unfollowId, {
        $pull: { followers: currentUserId }
    }, { new: true });

    return await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: unfollowId }
    }, { new: true }).select("-password");
};

export const updateProfilePic = async (userId, pic) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { pic: pic } },
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
};

export const getFollowers = async (userId) => {
    const user = await User.findById(userId).populate('followers', '_id name pic');
    if (!user) {
        throw new Error("User not found");
    }
    return user.followers;
};

export const getFollowing = async (userId) => {
    const user = await User.findById(userId).populate('following', '_id name pic');
    if (!user) {
        throw new Error("User not found");
    }
    return user.following;
};

export const updateBio = async (userId, bio) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { bio: bio } },
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
};

export const updateName = async (userId, name, currentName) => {
    const existingUser = await User.findOne({ name: name });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new Error(`"${name}" username is unavailable`);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { name: name } },
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
};
