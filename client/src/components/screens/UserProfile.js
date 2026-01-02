import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateFollowing } from '../../redux/userSlice';
import { useParams, Link } from "react-router-dom";
import CatSVG from '../../cat-in-mailbox.svg';
import {
    getUserProfile,
    followUser,
    unfollowUser
} from '../../services/userService';
import ProfileHeader from '../ProfileHeader';

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null);
    const state = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { userid } = useParams();
    const [showFollow, setShowFollow] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const result = await getUserProfile(userid);
                setProfile(result);
                if (state && state.following) {
                    setShowFollow(!state.following.includes(userid));
                } else {
                    setShowFollow(true);
                }
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserProfile();
    }, [userid, state]);

    const handleFollowUser = async () => {
        setIsProcessing(true);
        try {
            const data = await followUser(userid);
            dispatch(updateFollowing({ following: data.following, followers: data.followers }));
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
        } catch (err) {
            setIsProcessing(false);
        }
    };

    const handleUnfollowUser = async () => {
        setIsProcessing(true);
        try {
            const data = await unfollowUser(userid);
            dispatch(updateFollowing({ following: data.following, followers: data.followers }));
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
        } catch (err) {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <h6>Loading...</h6>;
    }

    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "600px", margin: "100px auto" }}>
                    <ProfileHeader user={userProfile.user} postsCount={userProfile.posts.length}>
                        {showFollow !== null && (
                            showFollow ?
                                <button
                                    style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light deep-purple accent-4"
                                    onClick={handleFollowUser}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Following...' : 'Follow'}
                                </button>
                                :
                                <button
                                    style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light deep-purple accent-4"
                                    onClick={handleUnfollowUser}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Unfollowing...' : 'Unfollow'}
                                </button>
                        )}
                    </ProfileHeader>
                    <div className="gallery">
                        {userProfile.posts.length === 0 ? (
                            <div style={{ textAlign: "center", width: "100%" }}>
                                <h5 style={{ marginTop: "10px", fontFamily: "Grand Hotel", fontSize: "2rem" }}>no posts yet</h5>
                                <img src={CatSVG} style={{ marginTop: "-60px", width: "300px", height: "300px", opacity: "0.5" }} alt="No posts" />
                            </div>
                        ) : (
                            userProfile.posts.map(item => (
                                <Link key={item._id} to={`/post/${item._id}`}>
                                    <img className="item" key={item._id} src={item.photo} alt={item.title} />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
                : <h2>Loading...</h2>}
        </>
    );
};

export default UserProfile;
