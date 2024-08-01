import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setShowFollow] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setProfile(result);
            if (state && state.following) {
                setShowFollow(!state.following.includes(userid));
            } else {
                setShowFollow(true);
            }
            setIsLoading(false);
        });
    }, [userid, state]);

    const followUser = () => {
        setIsProcessing(true);
        fetch('/follow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
            localStorage.setItem("user", JSON.stringify(data));
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                };
            });
            setShowFollow(false);
            setIsProcessing(false);
        }).catch(() => {
            setIsProcessing(false);
        });
    };

    const unfollowUser = () => {
        setIsProcessing(true);
        fetch('/unfollow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
            localStorage.setItem("user", JSON.stringify(data));
            setProfile((prevState) => {
                const newFollowers = prevState.user.followers.filter(item => item !== data._id);
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollowers
                    }
                };
            });
            setShowFollow(true);
            setIsProcessing(false);
        }).catch(() => {
            setIsProcessing(false);
        });
    };

    const fetchFollowers = () => {
        fetch(`/followers/${userid}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setFollowers(result.followers);
            setShowFollowersModal(true);
        })
        .catch(err => console.log(err));
    };   

    const fetchFollowing = () => {
        fetch(`/following/${userid}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setFollowing(result.following);
            setShowFollowingModal(true);
        })
        .catch(err => console.log(err));
    }; 

    if (isLoading) {
        return <h6>Loading...</h6>;
    }

    return (
        <>
            {userProfile ? 
            <div style={{ maxWidth: "600px", margin: "100px auto" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "18px 0px",
                    borderBottom: "1px solid gray"
                }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={userProfile.user.pic}
                            alt="Profile" />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{userProfile.posts.length} post{userProfile.posts.length !== 1 ? 's' : ''}</h6>
                            <h6 className="pointer" onClick={fetchFollowers}>{userProfile.user.followers.length} followers </h6>
                            <h6 className="pointer" onClick={fetchFollowing}>{userProfile.user.following.length} following</h6>
                        </div>
                        <h6>{userProfile.user.bio}</h6>
                        {showFollow !== null && (
                            showFollow ? 
                            <button 
                                style={{ margin: "10px" }} 
                                className="btn waves-effect waves-light deep-purple accent-4" 
                                onClick={followUser} 
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Following...' : 'Follow'}
                            </button>
                        : 
                            <button 
                                style={{ margin: "10px" }} 
                                className="btn waves-effect waves-light deep-purple accent-4" 
                                onClick={unfollowUser} 
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Unfollowing...' : 'Unfollow'}
                            </button>
                        )}
                       
                    </div>
                    
                </div>
                <div className="gallery">
                    {userProfile.posts.map(item => (
                        <Link key={item._id} to={`/post/${item._id}`}>
                        <img className="item" key={item._id} src={item.photo} alt={item.title} />
                        </Link>
                    ))}
                </div>
            </div>
            : <h2>Loading...</h2>}

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
        </>
    );
};

export default Profile;
