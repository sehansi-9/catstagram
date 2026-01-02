import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import {
    likePost,
    unlikePost,
    addComment,
    deletePost,
    deleteComment,
    getLikedUsers
} from '../services/postService';

const PostList = ({ fetchPosts, emptyState }) => {
    const [data, setData] = useState([]);
    const { state } = useContext(UserContext);
    const [likedUsers, setLikedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const result = await fetchPosts();
                console.log(result);
                setData(result.posts);
            } catch (err) {
                console.log(err);
            }
        };
        loadPosts();
    }, [fetchPosts]);

    const handleLikePost = async (id) => {
        try {
            const result = await likePost(id);
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, likes: result.likes }; // Update likes count
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlikePost = async (id) => {
        try {
            const result = await unlikePost(id);
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, likes: result.likes }; // Update likes count
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
        } catch (err) {
            console.log(err);
        }
    };

    const handleMakeComment = async (text, postId) => {
        try {
            const result = await addComment(postId, text);
            console.log(result);
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, comments: result.comments }; // Update comments
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const result = await deletePost(postId);
            console.log(result);
            const newData = data.filter(item => item._id !== result._id);
            setData(newData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const result = await deleteComment(postId, commentId);
            console.log(result);
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, comments: result.comments }; // Update comments
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
        } catch (err) {
            console.log(err);
        }
    };

    const handleFetchLikedUsers = async (postId) => {
        try {
            const result = await getLikedUsers(postId);
            console.log(result);
            setLikedUsers(result.likedUsers);
            setShowModal(true);
        } catch (err) {
            console.log(err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setLikedUsers([]);
    };

    return (
        <div className="home">
            {data.length === 0 && emptyState}
            {data.map(item => (
                <div className="card home-card" key={item._id}>
                    <div className="card-content user-det">
                        <h5>
                            <div className="user-info">
                                <img src={item.postedby.pic} style={{ width: "40px", height: "40px" }} alt="Post" />
                                <Link to={item.postedby._id !== state._id ? "/profile/" + item.postedby._id : "/profile"}>
                                    {item.postedby.name}
                                </Link>
                            </div>
                            {item.postedby._id === state._id &&
                                <i className="material-icons" onClick={() => handleDeletePost(item._id)}>delete</i>
                            }
                        </h5>
                    </div>
                    <div className="card-image">
                        <img src={item.photo} alt="Post" />
                    </div>
                    <div className="card-content">
                        {item.likes.includes(state._id) ?
                            <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => handleUnlikePost(item._id)}>favorite</i>
                            :
                            <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => handleLikePost(item._id)}>favorite_border</i>
                        }
                        <h6 className="who-liked" onClick={() => handleFetchLikedUsers(item._id)}>{item.likes.length} likes</h6>
                        <h6>{item.title}</h6>
                        <p>{item.body}</p>
                        <div className="comments-section">
                            {item.comments.map(record => (
                                <h6 key={record._id}>
                                    <span style={{ fontWeight: "500" }}> <Link className="posted-by" to={record.postedby._id !== state._id ? "/profile/" + record.postedby._id : "/profile"}>{record.postedby.name}</Link></span> {record.text}
                                    {record.postedby._id === state._id &&
                                        <i
                                            className="material-icons"
                                            style={{ float: "right" }}
                                            onClick={() => handleDeleteComment(item._id, record._id)}
                                        >
                                            delete
                                        </i>
                                    }
                                </h6>
                            ))}
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleMakeComment(e.target[0].value, item._id);
                            e.target[0].value = ""; // Clear input after submit
                        }}>
                            <input type="text" placeholder="add a comment" />
                        </form>
                    </div>
                </div>
            ))}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h4>Liked by:</h4>
                        <ul>
                            {likedUsers.map(user => (
                                <li key={user._id} className="user-list-item">
                                    <img className="user-pic" src={user.pic} style={{ width: "30px", height: "30px", borderRadius: "50%" }} alt="User" />
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

export default PostList;
