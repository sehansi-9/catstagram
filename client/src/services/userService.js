import { API_URL } from '../config/api';

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": "Bearer" + localStorage.getItem("jwt")
});

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User data and posts
 */
export const getUserProfile = async (userId) => {
    const response = await fetch(`${API_URL}/user/${userId}`, {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Follow a user
 * @param {string} followId - User ID to follow
 * @returns {Promise<Object>} - Updated user data
 */
export const followUser = async (followId) => {
    const response = await fetch(`${API_URL}/follow`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ followId })
    });
    return response.json();
};

/**
 * Unfollow a user
 * @param {string} unfollowId - User ID to unfollow
 * @returns {Promise<Object>} - Updated user data
 */
export const unfollowUser = async (unfollowId) => {
    const response = await fetch(`${API_URL}/unfollow`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ unfollowId })
    });
    return response.json();
};

/**
 * Update profile picture
 * @param {string} pic - New profile picture URL
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfilePic = async (pic) => {
    const response = await fetch(`${API_URL}/updatepic`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ pic })
    });
    return response.json();
};

/**
 * Update user bio
 * @param {string} bio - New bio text
 * @returns {Promise<Object>} - Updated bio
 */
export const updateBio = async (bio) => {
    const response = await fetch(`${API_URL}/updatebio`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ bio })
    });
    return response.json();
};

/**
 * Update username
 * @param {string} name - New username
 * @returns {Promise<Object>} - Updated name or error
 */
export const updateName = async (name) => {
    const response = await fetch(`${API_URL}/updatename`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name })
    });
    return response.json();
};

/**
 * Get user's followers
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - List of followers
 */
export const getFollowers = async (userId) => {
    const response = await fetch(`${API_URL}/followers/${userId}`, {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};

/**
 * Get users that a user is following
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - List of following
 */
export const getFollowing = async (userId) => {
    const response = await fetch(`${API_URL}/following/${userId}`, {
        headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt")
        }
    });
    return response.json();
};
