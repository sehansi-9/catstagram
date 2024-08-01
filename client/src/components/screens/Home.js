import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App';
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [likedUsers, setLikedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/allposts', {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            setData(result.posts);
        });
    }, []);

    const likePost = (id) => {
        fetch('/like', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(result => {
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, likes: result.likes }; // Update likes count
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
        })
        .catch(err => console.log(err));
    };

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(result => {
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, likes: result.likes }; // Update likes count
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
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
            console.log(result);
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, comments: result.comments }; // Update comments
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
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
            console.log(result);
            const updatedPosts = data.map(post => {
                if (post._id === result._id) {
                    return { ...post, comments: result.comments }; // Update comments
                } else {
                    return post;
                }
            });
            setData(updatedPosts);
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
            console.log(result);
            setLikedUsers(result.likedUsers);
            setShowModal(true);
        })
        .catch(err => console.log(err));
    };

    const closeModal = () => {
        setShowModal(false);
        setLikedUsers([]);
    };
   
    return (
        <div className="home">
    {data.map(item => (
        <div className="card home-card" key={item._id}>
            <div className="card-content user-det">
                <h5>
                    <div className="user-info">
                        <img src={item.postedby.pic} style={{width:"40px", height:"40px"}} alt="Post" />
                        <Link to={item.postedby._id !== state._id ? "/profile/" + item.postedby._id : "/profile"}>
                            {item.postedby.name}
                        </Link>
                    </div>
                    {item.postedby._id === state._id &&
                        <i className="material-icons" onClick={() => deletePost(item._id)}>delete</i>
                    }
                </h5>
            </div>
            <div className="card-image">
                <img src={item.photo} alt="Post" />
            </div>
            <div className="card-content">
                {item.likes.includes(state._id) ?
                    <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => unlikePost(item._id)}>favorite</i>
                    :
                    <i className="material-icons" style={{ color: "#FE7624 " }} onClick={() => likePost(item._id)}>favorite_border</i>
                }
                <h6 className="who-liked" onClick={() => fetchLikedUsers(item._id)}>{item.likes.length} likes</h6>
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
                                            onClick={() => deleteComment(item._id, record._id)}
                                        >
                                            delete
                                        </i>
                                    }
                                </h6>
                            ))}
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            makeComment(e.target[0].value, item._id);
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

export default Home;