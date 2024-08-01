import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [bio, setBio] = useState("");
    const [showUpdateTab, setShowUpdateTab] = useState(false);

    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setPics(result.mypost);
        });
    }, []);

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "sehansi");

            fetch("https://api.cloudinary.com/v1_1/sehansi/image/upload", {
                method: "POST",
                body: data
            })
            .then(res => res.json())
            .then(data => {
                fetch('/updatepic', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer" + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                })
                .then(res => res.json())
                .then(result => {
                    localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                });
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [image]);

    const updatePhoto = async (file) => {
        setImage(file);
    };

    const updateBio = () => {
        fetch('/updatebio', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                bio: bio // Send the bio data to the backend
            })
        })
        .then(res => res.json())
        .then(result => {
            // Update the bio in local storage and context
            localStorage.setItem("user", JSON.stringify({ ...state, bio: result.bio }));
            dispatch({ type: "UPDATEBIO", payload: result.bio });
        })
        .catch(err => console.log(err));
    };

    const handleUpdate = () => {
        updatePhoto(image); // Call the updatePhoto function to update the profile picture
        updateBio(); // Call the updateBio function to update the bio
        setShowUpdateTab(false); // Close the update tab after updating
    };

    const fetchFollowers = (userId) => {
        fetch(`/followers/${userId}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setFollowers(result.followers || []); // Ensure followers is an array
            setShowFollowersModal(true);
        })
        .catch(err => console.log(err));
    };   
        
    const fetchFollowing = (userId) => {
        fetch(`/following/${userId}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setFollowing(result.following || []); // Ensure following is an array
            setShowFollowingModal(true);
        })
        .catch(err => console.log(err));
    }; 

    return (
        <div style={{ maxWidth: "600px", margin: "100px auto" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid gray"
            }}>
                <div>
                    <img 
                        style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src={state ? state.pic : "loading"} 
                        alt="profile-pic"
                    />
                </div>

                <div>
                    <h4>{state ? state.name : "loading"} {!showUpdateTab && (
                
                <i className="material-icons" style={{ color: "#5D21D1 " }} onClick={() => setShowUpdateTab(true)}>create</i>
            )}</h4>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6>{mypics.length} post{mypics.length !== 1 && "s"}</h6>
                        <h6 className="pointer" onClick={() => fetchFollowers(state?._id)}>{state?.followers?.length || "0"} followers</h6>
                        <h6 className="pointer" onClick={() => fetchFollowing(state?._id)}>{state?.following?.length || "0"} following</h6>
                        
                    </div>

                   
                    <h6 className="current-bio">{state ? state.bio : "loading"}</h6>

                    {/* Update Tab */}
            {showUpdateTab && (
                <div className="update-tab ">
                    
                    {/* Update Profile Picture */}
                    <div>
    <h6>Update Profile Picture:</h6>
    <input type="file" id="fileInput" onChange={(e) => updatePhoto(e.target.files[0])}  style={{ display: "none" }} />
    <label for="fileInput" class="custom-file-button">CHOOSE PIC</label>
</div>

                    {/* Update Bio */}
                    <div>
                        <h6>Update Bio:</h6>
                        <textarea
                            rows="3"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write something about yourself..."
                        ></textarea>
                    </div>

                    {/* Update Button */}
                    <button className="btn waves-effect waves-light deep-purple accent-4" onClick={handleUpdate}>Update</button>
                </div>
            )}

           
            
                </div>

                
            </div>

            
            <div className="gallery">
                {mypics.map(item => (
                    <Link key={item._id} to={`/post/${item._id}`}>
                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                    </Link>
                ))}
            </div>

            {showFollowersModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowFollowersModal(false)}>&times;</span>
                        <h4>Followers:</h4>
                        <ul>
                            {followers.map(user => (
                                <li key={user._id} className="user-list-item">
                                    <img className="user-pic" src={user.pic} alt="User" />
                                    <Link className="user-link" to={user._id !== state._id ? "/profile/" + user._id : "/profile"}>{user.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {showFollowingModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowFollowingModal(false)}>&times;</span>
                        <h4>Following:</h4>
                        <ul>
                            {following.map(user => (
                                <li key={user._id} className="user-list-item">
                                    <img className="user-pic" src={user.pic} alt="User" />
                                    <Link className="user-link" to={user._id !== state._id ? "/profile/" + user._id : "/profile"}>{user.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
