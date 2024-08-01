import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App';
import { Link, useParams, useNavigate } from 'react-router-dom';

const OnePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const [likedUsers, setLikedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    

    useEffect(() => {
        fetch(`/post/${id}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setPost(result.post);
        })
        .catch(err => console.log(err));
    }, [id]);

    const updatePostData = (updatedPost) => {
        setPost(prevPost => ({ ...prevPost, ...updatedPost }));
    };

    const likePost = (postId) => {
        fetch('/like', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: postId })
        })
        .then(res => res.json())
        .then(result => {
            if (result) {
                updatePostData({ likes: result.likes });
            }
        })
        .catch(err => console.log(err));
    };

    const unlikePost = (postId) => {
        fetch('/unlike', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: postId })
        })
        .then(res => res.json())
        .then(result => {
            if (result) {
                updatePostData({ likes: result.likes });
            }
        })
        .catch(err => console.log(err));
    };

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: postId, text: text })
        })
        .then(res => res.json())
        .then(result => {
            if (result) {
                updatePostData({ comments: result.comments });
            }
        })
        .catch(err => console.log(err));
    };

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result) {
                updatePostData({ comments: result.comments });
            }
        })
        .catch(err => console.log(err));
    };

    const fetchLikedUsers = (postId) => {
        fetch(`/likedusers/${postId}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setLikedUsers(result.likedUsers);
            setShowModal(true);
        })
        .catch(err => console.log(err));
    };

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            const newData = data.filter(item => item._id !== result._id);
            setData(newData);
            navigate('/profile');
        })
        .catch(err => console.log(err));
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
                        <i className="material-icons" onClick={() => deletePost(post._id)}>delete</i>
                    }
                </h5>
            </div>
            <div className="card-image">
                <img src={post.photo} alt="Post" />
            </div>
            <div className="card-content">
                {post.likes.includes(state._id) ?
                    <i className="material-icons" style={{ color: "#FE7624" }} onClick={() => unlikePost(post._id)}>favorite</i>
                    :
                    <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => likePost(post._id)}>favorite_border</i>
                }
                <h6 className="who-liked" onClick={() => fetchLikedUsers(post._id)}>{post.likes.length} likes</h6>
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
                                <i className="material-icons" style={{ float: "right" }} onClick={() => deleteComment(post._id, record._id)}>delete</i>
                            }
                        </h6>
                    ))}
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, post._id);
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
