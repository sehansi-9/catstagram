/**
 * Post Service - Handles post-related API calls
 */

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": "Bearer" + localStorage.getItem("jwt")
});

/**
 * Get all posts
 * @returns {Promise<Object>} - All posts
 */
export const getAllPosts = async () => {
    const response = await fetch('/allposts', {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Get posts from followed users
 * @returns {Promise<Object>} - Posts from followed users
 */
export const getHomePosts = async () => {
    const response = await fetch('/myhome', {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Get user's own posts
 * @returns {Promise<Object>} - User's posts
 */
export const getMyPosts = async () => {
    const response = await fetch("/myposts", {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Get a single post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} - Post data
 */
export const getPostById = async (postId) => {
    const response = await fetch(`/post/${postId}`, {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @param {string} postData.title - Post title
 * @param {string} postData.body - Post body
 * @param {string} postData.pic - Post image URL
 * @returns {Promise<Object>} - Created post
 */
export const createPost = async (postData) => {
    const response = await fetch("/createpost", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
    });
    return response.json();
};

/**
 * Like a post
 * @param {string} postId - Post ID to like
 * @returns {Promise<Object>} - Updated post
 */
export const likePost = async (postId) => {
    const response = await fetch('/like', {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ postId })
    });
    return response.json();
};

/**
 * Unlike a post
 * @param {string} postId - Post ID to unlike
 * @returns {Promise<Object>} - Updated post
 */
export const unlikePost = async (postId) => {
    const response = await fetch('/unlike', {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ postId })
    });
    return response.json();
};

/**
 * Add a comment to a post
 * @param {string} postId - Post ID
 * @param {string} text - Comment text
 * @returns {Promise<Object>} - Updated post with comment
 */
export const addComment = async (postId, text) => {
    const response = await fetch('/comment', {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ postId, text })
    });
    return response.json();
};

/**
 * Delete a post
 * @param {string} postId - Post ID to delete
 * @returns {Promise<Object>} - Deleted post ID
 */
export const deletePost = async (postId) => {
    const response = await fetch(`/deletepost/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Delete a comment
 * @param {string} postId - Post ID
 * @param {string} commentId - Comment ID to delete
 * @returns {Promise<Object>} - Updated post
 */
export const deleteComment = async (postId, commentId) => {
    const response = await fetch(`/deletecomment/${postId}/${commentId}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Get users who liked a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} - List of users who liked the post
 */
export const getLikedUsers = async (postId) => {
    const response = await fetch(`/likedusers/${postId}`, {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};
