// API Configuration
const getRuntimeConfig = (key, fallback) => {
    if (window.configs && window.configs[key]) {
        return window.configs[key];
    }
    return process.env[key] || fallback;
};

export const API_URL = getRuntimeConfig('REACT_APP_API_URL', 'http://localhost:5000');
export const CLOUDINARY_URL = getRuntimeConfig('REACT_APP_CLOUDINARY_URL', '');

console.log("Current API URL:", API_URL);
