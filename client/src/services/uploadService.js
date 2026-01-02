import { CLOUDINARY_URL } from '../config/api';

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "sehansi");

    const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: data
    });

    const result = await response.json();
    return result.url;
};
