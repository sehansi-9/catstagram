/* global cocoSsd, tf */
let cocoSsdModelPromise = null;

export const loadTensorFlow = () => {
  if (!cocoSsdModelPromise) {
    cocoSsdModelPromise = new Promise((resolve, reject) => {
      const tfScript = document.createElement('script');
      tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
      tfScript.onload = () => {
        const cocoSsdScript = document.createElement('script');
        cocoSsdScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd';
        cocoSsdScript.onload = () => {
          cocoSsd.load().then(model => {
            resolve(model);
          }).catch(reject);
        };
        document.body.appendChild(cocoSsdScript);
      };
      tfScript.onerror = reject;
      document.body.appendChild(tfScript);
    });
  }
  return cocoSsdModelPromise;
};
