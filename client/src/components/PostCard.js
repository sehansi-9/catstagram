import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getLikedUsers } from '../services/postService';

const PostCard = ({
    post,
    onLike,
    onUnlike,
    onComment,
    onDeletePost,
    onDeleteComment
}) => {
    const user = useSelector((state) => state.user);
    const [likedUsers, setLikedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleFetchLikedUsers = async (postId) => {
        try {
            const result = await getLikedUsers(postId);
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
        <div className="card home-card">
            <div className="card-content user-det">
                <h5>
                    <div className="user-info">
                        <img src={post.postedby.pic} style={{ width: "40px", height: "40px" }} alt="Post" />
                        <Link to={post.postedby._id !== user._id ? "/profile/" + post.postedby._id : "/profile"}>
                            {post.postedby.name}
                        </Link>
                    </div>
                    {post.postedby._id === user._id &&
                        <i className="material-icons" onClick={() => setShowDeleteModal(true)} style={{ cursor: "pointer" }}>delete</i>
                    }
                </h5>
            </div>
            <div className="card-image">
                <img src={post.photo} alt="Post" />
            </div>
            <div className="card-content">
                {post.likes.includes(user._id) ?
                    <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => onUnlike(post._id)}>favorite</i>
                    :
                    <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => onLike(post._id)}>favorite_border</i>
                }
                <h6
                    className="who-liked"
                    style={{ cursor: post.likes.length > 0 ? "pointer" : "default" }}
                    onClick={() => {
                        if (post.likes.length > 0) {
                            handleFetchLikedUsers(post._id);
                        }
                    }}
                >
                    {post.likes.length} likes
                </h6>
                <h6>{post.title}</h6>
                <p>{post.body}</p>
                <div className="comments-section">
                    {post.comments.map(record => (
                        <h6 key={record._id}>
                            <span style={{ fontWeight: "500" }}>
                                <Link className="posted-by" to={record.postedby._id !== user._id ? "/profile/" + record.postedby._id : "/profile"}>
                                    {record.postedby.name}
                                </Link>
                            </span> {record.text}
                            {record.postedby._id === user._id &&
                                <i
                                    className="material-icons"
                                    style={{ float: "right" }}
                                    onClick={() => onDeleteComment(post._id, record._id)}
                                >
                                    delete
                                </i>
                            }
                        </h6>
                    ))}
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onComment(e.target[0].value, post._id);
                    e.target[0].value = "";
                }}>
                    <input type="text" placeholder="add a comment" />
                </form>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h4>Liked by:</h4>
                        <ul>
                            {likedUsers.map(u => (
                                <li key={u._id} className="user-list-item">
                                    <img className="user-pic" src={u.pic} style={{ width: "30px", height: "30px", borderRadius: "50%" }} alt="User" />
                                    <Link
                                        className="user-link"
                                        to={u._id !== user._id ? "/profile/" + u._id : "/profile"}
                                        onClick={closeModal}
                                    >
                                        {u.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content" style={{ textAlign: "center" }}>
                        <h4>Confirm Delete</h4>
                        <p>Are you sure you want to delete this post?</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                            <button className="btn red darken-3" onClick={() => {
                                onDeletePost(post._id);
                                setShowDeleteModal(false);
                            }}>Delete</button>
                            <button className="btn grey lighten-1" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
