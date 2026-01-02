/**
 * AI Service - Handles TensorFlow model loading and execution
 */

/* global cocoSsd */

class AIService {
    constructor() {
        this.modelPromise = null;
    }

    /**
     * Loads the TensorFlow.js and COCO-SSD scripts dynamically.
     * Uses a singleton pattern to prevent reloading.
     * @returns {Promise<Object>} The loaded COCO-SSD model.
     */
    loadModel() {
        if (!this.modelPromise) {
            this.modelPromise = new Promise((resolve, reject) => {
                // Check if already loaded globally
                if (window.cocoSsd && window.tf) {
                    window.cocoSsd.load().then(resolve).catch(reject);
                    return;
                }

                const tfScript = document.createElement('script');
                tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
                tfScript.onload = () => {
                    const cocoSsdScript = document.createElement('script');
                    cocoSsdScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd';
                    cocoSsdScript.onload = () => {
                        window.cocoSsd.load().then(resolve).catch(reject);
                    };
                    cocoSsdScript.onerror = () => reject(new Error("Failed to load COCO-SSD model script"));
                    document.body.appendChild(cocoSsdScript);
                };
                tfScript.onerror = () => reject(new Error("Failed to load TensorFlow script"));
                document.body.appendChild(tfScript);
            });
        }
        return this.modelPromise;
    }

    /**
     * Detects objects in an image element.
     * @param {HTMLImageElement} imageElement - The image to analyze.
     * @returns {Promise<Array>} Array of predictions.
     */
    async detectObjects(imageElement) {
        try {
            const model = await this.loadModel();
            return await model.detect(imageElement);
        } catch (error) {
            console.error("AI Service Error:", error);
            throw error;
        }
    }
}

export const aiService = new AIService();
