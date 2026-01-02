import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import M from 'materialize-css';
import { uploadImage } from '../../services/uploadService';
import { getMyPosts } from '../../services/postService';
import {
  updateProfilePic as updateProfilePicService,
  updateBio as updateBioService,
  updateName as updateNameService
} from '../../services/userService';
import ProfileHeader from '../ProfileHeader';
import { useSelector, useDispatch } from 'react-redux';
import { updatePic, updateBio, updateName } from '../../redux/userSlice';

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [showUpdateTab, setShowUpdateTab] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getMyPosts();
        setPics(result.mypost);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (image) {
      const updatePicAction = async () => {
        try {
          const url = await uploadImage(image);
          const result = await updateProfilePicService(url);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, pic: result.pic })
          );
          dispatch(updatePic(result.pic));
        } catch (err) {
          console.log(err);
        }
      };
      updatePicAction();
    }
  }, [image, dispatch, user]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  const handleUpdateBio = async () => {
    try {
      const result = await updateBioService(bio);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, bio: result.bio })
      );
      dispatch(updateBio(result.bio));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateName = async () => {
    try {
      const result = await updateNameService(name);
      if (result.error) {
        M.toast({ html: result.error, classes: "red darken-2" });
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, name: result.name })
        );
        dispatch(updateName(result.name));
      }
    } catch (err) {
      M.toast({ html: err, classes: "red darken-2" });
    }
  };

  const handleUpdate = () => {
    if (name === "") {
      M.toast({ html: "Name cannot be blank", classes: "red darken-2" });
      return;
    }
    else {
      handleUpdateName();
      handleUpdateBio();
      setShowUpdateTab(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto" }}>
      {user && (
        <ProfileHeader user={user} postsCount={mypics.length}>
          {!showUpdateTab && (
            <i
              className="material-icons"
              style={{ color: "#5D21D1 ", cursor: "pointer", marginLeft: "10px" }}
              onClick={() => {
                setBio(user.bio);
                setName(user.name)
                setShowUpdateTab(true)
              }}
            >
              create
            </i>
          )}
        </ProfileHeader>
      )}

      {/* Update Tab - kept here as specific to own profile */}
      {showUpdateTab && (
        <div className="update-tab " style={{ margin: "20px" }}>
          <div>
            <h6>Update User Name:</h6>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="name cannot be blank"
            ></input>
          </div>

          <div>
            <h6>Update Profile Picture:</h6>
            <input
              type="file"
              id="fileInput"
              onChange={(e) => updatePhoto(e.target.files[0])}
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput" className="custom-file-button">
              CHOOSE PIC
            </label>
          </div>

          <div>
            <h6>Update Bio:</h6>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
            ></textarea>
          </div>

          <button
            className="btn waves-effect waves-light deep-purple accent-4"
            onClick={handleUpdate}
            style={{ marginTop: "10px" }}
          >
            Done
          </button>
          <button
            className="btn waves-effect waves-light red lighten-2"
            onClick={() => setShowUpdateTab(false)}
            style={{ marginTop: "10px", marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="gallery">
        {mypics.map((item) => (
          <Link key={item._id} to={`/post/${item._id}`}>
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profile;
