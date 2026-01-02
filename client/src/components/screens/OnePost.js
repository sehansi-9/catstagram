import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App';
import { Link, useParams, useNavigate } from 'react-router-dom';

import {
    getPostById,
    likePost,
    unlikePost,
    addComment,
    deletePost,
    deleteComment,
    getLikedUsers
} from '../../services/postService';

const OnePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const [likedUsers, setLikedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchPost = async () => {
            try {
                const result = await getPostById(id);
                setPost(result.post);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPost();
    }, [id]);

    const updatePostData = (updatedPost) => {
        setPost(prevPost => ({ ...prevPost, ...updatedPost }));
    };

    const handleLikePost = async (postId) => {
        try {
            const result = await likePost(postId);
            if (result) {
                updatePostData({ likes: result.likes });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlikePost = async (postId) => {
        try {
            const result = await unlikePost(postId);
            if (result) {
                updatePostData({ likes: result.likes });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleMakeComment = async (text, postId) => {
        try {
            const result = await addComment(postId, text);
            if (result) {
                updatePostData({ comments: result.comments });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const result = await deleteComment(postId, commentId);
            if (result) {
                updatePostData({ comments: result.comments });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleFetchLikedUsers = async (postId) => {
        try {
            const result = await getLikedUsers(postId);
            setLikedUsers(result.likedUsers);
            setShowModal(true);
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
            navigate('/profile');
        } catch (err) {
            console.log(err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setLikedUsers([]);
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="home">
            <div className="card home-card">
                <div className="card-content user-det">
                    <h5>
                        <div className="user-info">
                            <img src={post.postedby.pic} style={{ width: "40px", height: "40px" }} alt="Post" />
                            <Link to={post.postedby._id !== state._id ? "/profile/" + post.postedby._id : "/profile"}>
                                {post.postedby.name}
                            </Link>
                        </div>
                        {post.postedby._id === state._id &&
                            <i className="material-icons" onClick={() => handleDeletePost(post._id)}>delete</i>
                        }
                    </h5>
                </div>
                <div className="card-image">
                    <img src={post.photo} alt="Post" />
                </div>
                <div className="card-content">
                    {post.likes.includes(state._id) ?
                        <i className="material-icons" style={{ color: "#FE7624" }} onClick={() => handleUnlikePost(post._id)}>favorite</i>
                        :
                        <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => handleLikePost(post._id)}>favorite_border</i>
                    }
                    <h6 className="who-liked" onClick={() => handleFetchLikedUsers(post._id)}>{post.likes.length} likes</h6>
                    <h6>{post.title}</h6>
                    <p>{post.body}</p>
                    <div className="comments-section">
                        {post.comments.map(record => (
                            <h6 key={record._id}>
                                <span style={{ fontWeight: "500" }}>
                                    <Link className="posted-by" to={record.postedby._id !== state._id ? "/profile/" + record.postedby._id : "/profile"}>
                                        {record.postedby.name}
                                    </Link>
                                </span> {record.text}
                                {record.postedby._id === state._id &&
                                    <i className="material-icons" style={{ float: "right" }} onClick={() => handleDeleteComment(post._id, record._id)}>delete</i>
                                }
                            </h6>
                        ))}
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleMakeComment(e.target[0].value, post._id);
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
        </div>
    );
};

export default OnePost;
