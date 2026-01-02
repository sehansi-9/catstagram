/**
 * Auth Service - Handles authentication API calls
 */

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @param {string} userData.pic - Profile picture URL
 * @returns {Promise<Object>} - Response data
 */
export const signup = async (userData) => {
    const response = await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
    return response.json();
};

/**
 * Sign in a user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.name - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} - Response with token and user data
 */
export const signin = async (credentials) => {
    const response = await fetch("/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    return response.json();
};
