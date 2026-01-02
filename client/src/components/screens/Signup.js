import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { uploadImage } from '../../services/uploadService';
import { signup } from '../../services/authService';

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)
  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])
  const navigate = useNavigate();


  const uploadPic = async () => {
    try {
      const imageUrl = await uploadImage(image);
      setUrl(imageUrl);
    } catch (err) {
      console.log(err);
      M.toast({ html: 'Error uploading image', classes: "red darken-2" });
    }
  }

  const uploadFields = async () => {
    try {
      const data = await signup({
        name,
        password,
        email,
        pic: url
      });

      if (data.error) {
        M.toast({ html: data.error, classes: "red darken-2" });
      } else {
        M.toast({ html: data.message, classes: "green darken-2" });
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      M.toast({ html: 'An error occurred', classes: "red darken-2" });
    }
  }

  const PostData = () => {
    if (image) {
      uploadPic()
    }
    else {
      uploadFields()
    }

  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Catstagram</h2>
        <input
          type="text"
          placeholder="user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn deep-purple accent-4" id="select-pfp">
            <span>Profile Picture</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button className="btn waves-effect waves-light deep-purple accent-4"
          onClick={PostData}>
          SignUp
        </button>
        <h6>
          <Link to="/login">Already have an account?</Link>
        </h6>
      </div>
    </div>
  );
}

export default Signup;