import {
    likePost,
    unlikePost,
    addComment,
    deletePost,
    deleteComment
} from '../services/postService';

const usePostInteractions = (onPostUpdated, onPostDeleted) => {

    const handleLike = async (id) => {
        try {
            const result = await likePost(id);
            if (onPostUpdated) onPostUpdated(result);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async (id) => {
        try {
            const result = await unlikePost(id);
            if (onPostUpdated) onPostUpdated(result);
        } catch (err) {
            console.log(err);
        }
    };

    const handleComment = async (text, postId) => {
        try {
            const result = await addComment(postId, text);
            if (onPostUpdated) onPostUpdated(result);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const result = await deletePost(postId);
            if (onPostDeleted) onPostDeleted(result);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const result = await deleteComment(postId, commentId);
            if (onPostUpdated) onPostUpdated(result);
        } catch (err) {
            console.log(err);
        }
    };

    return {
        handleLike,
        handleUnlike,
        handleComment,
        handleDeletePost,
        handleDeleteComment
    };
};

export default usePostInteractions;
