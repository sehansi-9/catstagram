/* global tf */
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { loadTensorFlow } from './loadTensorflow';
import { uploadImage } from '../../services/uploadService';
import { createPost } from '../../services/postService';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("CHOOSE PIC");
  const [predictions, setPredictions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      const submitPost = async () => {
        try {
          const data = await createPost({ title, body, pic: url });

          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-2" });
          } else {
            M.toast({ html: "Posted!", classes: "green darken-2" });
            navigate('/');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      submitPost();
    }
  }, [url, navigate, title, body]);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setImage(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const postDetails = () => {
    if (!title || !body || !image) {
      M.toast({ html: "Please fill in all fields", classes: "red darken-2" });
      return;
    }

    detectObjects().then(hasCat => {
      if (hasCat) {
        uploadImage(image)
          .then(imageUrl => {
            setUrl(imageUrl);
          })
          .catch(err => {
            console.log(err);
            M.toast({ html: "Error uploading image", classes: "red darken-2" });
          });
      } else {
        M.toast({ html: "No cat detected in the image", classes: "red darken-2" });
      }
    }).catch(err => {
      console.error('Error detecting objects:', err);
    });
  };

  const detectObjects = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.crossOrigin = "anonymous"; // Ensure CORS settings allow reading the image
      img.onload = () => {
        console.log("Image loaded successfully");
        loadTensorFlow()
          .then((model) => {
            model
              .detect(img)
              .then((predictions) => {
                console.log("Predictions: ", predictions);
                setPredictions(predictions);
                // Check if any prediction is a 'cat'
                const hasCat = predictions.some(
                  (prediction) => prediction.class === "cat"
                );
                resolve(hasCat);
              })
              .catch((err) => {
                console.error("Error during model detection:", err);
                reject(err);
              });
          })
          .catch((error) => {
            console.error("Error loading TensorFlow or COCO-SSD model:", error);
            reject(error);
          });
      };
      img.onerror = (err) => {
        console.error("Error loading image:", err);
        reject(err);
      };
    });
  };

  return (
    <div className="card input-field" style={{ margin: "150px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "15px" }}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ marginBottom: "15px" }}
      />

      <div className="parallel">
        <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: "none" }} />
        <label htmlFor="fileInput" id="create-input" className="file-path-wrapper custom-file-button">{fileName}</label>
      </div>

      <div className="parallel">
        <button className="btn waves-effect waves-light deep-purple accent-4" onClick={postDetails}>Post</button>
        <h6>Please ensure you uplaod clear pictures with visible purr friends... Don't forget that AI can make mistakes too :P</h6>
      </div>

      {predictions.length > 0 && (
        <div className="predictions">
          <h4>Predictions:</h4>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                <strong>{prediction.class}</strong> - {Math.round(prediction.score * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
