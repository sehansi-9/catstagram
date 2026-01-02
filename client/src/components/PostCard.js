import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getLikedUsers } from '../services/postService';
import { getTimestampFromObjectId, formatTimeAgo } from '../utils/dateUtils';

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
                        <img src={post.postedby.pic} style={{marginTop:"-10px", width: "40px", height: "40px" }} alt="Post" />
                        <div style={{ display: "flex", marginTop:"-5px", flexDirection: "column", alignItems: "flex-start", marginLeft: "10px" }}>
                            <Link to={post.postedby._id !== user._id ? "/profile/" + post.postedby._id : "/profile"}>
                                {post.postedby.name}
                            </Link>
                            <span style={{ fontSize: "12px", color: "grey" }}>
                                {formatTimeAgo(getTimestampFromObjectId(post._id))}
                            </span>
                        </div>
                    </div>
                    {post.postedby._id === user._id &&
                        <i className="material-icons" onClick={() => setShowDeleteModal(true)} style={{ cursor: "pointer" }}>delete</i>
                    }
                </h5>
            </div>
            {/* ... image ... */}
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
                        <CommentItem
                            key={record._id}
                            record={record}
                            post={post}
                            user={user}
                            onDeleteComment={onDeleteComment}
                        />
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

const CommentItem = ({ record, post, user, onDeleteComment }) => {
    const [expanded, setExpanded] = useState(false);
    const maxLength = 100;
    const isLongComment = record.text.length > maxLength;
    const displayText = expanded || !isLongComment ? record.text : record.text.slice(0, maxLength) + "...";

    return (
        <h6 style={{ wordBreak: "break-word", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
                <span style={{ fontWeight: "500" }}>
                    <Link className="posted-by" to={record.postedby._id !== user._id ? "/profile/" + record.postedby._id : "/profile"}>
                        {record.postedby.name}
                    </Link>
                </span>
                {" " + displayText}
                {isLongComment && (
                    <span
                        style={{ color: "gray", cursor: "pointer", marginLeft: "5px", fontSize: "12px" }}
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "show less" : "read more"}
                    </span>
                )}
                <span style={{ fontSize: "11.5px", color: "grey", marginLeft: "8px" }}>
                    {formatTimeAgo(getTimestampFromObjectId(record._id))}
                </span>
            </div>

            {record.postedby._id === user._id &&
                <i
                    className="material-icons"
                    style={{ cursor: "pointer", marginLeft: "10px", fontSize: "18px" }}
                    onClick={() => onDeleteComment(post._id, record._id)}
                >
                    delete
                </i>
            }
        </h6>
    );
};

export default PostCard;
