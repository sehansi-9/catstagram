import { useState } from 'react';
import { aiService } from '../services/aiService';

/**
 * Custom hook for content moderation using AI
 * @returns {Object} { detectObjects, predictions, isLoading, error }
 */
const useContentModeration = () => {
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Detects objects in the provided File object
     * @param {File} imageFile - The file to analyze
     * @returns {Promise<boolean>} True if cats are detected, false otherwise
     */
    const detectObjects = (imageFile) => {
        setIsLoading(true);
        setError(null);
        setPredictions([]);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);
            img.crossOrigin = "anonymous";

            img.onload = () => {
                aiService.detectObjects(img)
                    .then((results) => {
                        setPredictions(results);
                        const hasCat = results.some(p => p.class === 'cat');
                        setIsLoading(false);
                        resolve(hasCat);
                    })
                    .catch((err) => {
                        setError(err);
                        setIsLoading(false);
                        reject(err);
                    });
            };

            img.onerror = (err) => {
                const errorMsg = new Error("Failed to load image for detection");
                setError(errorMsg);
                setIsLoading(false);
                reject(errorMsg);
            };
        });
    };

    return { detectObjects, predictions, isLoading, error };
};

export default useContentModeration;
