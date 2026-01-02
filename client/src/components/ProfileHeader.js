import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFollowers, getFollowing } from '../services/userService';
import { useSelector } from 'react-redux';

const ProfileHeader = ({ user, postsCount, children }) => {
    const currentUser = useSelector((state) => state.user);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const handleFetchFollowers = async () => {
        try {
            const result = await getFollowers(user._id);
            setFollowers(result.followers || []);
            setShowFollowersModal(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleFetchFollowing = async () => {
        try {
            const result = await getFollowing(user._id);
            setFollowing(result.following || []);
            setShowFollowingModal(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid gray",
            }}>
                <div>
                    <img
                        style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src={user.pic ? user.pic : "loading"}
                        alt="profile-pic"
                    />
                </div>

                <div>
                    <h4>
                        {user.name ? user.name : "loading"}
                        {children}
                    </h4>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "108%",
                    }}>
                        <h6>{postsCount} post{postsCount !== 1 && "s"}</h6>
                        <h6
                            className="pointer"
                            style={{ cursor: user.followers && user.followers.length > 0 ? "pointer" : "default" }}
                            onClick={() => {
                                if (user.followers && user.followers.length > 0) {
                                    handleFetchFollowers();
                                }
                            }}
                        >
                            {user.followers ? user.followers.length : "0"} followers
                        </h6>
                        <h6
                            className="pointer"
                            style={{ cursor: user.following && user.following.length > 0 ? "pointer" : "default" }}
                            onClick={() => {
                                if (user.following && user.following.length > 0) {
                                    handleFetchFollowing();
                                }
                            }}
                        >
                            {user.following ? user.following.length : "0"} following
                        </h6>
                    </div>

                    <h6 className="current-bio">{user.bio ? user.bio : "loading"}</h6>
                </div>
            </div>

            {showFollowersModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowFollowersModal(false)}>&times;</span>
                        <h4>Followers:</h4>
                        <ul>
                            {followers.map((u) => (
                                <li key={u._id} className="user-list-item">
                                    <img className="user-pic" src={u.pic} alt="User" />
                                    <Link
                                        className="user-link"
                                        to={u._id !== currentUser?._id ? "/profile/" + u._id : "/profile"}
                                        onClick={() => setShowFollowersModal(false)}
                                    >
                                        {u.name}
                                    </Link>
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
                            {following.map((u) => (
                                <li key={u._id} className="user-list-item">
                                    <img className="user-pic" src={u.pic} alt="User" />
                                    <Link
                                        className="user-link"
                                        to={u._id !== currentUser?._id ? "/profile/" + u._id : "/profile"}
                                        onClick={() => setShowFollowingModal(false)}
                                    >
                                        {u.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileHeader;
